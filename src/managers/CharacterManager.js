const Character = require("../structures/Character");
const BaseManager = require("./BaseManager");

class CharacterManager extends BaseManager {
    /**
     * Returns information about player's profile. 
     * Includes alliance, profile description, last login time, stats, etc.
     * @param {string} region 
     * @param {string} character
     * @returns {Character}
     */
    async profile(region, character) {
        const data = await this.client.fetch(`${region}/character/by-name/${character}/profile`)

        return new Character(data)
    }
}

module.exports = CharacterManager