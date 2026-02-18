/**
 * Defines a type of card available in the game.
 */
export class CardType {
  /**
   * @param {string} id - Unique identifier (e.g., 'basic', 'gold')
   * @param {string} name - Display name
   * @param {number} baseCost - Cost to purchase
   * @param {number} clickValue - Money earned per click
   * @param {string} imageSrc - Default image URL
   */
  constructor(id, name, baseCost, clickValue, imageSrc) {
    this.id = id;
    this.name = name;
    this.baseCost = baseCost;
    this.clickValue = clickValue;
    this.imageSrc = imageSrc;
  }
}
