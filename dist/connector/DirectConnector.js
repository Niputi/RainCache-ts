"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConnector_1 = require("./BaseConnector");
/**
 * Direct Connector, useful when using raincache with an existing solution library that runs in the same process
 * @extends BaseConnector
 */
class DirectConnector extends BaseConnector_1.default {
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
    receive(event) {
        this.emit('event', event);
    }
    /**
     * Called when RainCache finishes processing of an event
     * @param {Object} event - received event
     */
    send(event) {
        /**
         * @event DirectConnector#send
         * @type {Object}
         * @description Emitted once an event was fully processed by RainCache, you can now forward that event somewhere else
         */
        this.emit('send', event);
    }
}
exports.default = DirectConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlyZWN0Q29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29ubmVjdG9yL0RpcmVjdENvbm5lY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUE0QztBQUU1Qzs7O0dBR0c7QUFDSCxNQUFNLGVBQWdCLFNBQVEsdUJBQWE7SUFDdkM7O09BRUc7SUFDSDtRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU8sQ0FBQyxLQUFhO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLENBQUMsS0FBYTtRQUNkOzs7O1dBSUc7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxlQUFlLENBQUMifQ==