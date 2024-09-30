/**
 * @typedef {Object} EmissionInfo
 * @property {string} previousStart
 * @property {string} previousEnd
 */

class Emission {
    /**
     * 
     * @param {EmissionInfo} param0 
     */
    constructor({ previousStart, previousEnd }) {
        this.previousStart = new Date(previousStart)
        this.previousEnd = new Date(previousEnd)
    }
}

module.exports = Emission