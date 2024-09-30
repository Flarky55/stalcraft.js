const CharacterStatisticsManager = require("../managers/CharacterStatisticsManager");

/**
 * @typedef {Object} CharacterClanInfo
 * @property {import("../managers/ClanManager").ClanInfo} info
 * @property {import("../managers/ClanManager").ClanMember} member
 */

/**
 * @typedef {Object} CharacterStatValue
 * @property {string} id
 * @property {'INTEGER'|'DECIMAL'|'DATE'|'DURATION'} type
 * @property {Object} value
 */

/**
 * @typedef {Object} CharacterProfileData
 * @property {string} username
 * @property {string} uuid
 * @property {string} status
 * @property {string} alliance
 * @property {string} [lastLogin]
 * @property {Array<string>} displayedAchievements
 * @property {CharacterClanInfo} [clan]
 * @property {Array<CharacterStatValue>} stats
 */

class Character {
    /**
     * 
     * @param {CharacterProfileData} data 
     */

    constructor({ username, uuid, status, alliance, lastLogin = null, displayedAchievements = [], clan = null, stats = [] }) {
        this.username = username;
        this.uuid = uuid;
        this.status = status;
        this.alliance = alliance;
        if (lastLogin) {
            /** @type {Date|null} */
            this.lastLogin = new Date(lastLogin);
        }
        this.displayedAchievements = displayedAchievements;
        this.clan = clan;
        this.stats = new CharacterStatisticsManager(this, stats);
    }
}

module.exports = Character