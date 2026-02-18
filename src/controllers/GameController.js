import { GameDatabase } from '../database/GameDatabase.js';
import { CardView } from '../views/CardView.js';
import { ShopView } from '../views/ShopView.js';
import { CardType } from '../types/CardType.js';
import { PrestigeLevels, CardTypes } from '../data/GameData.js';
import { formatMoney } from '../utils/Formatter.js';
import { FXView } from '../views/FXView.js';

export class GameController {
    constructor() {
        this.db = new GameDatabase();
        
        // Game State
        this.money = 0;
        this.cards = []; // Array of { instanceId, typeId, x, y }
        this.prestigeTier = 0; // 0=Jeffrey, 1=Maestro, etc.
        
        // Prestige Definitions
        this.prestigeLevels = PrestigeLevels;
        
        // Card Definitions
        this.cardTypes = CardTypes;

        // UI References
        this.moneyEl = document.getElementById('money-value');
        this.prestigeInfoEl = document.getElementById('prestige-display');

        
        this.boardEl = document.getElementById('game-board');
        this.shopEl = document.querySelector('.shop');
        this.shopHandle = document.getElementById('shop-handle');


        // Logic Helpers
        this.nextInstanceId = 1;
        this.draggedCardId = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isResetting = false;

        // Views
        this.shopView = new ShopView(
            null, 
            (type) => this.buyCard(type),
            () => this.attemptPrestige(),
            () => this.attemptReset()
        );
        this.shopView.initTabs();
        this.cardViews = new Map(); // instanceId -> CardView

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.renderUI();
    }

    // --- Helpers ---

    get currentPrestige() {
        const tier = Math.min(this.prestigeTier, this.prestigeLevels.length - 1);
        return this.prestigeLevels[tier];
    }
    
    get totalMultiplier() {
        return this.currentPrestige.multiplier;
    }



    // --- Core ---

