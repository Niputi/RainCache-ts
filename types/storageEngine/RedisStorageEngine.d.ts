import BaseStorageEngine from "./BaseStorageEngine";
import { Redis } from "ioredis";
/**
 * StorageEngine which uses redis as a datasource
 * @extends BaseStorageEngine
 */
declare class RedisStorageEngine implements BaseStorageEngine {
    options: {
        useHash: boolean;
    };
    useHash: boolean;
    ready: boolean;
    client: null | Redis;
    /**
     * Create a new redis storage engine
     * @param {Object} options
     * @param {Boolean} [options.useHash=false] - whether hash objects should be used for storing data
     * @property {Redis} client - redis client
     * @property {Boolean} ready - whether this storage engine is ready for usage
     * @property {Boolean} useHash - whether hash objects should be used for storing data
     * @property {Object} options - options that are passed to the redis client
     */
    constructor(options: {
        useHash: boolean;
    });
    /**
     * Initialize the storage engine and create a connection to redis
     * @returns {Promise.<void>}
     */
    initialize(): Promise<void>;
    /**
     * Get an object from the cache via id
     * @param {String} id - id of the object
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<*>}
     */
    get(id: string, useHash?: boolean): Promise<any>;
    /**
     * Upsert an object into the cache
     * @param {String} id - id of the object
     * @param {Object} updateData - the new Data which get's merged with the old
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<void>}
     */
    upsert(id: string, updateData: Object, useHash?: boolean): Promise<string | number>;
    /**
     * Remove an object from the cache
     * @param {String} id - id of the object
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<void>}
     */
    remove(id: string, useHash?: boolean): Promise<number>;
    /**
     * Filter for an object
     * @param {Function} fn - filter function to use
     * @param {String[]} ids - array of ids that should be used for the filtering
     * @param {String} namespace - namespace of the filter
     * @returns {Promise.<Array.<Object|null>>} - filtered data
     */
    filter<T>(fn: Function, ids: string[], namespace: string): Promise<Array<T | null>>;
    /**
     * Filter for an object and return after the first search success
     * @param {Function} fn - filter function to use
     * @param {String[]} ids - array of ids that should be used for the filtering
     * @param {String} namespace - namespace of the filter
     * @returns {Promise.<Object|null>} - the first result or null if nothing was found
     */
    find<T>(fn: Function, ids: string[] | null, namespace: string): Promise<T | null>;
    /**
     * Get a list of values that are part of a list
     * @param {String} listId - id of the list
     * @returns {Promise.<String[]>} - array of ids that are members of the list
     */
    getListMembers(listId: string): Promise<string[]>;
    /**
     * Add an id (or a list of them) to a list
     * @param {String} listId - id of the list
     * @param {String[]} ids - array of ids that should be added
     * @returns {Promise.<void>}
     */
    addToList(listId: string, ids: string[] | string): Promise<void>;
    /**
     * Check if an id is part of a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be checked
     * @returns {Promise.<boolean>}
     */
    isListMember(listId: string, id: string): Promise<boolean>;
    /**
     * Remove an id from a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be removed
     * @returns {Promise.<void>}
     */
    removeFromList(listId: string, id: string): Promise<void>;
    /**
     * Remove a list
     * @param {String} listId - id of the list
     * @returns {Promise.<void>}
     */
    removeList(listId: string): Promise<number>;
    /**
     * Get the amount of items within a list
     * @param {String} listId - id of the list
     * @returns {Promise.<*>}
     */
    getListCount(listId: string): Promise<number>;
    /**
     * Prepare data for storage inside redis
     * @param data
     */
    prepareData(data: Object): string;
    /**
     * Parse loaded data
     * @param data
     * @returns {Object|null}
     */
    parseData(data: string): Promise<Object | null>;
    /**
     * Prepare a namespace for a KEYS operation by adding a * at the end
     * @param {String} namespace - namespace to prepare
     * @returns {string} namespace + *
     */
    prepareNamespace(namespace: string): string;
}
export default RedisStorageEngine;
