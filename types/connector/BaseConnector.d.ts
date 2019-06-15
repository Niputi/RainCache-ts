/// <reference types="node" />
import { EventEmitter } from "events";
/**
 * BaseConnector class, provides a common structure for connectors
 * @extends EventEmitter
 * @private
 */
declare class BaseConnector extends EventEmitter {
    ready: boolean;
    /**
     * @private
     */
    constructor();
    initialize(): Promise<void>;
}
export default BaseConnector;