    setupEventListeners() {
        // Global Drag & Drop using Pointer Events
        window.addEventListener('mousedown', (e) => this.onDragStart(e));
        window.addEventListener('mousemove', (e) => this.onDragMove(e));
        window.addEventListener('mouseup', (e) => this.onDragEnd(e));

        // Cheat Key (º) - Set Money
        window.addEventListener('keydown', (e) => {
            if (e.key === 'º') {
                const input = prompt("CHEAT: Set Money Amount:", this.money);
                if (input !== null) {
                    const amount = parseFloat(input);
                    if (!isNaN(amount)) {
                        this.money = amount;
                        this.renderUI();
                        this.saveGame();
                    }
                }
            }
        });

        // Click on board to detect card clicks (delegation)
        this.boardEl.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl && !this.isDragging) {
                this.onCardClick(cardEl, e);
            }
        });

        // Shop Toggle
        this.shopHandle.addEventListener('click', () => {
            this.shopEl.classList.toggle('open');
        });

        // Save on unload
        window.addEventListener('beforeunload', () => this.saveGame());
    }

    attemptPrestige() {
        const next = this.prestigeLevels[this.prestigeTier];
        // We need next level config
        if (!next) return;

        if (this.money >= next.targetMoney) {
             if (confirm(`ASCEND TO ${next.nextTierName}? \n\nExisting cards and money will be lost.\nGain ${next.multiplier}x multiplier!`)) {
                this.doPrestige();
            }
        } else {
             alert(`You need $${formatMoney(next.targetMoney)} to ascend!`);
        }
    }

    attemptReset() {
         if(confirm('HARD RESET? This wipes everything including Prestige. Are you sure?')) {
            this.isResetting = true;
            this.db.reset();
            location.reload();
        }
    }

    loadGame() {
        const saved = this.db.load();
        if (saved) {
            this.money = saved.money || 0;
            this.cards = saved.cards || [];
            this.nextInstanceId = saved.nextInstanceId || 1;
            this.prestigeTier = saved.prestigeTier || 0;
            
            // Re-instantiate views
            this.cards.forEach(cardModel => {
                // Migration: novice -> jeffrey
                if (cardModel.typeId === 'novice') cardModel.typeId = 'jeffrey';
                
                this.createCardView(cardModel);
            });
        }
        
        // Ensure at least one card exists
        if (this.cards.length === 0) {
            this.addStarterCard();
        }
    }

    addStarterCard() {
        const starterCard = {
            instanceId: this.nextInstanceId++,
            typeId: 'jeffrey',
            x: 100,
            y: 100
        };
        this.cards.push(starterCard);
        this.createCardView(starterCard);
        this.saveGame();
    }

    saveGame() {
        if (this.isResetting) return;
        const state = {
            money: this.money,
            cards: this.cards,
            nextInstanceId: this.nextInstanceId,
            prestigeTier: this.prestigeTier
        };
        this.db.save(state);
    }

    doPrestige() {
        this.isResetting = true; // Temporary lock
        
        // Update State
        this.prestigeTier++;
        this.money = 0;
        this.cards = [];
        this.nextInstanceId = 1;
        
        // Create new save state immediately
        const state = {
            money: 0,
            cards: [],
            nextInstanceId: 1,
            prestigeTier: this.prestigeTier
        };
        this.db.save(state);
        
        // Reload to refresh everything cleanly
        location.reload();
    }

    buyCard(type) {
        if (this.money >= type.baseCost) {
            this.money -= type.baseCost;
            
            const newCard = {
                instanceId: this.nextInstanceId++,
                typeId: type.id,
                x: 50 + (Math.random() * 200),
                y: 50 + (Math.random() * 200),
            };

            this.cards.push(newCard);
            this.createCardView(newCard);
            this.renderUI();
            this.saveGame(); // Auto-save
        }
    }

    createCardView(cardModel) {
        const type = this.cardTypes.find(t => t.id === cardModel.typeId);
        if (!type) return;

        // We can pass the FORMATTED value to the view if we want, or handle it there.
        // For now, let's just pass raw and let view handle or updated logic.
        const view = new CardView(cardModel, type);
        
        // Update info text

        const infoEl = view.element.querySelector('.card-info');
        if (infoEl) {
            const rawVal = type.clickValue * (this.totalMultiplier);
            infoEl.textContent = `+$${formatMoney(rawVal)}`;
        }

        this.boardEl.appendChild(view.element);
        this.cardViews.set(cardModel.instanceId, view);
    }

    onCardClick(cardEl, event) {
        const id = parseInt(cardEl.dataset.instanceId);
        const cardModel = this.cards.find(c => c.instanceId === id);
        if (!cardModel) return;

        const type = this.cardTypes.find(t => t.id === cardModel.typeId);
        
        // Add Money (Base * Prestige Multiplier)
        const earned = type.clickValue * this.totalMultiplier;
        this.money += earned;
        this.renderUI();

        // FX
        FXView.spawnMoneyPopup(event.clientX, event.clientY, formatMoney(earned));
    }

    // --- Drag Logic (Unchanged) ---
    onDragStart(e) {
        const cardEl = e.target.closest('.card');
        if (!cardEl) return;
        this.draggedCardId = parseInt(cardEl.dataset.instanceId);
        const cardModel = this.cards.find(c => c.instanceId === this.draggedCardId);
        if (cardModel) {
            this.isDragging = true;
            const rect = cardEl.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
        }
    }

    onDragMove(e) {
        if (!this.isDragging || !this.draggedCardId) return;
        const cardView = this.cardViews.get(this.draggedCardId);
        if (cardView) {
            const boardRect = this.boardEl.getBoundingClientRect();
            let newX = e.clientX - boardRect.left - this.dragOffset.x;
            let newY = e.clientY - boardRect.top - this.dragOffset.y;
            // 180 is card width, 252 is card height
            newX = Math.max(0, Math.min(newX, boardRect.width - 180)); 
            newY = Math.max(0, Math.min(newY, boardRect.height - 252)); 
            cardView.model.x = newX;
            cardView.model.y = newY;
            cardView.updatePosition();
        }
    }

    onDragEnd(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedCardId = null;
            this.saveGame();
        }
    }

    // --- Render ---

    renderUI() {
        this.moneyEl.textContent = formatMoney(this.money);
        this.updatePrestigeUI();
        
        // Create a display-ready list for the shop
        const shopList = this.cardTypes.map(t => ({
            ...t,
            displayCost: formatMoney(t.baseCost),
            displayEarn: formatMoney(t.clickValue * this.totalMultiplier)
        }));
        
        // Pass formatted prestige levels too
        const prestigeDisplay = this.prestigeLevels.map(p => ({
            ...p,
            targetMoney: formatMoney(p.targetMoney),
            multiplier: formatMoney(p.multiplier)
        }));

        this.shopView.render(shopList, this.money, prestigeDisplay, this.prestigeTier);
    }

    updatePrestigeUI() {
        const tier = this.currentPrestige;
        this.prestigeInfoEl.textContent = `Tier: ${tier.name} (x${formatMoney(tier.multiplier)})`;
        
        // Button Logic is now handled by ShopView.renderPrestige
    }
}
