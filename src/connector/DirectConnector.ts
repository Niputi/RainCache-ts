import BaseConnector from "./BaseConnector";

/**
 * Direct Connector, useful when using raincache with an existing solution library that runs in the same process
 * @extends BaseConnector
 */
class DirectConnector extends BaseConnector {
    /**
     * Create a new Direct Connector
     */
    constructor() {
        super();
        this.ready = false;
    }

    /**
     * Init Method, initializes this connector
     * @returns {Promise.<null>}
     */
    async initialize() {
        this.ready = true;
        return Promise.resolve();
    }

    /**
     * Forward a discord event to RainCache
     * @param {Object} event - received event
     */
    receive(event: Object) {
        this.emit('event', event);
    }

    /**
     * Called when RainCache finishes processing of an event
     * @param {Object} event - received event
     */
    send(event: Object) {
        /**
         * @event DirectConnector#send
         * @type {Object}
         * @description Emitted once an event was fully processed by RainCache, you can now forward that event somewhere else
         */
        this.emit('send', event);
    }
}

export default DirectConnector;
