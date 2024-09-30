const Client = require("../Client");

class BaseManager {
    /**
     * 
     * @type {Client}
     * @private
     * @readonly
     */
    client

    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        Object.defineProperty(this, "client", { value: client })
    }
}

module.exports = BaseManager