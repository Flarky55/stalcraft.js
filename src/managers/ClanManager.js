const BaseManager = require("./BaseManager");

/**
 * @typedef {Object} ClanInfo
 * @property {string} id
 * @property {string} name
 * @property {string} tag
 * @property {number} level
 * @property {number} levelPoints
 * @property {string} registrationTime
 * @property {string} [alliance]
 * @property {string} description
 * @property {string} leader
 * @property {number} memberCount
 */

/**
 * @typedef {Object} ClanMember
 * @property {string} name
 * @property {('RECRUIT'|'COMMONER'|'SOLDIER'|'SERGEANT'|'OFFICER'|'COLONEL'|'LEADER')} rank
 * @property {string} joinTime
 */

class ClanManager extends BaseManager {
    /**
     * Returns all clans which are currently registered in the game on specified region.
     * @param {string} region 
     * @param {number} [limit] 
     * @param {number} [offset]
     */
    async list(region, limit, offset) {
        const path = new URLSearchParams(`${region}/clans`)
        if (limit) path.append("limit", limit);
        if (offset) path.append("offset", offset);

        return await this.client.fetch(path.toString())
    }

    /**
     * Returns information about the given clan
     * @param {string} region 
     * @param {string} clanId 
     * @returns {ClanInfo}
     */
    async info(region, clanId) {
        return await this.client.fetch(`${region}/clan/${clanId}/info`)
    }
}

module.exports = ClanManager