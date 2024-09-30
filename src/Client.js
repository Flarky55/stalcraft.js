const { EventEmitter } = require("node:events")
const { URLSearchParams } = require("node:url")
const ClanManager = require("./managers/ClanManager")
const CharacterManager = require("./managers/CharacterManager")
const AuctionManager = require("./managers/AuctionManager")
const Emission = require("./structures/Emission")

/**
 * @typedef {Object} RegionInfo
 * @property {string} id
 * @property {string} name
 */

class Client extends EventEmitter {
    /**
     * 
     * @param {number} id 
     * @param {string} secret 
     */
    constructor(id, secret) {
        super()

        if (!id || !secret) {
            throw new Error("Client-Id and Client-Secret are required for Client initialization")
        }

        this.clientData = { id, secret }

        this.character = new CharacterManager(this)
        this.clans = new ClanManager(this)
        this.auction = new AuctionManager(this)
    }

    /**
     * Login. Send OAuth request and grab token 
     */
    async login() {
        const response = await fetch("https://exbo.net/oauth/token", {
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
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch access token (${response.status}: ${response.statusText})`)
        }

        const responseData = await response.json()

        if (!("access_token" in responseData)) {
            throw new Error(`Failed to fetch access token`)
        }

        this.setupToken(responseData.access_token)
    }

    /**
     * Setup token
     * @param {string} token 
     */
    setupToken(token) {
        this.token = token

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
     * @returns {Promise<Object>|false} result
     */
    async fetch(path) {
        try {
            if (!this.isReady()) throw new Error("Client is not ready yet");

            const response = await fetch(`https://eapi.stalcraft.net/${path}`, {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch request data (${response.status}: ${response.statusText})`)
            }

            return await response.json()
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
        return await this.fetch("regions")
    }

    /**
     * Returns information about current emission, if any, and recorded time of the previous one.
     * @param {string} region
     * @returns {Promise<Emission>} Emission data
     */
    async emission(region) {
        const res = await this.fetch(`${region}/emission`)

        return new Emission(res)
    }
}

module.exports = Client