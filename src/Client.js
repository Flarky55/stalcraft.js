const { EventEmitter } = require("node:events")
const { URLSearchParams } = require("node:url")
const ClanManager = require("./managers/ClanManager")
const CharacterManager = require("./managers/CharacterManager")
const AuctionManager = require("./managers/AuctionManager")

/**
 * @typedef {Object} RegionInfo
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} EmissionInfo
 * @property {string} previousStart
 * @property {string} previousEnd
 */

class Client extends EventEmitter {
    /**
     * 
     * @param {number} id 
     * @param {string} secret 
     */
    constructor(id, secret) {
        super()

        this.clientData = { id, secret }


        this.character = new CharacterManager(this)

        this.clans = new ClanManager(this)

        this.auction = new AuctionManager(this)
    }

    /**
     * Login. Send OAuth request and grab token 
     */
    async login() {
        const data = await fetch("https://exbo.net/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "client_id": this.clientData.id,
                "client_secret": this.clientData.secret,
                "grant_type": "client_credentials",
                "scope": ""
            })
        }).then(res => res.json())


        if ("access_token" in data) {
            this.token = data.access_token
        } else {
            throw new Error("Failed to get access token")
        }

        this.emit("ready")
    }

    /**
     * Check if client is ready (token received)
     * @returns {boolean} isReady
     */
    isReady() {
        return typeof this.token == "string"
    }

    /**
     * Send request to API
     * @param {string} path 
     * @returns {false|Object} result
     */
    async fetch(path) {
        try {
            return await fetch(`https://eapi.stalcraft.net/${path}`, {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            }).then(res => res.json())
        } catch (error) {
            console.error(error)

            return false
        }
    }

    /**
     * Returns list of regions which can be access by api calls
     * @returns {Array<RegionInfo>}
     */
    async regions() {
        if (!this.isReady()) return false

        return await this.fetch("regions")
    }

    /**
     * 
     * @param {string} region
     * @returns {EmissionInfo} Emission data
     */
    async emission(region) {
        if (!this.isReady()) return false

        return await this.fetch(`${region}/emission`)
    }
}

module.exports = Client