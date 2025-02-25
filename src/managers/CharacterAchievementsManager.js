const Character = require("../structures/Character");

class CharacterAchievementsManager {
    #achievements = []
    /**
     * 
     * @param {Character} character 
     * @param {Array<string>} achievements
     */
    constructor(character, achievements) {
        this.#achievements = achievements
    }

    has(achievemnt) {
        return this.#achievements.indexOf(achievemnt) != -1
    }
}

module.exports = CharacterAchievementsManager