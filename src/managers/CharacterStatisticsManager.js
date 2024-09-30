const EventEmitter = require("events");
const Character = require("../structures/Character");

const databaseStats = new Map();


/**
 * @typedef {Object} Lines
 * @property {string} ru
 * @property {string} en
 * @private
 */
/**
 * @typedef {Object} Name
 * @property {string} type
 * @property {string} key
 * @property {Object} args
 * @property {Lines} lines
 * @private
 */
/**
 * @typedef {Object} Combined
 * @property {string} category
 * @property {Name} name
 * @private
 */

/**
 * @typedef {import("../structures/Character").CharacterStatValue & Combined} CharacterStatValueFull
 */


class CharacterStatisticsManager {
    /**
     * 
     * @param {Character} character
     * @param {Array<import("../structures/Character").CharacterStatValue>} stats 
     */

    #mapId = new Map()
    #mapCategory = new Map()

    constructor(character, stats) {
        Object.defineProperty(this, "character", { value: character })

        /** @private */
        this.stats = stats
    }

    /**
     * 
     * @param {string} id 
     * @returns {CharacterStatValueFull}
     */
    async getById(id) {
        if (this.#mapId.size == 0) await this.#populateIds();

        return this.#mapId.get(id)
    }

    /**
     * 
     * @param {string} category 
     * @returns {Array<CharacterStatValueFull>}
     */
    async getByCategory(category) {
        if (this.#mapCategory.size == 0) await this.#populateCategories();

        return this.#mapCategory.get(category)
    }

    async #populateIds() {
        if (databaseStats.size == 0) await this.#fetchDatabase();

        for (const entry of this.stats) {
            const entryDatabase = databaseStats.get(entry.id)

            this.#mapId.set(entry.id, Object.assign(entry, entryDatabase))
        }
    }

    async #populateCategories() {
        if (databaseStats.size == 0) await this.#fetchDatabase();

        for (const entry of this.stats) {
            const entryDatabase = databaseStats.get(entry.id)
            const category = entryDatabase.category

            if (!this.#mapCategory.has(category)) {
                this.#mapCategory.set(category, [])
            }
            this.#mapCategory.get(category).push(Object.assign(entry, entryDatabase))
        }
    }

    async #fetchDatabase() {
        const response = await fetch("https://raw.githubusercontent.com/EXBO-Studio/stalcraft-database/refs/heads/main/ru/stats.json")
        if (!response.ok) throw new Error("Failed to fetch stats.json");

        for (const entry of await response.json()) {
            databaseStats.set(entry.id, entry)
        }
    }
}

module.exports = CharacterStatisticsManager