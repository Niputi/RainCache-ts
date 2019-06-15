"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * BaseConnector class, provides a common structure for connectors
 * @extends EventEmitter
 * @private
 */
class BaseConnector extends events_1.EventEmitter {
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
exports.default = BaseConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImNvbm5lY3Rvci9CYXNlQ29ubmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXNDO0FBRXRDOzs7O0dBSUc7QUFDSCxNQUFNLGFBQWMsU0FBUSxxQkFBWTtJQUlwQzs7T0FFRztJQUNIO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQUVELGtCQUFlLGFBQWEsQ0FBQyJ9