/**
 * Manages data persistence using localStorage.
 */
export class GameDatabase {
    constructor() {
        this.STORAGE_KEY = 'card_clicker_save_v1';
    }

    /**
     * Save the entire game state.
     * @param {object} state 
     */
    save(state) {
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(this.STORAGE_KEY, serialized);
        } catch (e) {
            console.error("Failed to save game:", e);
        }
    }

    /**
     * Load the game state.
     * @returns {object|null} The saved state or null if none exists.
     */
    load() {
        try {
            const serialized = localStorage.getItem(this.STORAGE_KEY);
            return serialized ? JSON.parse(serialized) : null;
        } catch (e) {
            console.error("Failed to load game:", e);
            return null;
        }
    }

    /**
     * Clear the save file.
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
