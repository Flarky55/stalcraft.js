/**
 * @typedef {Object} CharacterClanInfo
 * @property {import("./ClanManager").ClanInfo} info
 * @property {import("./ClanManager").ClanMember} member
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
    constructor(data) {
        for (const key of Object.keys(data)) {
            Object.defineProperty(this, key, { value: data[key] })
        }

        if ("lastLogin" in data) {
            this.lastLoginTimestamp = Date.parse(data.lastLogin)
        }
    }
}

module.exports = Character