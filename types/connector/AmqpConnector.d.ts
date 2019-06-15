import BaseConnector from "./BaseConnector";
import { Connection, Channel } from "amqplib";
/**
 * Amqp Connector, used for receiving and sending messages to an amqp based message queue
 * @extends BaseConnector
 */
declare class AmqpConnector extends BaseConnector {
    client: null | Connection;
    channel: null | Channel;
    options: {
        amqpUrl: string;
        amqpQueue: string;
        sendQueue: string;
    };
    /**
     * Create a new Amqp Connector
     * @param {Object} options - Options
     * @param {String} [options.amqpUrl=amqp://localhost] - amqp host to connect to
     * @param {String} [options.amqpQueue=test-pre-cache] - amqp queue to use for receiving events
     * @param {String} [options.sendQueue=test-post-cache] - amqp queue to use for sending events
     */
    constructor(options: {
        amqpUrl: string;
        amqpQueue: string;
    });
    /**
     * Initializes the connector by creating a new connection to the amqp host set via config and creating a new queue to receive messages from
     * @returns {Promise.<void>}
     */
    initialize(): Promise<void>;
    /**
     * Forward an event to the outgoing amqp queue
     * @param {Object} event - event that should be forwarded, has to be JSON.stringify-able
     * @returns {Promise.<void>}
     */
    send(event: Object): Promise<void>;
}
export default AmqpConnector;
