const BaseManager = require("./BaseManager");

/**
 * @typedef {Object} PriceEntry
 * @property {number} amount
 * @property {number} price
 * @property {string} time
 * @property {Object} additional 
 */

/**
 * @typedef {Object} PricesListing
 * @property {number} total
 * @property {Array<PriceEntry>} prices
 */

/**
 * @typedef {Object} Lot
 * @property {string} itemId
 * @property {number} amount
 * @property {number} startPrice
 * @property {number} currentPrice
 * @property {number} buyoutPrice
 * @property {string} startTime
 * @property {string} endTime
 * @property {Object} additional
 */

/**
 * @typedef {Object} LotListring
 * @property {number} total
 * @property {Array<Lot>} lots
 */

class AuctionManager extends BaseManager {
    /**
     * Returns history of prices for lots which were bought from auction for the given item. 
     * Prices are sorted in descending order by recorded time of purchase.
     * @param {string} region 
     * @param {string} item 
     * @param {boolean} [additional]
     * @param {number} [limit]
     * @param {number} [offset] 
     * @returns {PricesListing}
     */
    async history(region, item, additional, limit, offset) {
        const path = new URLSearchParams(`${region}/auction/${item}/history`)
        if (additional) path.append("additional", additional);
        if (limit) path.append("limit", limit);
        if (offset) path.append("offset", offset);

        return await this.client.fetch(path.toString())
    }

    /**
     * Returns list of currently active lots on the auction for the given item. 
     * Lots are sorted based on given parameter.
     * @param {string} region 
     * @param {string} item 
     * @param {boolean} [additional]
     * @param {number} [limit] 
     * @param {number} [offset]
     * @param {'asc'|'desc'} [order]
     * @param {'time_created'|'time_left'|'current_price'|'buyout_price'} [sort]
     * @returns {LotListring}
     */
    async lots(region, item, additional, limit, offset, order, sort) {
        const path = new URLSearchParams(`${region}/auction/${item}/lots`)
        if (additional) path.append("additional", additional);
        if (limit) path.append("limit", limit);
        if (offset) path.append("offset", offset);
        if (order) path.append("order", order);
        if (sort) path.append("sort", sort);

        return await this.client.fetch(path.toString())
    }
}

module.exports = AuctionManager