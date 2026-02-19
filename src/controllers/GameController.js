import { GameDatabase } from '../database/GameDatabase.js';
import { CardView } from '../views/CardView.js';
import { ShopView } from '../views/ShopView.js';
import { CardTypes, Upgrades } from '../data/GameData.js';
import { formatMoney } from '../utils/Formatter.js';
import { FXView } from '../views/FXView.js';
import { BouncingBall } from './BouncingBall.js';

export class GameController {
    constructor() {
        this.db = new GameDatabase();
        
        // Game State
        this.money = 0;
        this.cards = []; // Array of { instanceId, typeId, x, y }
        this.upgrades = { arrow: 0, click: 0, ballSize: 0 }; // Store upgrade levels
        
        // Card Definitions
        this.cardTypes = CardTypes;
        this.upgradesData = Upgrades;

        // UI References
        this.moneyEl = document.getElementById('money-value');
        
        this.boardEl = document.getElementById('game-board');
        this.shopEl = document.querySelector('.shop');
        this.shopHandle = document.getElementById('shop-handle');

        // Logic Helpers
        this.nextInstanceId = 1;
        this.draggedCardId = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isResetting = false;

        // Sub-Controllers
        this.bouncingBall = new BouncingBall(this);

        // Views
        this.shopView = new ShopView(
            null, 
            (type) => this.buyCard(type),
            (upgrade) => this.buyUpgrade(upgrade)
        );
        this.shopView.initTabs();
        this.cardViews = new Map(); // instanceId -> CardView

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.renderUI();
        
        // Start Game Loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.bouncingBall.update(dt);

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // --- Helpers ---
    
    get clickMultiplier() {
        const level = this.upgrades.click || 0;
        if (level === 0) return 1;
        
        // Find the upgrade object for current level
        const upgrade = this.upgradesData.click.find(u => u.level === level);
        return upgrade ? upgrade.power : 1;
    }

    get totalMultiplier() {
        return 1; // Base
    }

    getCardCount(typeId) {
        return this.cards.filter(c => c.typeId === typeId).length;
    }

    getCardCost(typeId) {
        const type = this.cardTypes.find(t => t.id === typeId);
        if (!type) return 0;
        const count = this.getCardCount(typeId);
        // Cost Formula: Base * (1.15 ^ count)
        // This ensures the game gets harder as you buy more of the same unit
        return type.baseCost * Math.pow(1.15, count);
    }

    // --- Core ---

    setupEventListeners() {
        // Global Drag & Drop (Mouse + Touch)
        window.addEventListener('mousedown', (e) => this.onDragStart(e));
        window.addEventListener('mousemove', (e) => this.onDragMove(e));
        window.addEventListener('mouseup', (e) => this.onDragEnd(e));
        
        window.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.onDragEnd(e));

        // Cheat Key (º) - Set Money
        window.addEventListener('keydown', (e) => {
            if (e.key === 'º') {
                const input = prompt("TRUCO: Establecer cantidad de dinero:", this.money);
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

        // Hard Reset Button
        const resetBtn = document.getElementById('hard-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.attemptReset());
        }

        // Save on unload
        window.addEventListener('beforeunload', () => this.saveGame());
    }

    attemptReset() {
         if(confirm('¿REINICIO TOTAL? Esto borrará todo tu progreso para siempre. ¿Estás seguro?')) {
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
            this.upgrades = saved.upgrades || { arrow: 0, click: 0, ballSize: 0 };
            
            // Re-instantiate views (Necessary to SEE your saved cards)
            this.cards.forEach(cardModel => {
                this.createCardView(cardModel);
            });

            // Re-Apply Upgrades Logic
            this.reapplyUpgrades();
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
            upgrades: this.upgrades
        };
        this.db.save(state);
    }

    reapplyUpgrades() {
        // Arrow & Ball Size
        if (this.upgrades.arrow > 0) {
            const levelData = this.upgradesData.arrow.find(u => u.level === this.upgrades.arrow);
            this.bouncingBall.setLevel(levelData);
        }
        
        if (this.upgrades.ballSize > 0) {
            const levelData = this.upgradesData.ballSize.find(u => u.level === this.upgrades.ballSize);
            this.bouncingBall.setSize(levelData.size);
        }
    }

    buyCard(type) {
        const cost = this.getCardCost(type.id);
        if (this.money >= cost) {
            this.money -= cost;
            
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

    buyUpgrade(upgrade) {
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            
            // Generic State Update
            // upgrade.id should match the key in this.upgrades (e.g., 'arrow', 'click', 'ballSize')
            this.upgrades[upgrade.id] = upgrade.level;
            
            // Apply Effects
            if (upgrade.id === 'arrow') {
                this.bouncingBall.setLevel(upgrade);
            } else if (upgrade.id === 'ballSize') {
                this.bouncingBall.setSize(upgrade.size);
            }
            // Click power is passive and checked via get clickMultiplier

            this.renderUI();
            this.saveGame();
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
        
        // Add Money (Base * Multipliers)
        // Check if this came from the ball (automated) or user (manual)?
        // For now, let's apply click power to EVERYTHING or just manual?
        // Usually, 'Click Power' implies manual.
        // But BouncingBall uses this same method.
        // Let's inspect event.
        
        let multiplier = this.totalMultiplier;

        // If it's a manual click (real event with isTrusted, or we check a flag)
        // BouncingBall passes a fake event object.
        // Simple way: check event.isAutomated flag (we can pass it from ball)
        
        if (!event.isAutomated) {
             multiplier *= this.clickMultiplier;
        }

        const earned = type.clickValue * multiplier;
        this.money += earned;
        this.renderUI();

        // FX
        FXView.spawnMoneyPopup(event.clientX, event.clientY, formatMoney(earned));
    }

    // --- Drag Logic (Unchanged) ---
    // --- Drag Logic ---

    getEventPos(e) {
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    onDragStart(e) {
        const cardEl = e.target.closest('.card');
        
        // Prevent mouse emulation on touch ONLY if we hit a card
        if (e.type === 'touchstart' && cardEl) {
            e.preventDefault();
        }

        if (!cardEl) return;
        
        this.draggedCardId = parseInt(cardEl.dataset.instanceId);
        const cardModel = this.cards.find(c => c.instanceId === this.draggedCardId);
        
        if (cardModel) {
            this.isDragging = true;
            const pos = this.getEventPos(e);
            
            // Calculate offset relative to the card's top-left
            const rect = cardEl.getBoundingClientRect();
            this.dragOffset.x = pos.x - rect.left;
            this.dragOffset.y = pos.y - rect.top;
        }
    }

    onDragMove(e) {
        if (!this.isDragging || !this.draggedCardId) return;
        e.preventDefault(); // Prevent scrolling/selection
        
        const cardView = this.cardViews.get(this.draggedCardId);
        if (cardView) {
            const pos = this.getEventPos(e);
            const boardRect = this.boardEl.getBoundingClientRect();
            
            let newX = pos.x - boardRect.left - this.dragOffset.x;
            let newY = pos.y - boardRect.top - this.dragOffset.y;
            
            // Constraints (Card size approx 180x252)
            newX = Math.max(0, Math.min(newX, boardRect.width - 180)); 
            newY = Math.max(0, Math.min(newY, boardRect.height - 252)); 
            
            cardView.model.x = newX;
            cardView.model.y = newY;
            cardView.updatePosition();
        }
    }

    onDragEnd(e) {
        if (this.isDragging && this.draggedCardId) {
            
            // User requested: "when you stop dragging... give a click"
            // We can trigger a manual click on the card where it was dropped.
            const cardEl = document.querySelector(`.card[data-instance-id="${this.draggedCardId}"]`);
            if (cardEl) {
                // Synthesize a click event
                // Use last known position or current mouse/touch position if available
                // But e.clientX might be missing in touchend.
                // We can use the card's position.
                const rect = cardEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                this.onCardClick(cardEl, {
                    clientX: centerX,
                    clientY: centerY,
                    isAutomated: false // Treat as manual click (or maybe automated to avoid exploit?)
                    // User said "give a click", implying reward. Let's make it manual compliant.
                });
            }

            this.isDragging = false;
            this.draggedCardId = null;
            this.saveGame();
        }
    }

    // --- Render ---

    renderUI() {
        this.moneyEl.textContent = formatMoney(this.money);
        // this.updatePrestigeUI(); // Removed
        
        // Create a display-ready list for the shop
        const shopList = this.cardTypes.map(t => ({
            ...t,
            currentCost: this.getCardCost(t.id),
            displayCost: formatMoney(this.getCardCost(t.id)),
            displayEarn: formatMoney(t.clickValue * this.totalMultiplier)
        }));
        
        // Pass formatted prestige levels too (Removed)
        // const prestigeDisplay = ...

        this.shopView.render(
            shopList, 
            this.money, 
            this.upgradesData, // Upgrades Data Full Object
            this.upgrades       // Current State
        );
    }
}
