/**
 * Manages the Shop UI.
 */
export class ShopView {
    constructor(containerIds, onBuyCallback, onPrestigeCallback, onResetCallback) {
        this.cardsContainer = document.getElementById('shop-items');
        this.prestigeContainer = document.getElementById('prestige-list');
        
        this.onBuy = onBuyCallback;
        this.onPrestige = onPrestigeCallback;
        this.onReset = onResetCallback;
    }

    initTabs() {
        const tabCards = document.getElementById('tab-cards');
        const tabPrestige = document.getElementById('tab-prestige');
        const contentCards = document.getElementById('shop-content-cards');
        const contentPrestige = document.getElementById('shop-content-prestige');

        tabCards.addEventListener('click', () => {
            tabCards.classList.add('active');
            tabPrestige.classList.remove('active');
            contentCards.style.display = 'flex';
            contentPrestige.style.display = 'none';
        });

        tabPrestige.addEventListener('click', () => {
            tabPrestige.classList.add('active');
            tabCards.classList.remove('active');
            contentCards.style.display = 'none';
            contentPrestige.style.display = 'flex';
        });
    }

    render(cardTypes, currentMoney, prestigeLevels = [], currentPrestigeTier = 0) {
        this.renderCards(cardTypes, currentMoney);
        this.renderPrestige(prestigeLevels, currentPrestigeTier, currentMoney);
    }

    renderCards(cardTypes, currentMoney) {
        // Only build if empty
        if (this.cardsContainer.children.length === 0) {
             cardTypes.forEach(type => {
                const item = document.createElement('div');
                item.classList.add('shop-item');
                item.dataset.id = type.id;
                item.innerHTML = `
                    <img src="${type.imageSrc}" alt="${type.name}">
                    <div>
                        <strong>${type.name}</strong><br>
                        <small class="earn-display"></small>
                    </div>
                    <button class="shop-btn">Comprar</button>
                `;
                const btn = item.querySelector('button');
                btn.addEventListener('click', () => this.onBuy(type));
                this.cardsContainer.appendChild(item);
            });
        }

        // Update existing items
        Array.from(this.cardsContainer.children).forEach((item, index) => {
            const type = cardTypes[index];
            if (!type) return;

            const canAfford = currentMoney >= type.baseCost;
            const btn = item.querySelector('button');
            const earn = item.querySelector('.earn-display');
            
            // Update Text
            earn.textContent = `Genera: $${type.displayEarn || '?'}/clic`;
            btn.textContent = `Comprar ($${(type.displayCost || type.baseCost)})`;
            btn.disabled = !canAfford;
        });
    }

    renderPrestige(levels, currentTier, currentMoney) {
        if (!this.prestigeContainer) return;
        
        if (this.prestigeContainer.children.length === 0) {
             levels.forEach((level, index) => {
                const item = document.createElement('div');
                item.classList.add('prestige-item');
                item.innerHTML = `
                    <h4>${level.name} <span class="status-text"></span></h4>
                    <div class="prestige-bonus">Multiplicador: x${level.multiplier.toLocaleString()}</div>
                    <div class="prestige-cost-container"></div>
                    <div class="action-container"></div>
                `;
                this.prestigeContainer.appendChild(item);
            });
             // Hard Reset
            const resetDiv = document.createElement('div');
            resetDiv.style.marginTop = '20px';
            resetDiv.style.textAlign = 'center';
            resetDiv.innerHTML = `<button class="btn warning small">Reiniciar Juego (Hard Reset)</button>`;
            resetDiv.querySelector('button').addEventListener('click', () => this.onReset());
            this.prestigeContainer.appendChild(resetDiv);
        }
        
        // Update
        const items = this.prestigeContainer.querySelectorAll('.prestige-item');
        levels.forEach((level, index) => {
            if (!items[index]) return;
            const item = items[index];
            
            const isNext = index === currentTier + 1;
            const isLocked = index > currentTier + 1;

            item.className = 'prestige-item';
            if (isLocked) item.classList.add('locked');
            if (index === currentTier) item.style.borderColor = '#2ed573';
            else item.style.borderColor = '#ffd700';

            let statusText = '';
            if (index === currentTier) statusText = '(Activo)';
            else if (index < currentTier) statusText = '(Superado)';
            else if (isNext) statusText = '(Siguiente Meta)';
            else statusText = '(Bloqueado)';
            
            item.querySelector('.status-text').textContent = statusText;
            
            // Goal Logic
            const costContainer = item.querySelector('.prestige-cost-container');
            if (index > 0) {
               costContainer.innerHTML = `<div class="prestige-cost">Meta: ${levels[index-1].targetMoney.toLocaleString(undefined, {notation:"compact"})}</div>`;
            } else {
               costContainer.innerHTML = '';
            }

            // Action
            const actionContainer = item.querySelector('.action-container');
            if (isNext) {
                 if (!actionContainer.querySelector('button')) {
                      const btn = document.createElement('button');
                      btn.className = 'btn prestige-action';
                      btn.textContent = 'ASCENDER';
                      btn.addEventListener('click', () => this.onPrestige());
                      actionContainer.appendChild(btn);
                 }
            } else {
                actionContainer.innerHTML = '';
            }
        });
    }
}
