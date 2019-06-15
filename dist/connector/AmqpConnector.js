'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConnector_1 = require("./BaseConnector");
const amqplib_1 = require("amqplib");
/**
 * Amqp Connector, used for receiving and sending messages to an amqp based message queue
 * @extends BaseConnector
 */
class AmqpConnector extends BaseConnector_1.default {
    /**
     * Create a new Amqp Connector
     * @param {Object} options - Options
     * @param {String} [options.amqpUrl=amqp://localhost] - amqp host to connect to
     * @param {String} [options.amqpQueue=test-pre-cache] - amqp queue to use for receiving events
     * @param {String} [options.sendQueue=test-post-cache] - amqp queue to use for sending events
     */
    constructor(options) {
        super();
        this.options = { amqpUrl: 'amqp://localhost', amqpQueue: 'test-pre-cache', sendQueue: 'test-post-cache' };
        Object.assign(this.options, options);
        this.client = null;
        this.channel = null;
        this.ready = false;
    }
    /**
     * Initializes the connector by creating a new connection to the amqp host set via config and creating a new queue to receive messages from
     * @returns {Promise.<void>}
     */
    async initialize() {
        this.client = await amqplib_1.default.connect(this.options.amqpUrl);
        this.channel = await this.client.createChannel();
        this.ready = true;
        this.channel.assertQueue(this.options.amqpQueue, { durable: false, autoDelete: true });
        this.channel.consume(this.options.amqpQueue, (event) => {
            this.channel.ack(event);
            // console.log(event.content.toString());
            this.emit('event', JSON.parse(event.content.toString()));
        });
    }
    /**
     * Forward an event to the outgoing amqp queue
     * @param {Object} event - event that should be forwarded, has to be JSON.stringify-able
     * @returns {Promise.<void>}
     */
    async send(event) {
        this.channel.sendToQueue(this.options.sendQueue, Buffer.from(JSON.stringify(event)));
    }
}
exports.default = AmqpConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW1xcENvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImNvbm5lY3Rvci9BbXFwQ29ubmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYixtREFBNEM7QUFDNUMscUNBQWtEO0FBRWxEOzs7R0FHRztBQUNILE1BQU0sYUFBYyxTQUFRLHVCQUFhO0lBT3JDOzs7Ozs7T0FNRztJQUNILFlBQVksT0FBK0M7UUFDdkQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztRQUN4RyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLGlCQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIseUNBQXlDO1lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBYTtRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7Q0FDSjtBQUVELGtCQUFlLGFBQWEsQ0FBQyJ9