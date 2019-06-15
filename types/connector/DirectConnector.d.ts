import BaseConnector from "./BaseConnector";
/**
 * Direct Connector, useful when using raincache with an existing solution library that runs in the same process
 * @extends BaseConnector
 */
declare class DirectConnector extends BaseConnector {
    /**
     * Create a new Direct Connector
     */
    constructor();
    /**
     * Init Method, initializes this connector
     * @returns {Promise.<null>}
     */
    initialize(): Promise<void>;
    /**
     * Forward a discord event to RainCache
     * @param {Object} event - received event
     */
    receive(event: Object): void;
    /**
     * Called when RainCache finishes processing of an event
     * @param {Object} event - received event
     */
    send(event: Object): void;
}
export default DirectConnector;
