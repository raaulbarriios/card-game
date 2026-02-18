/**
 * Manages the DOM representation of a single card.
 */
export class CardView {
    /**
     * @param {object} cardModel - The data object for this card instance
     * @param {CardType} cardType - The type definition
     */
    constructor(cardModel, cardType) {
        this.model = cardModel;
        this.type = cardType;
        this.element = this.createHTMLElement();
        this.updatePosition();
    }

    createHTMLElement() {
        const el = document.createElement('div');
        el.classList.add('card');
        el.id = `card-${this.model.instanceId}`;
        
        const imgSrc = this.type.imageSrc;

        el.innerHTML = `
            <img src="${imgSrc}" alt="${this.type.name}" draggable="false">
            <div class="card-info">+$${this.type.clickValue}</div>
        `;

        // Store reference to this view on the element for easy retrieval
        el.dataset.instanceId = this.model.instanceId;
        
        return el;
    }

    updatePosition() {
        this.element.style.left = `${this.model.x}px`;
        this.element.style.top = `${this.model.y}px`;
    }

    /**
     * Updates the image (e.g. after customization)
     */
    updateImage(newSrc) {
        const img = this.element.querySelector('img');
        if (img) img.src = newSrc;
    }
}
