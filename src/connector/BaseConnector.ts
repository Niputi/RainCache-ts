import { EventEmitter } from "events";

/**
 * BaseConnector class, provides a common structure for connectors
 * @extends EventEmitter
 * @private
 */
class BaseConnector extends EventEmitter {

    ready: boolean

    /**
     * @private
     */
    constructor() {
        super();
        this.ready = false;
    }

    initialize() {
        this.ready = true;
        return Promise.resolve();
    }
}

export default BaseConnector;
