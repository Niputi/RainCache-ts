import BaseStorageEngine from "./BaseStorageEngine";
import RedisClient, {Redis} from "ioredis";

/**
 * StorageEngine which uses redis as a datasource
 * @extends BaseStorageEngine
 */
class RedisStorageEngine implements BaseStorageEngine {

    options: { useHash: boolean }

    // temp
    useHash: boolean

    ready: boolean
    client: null | Redis

    /**
     * Create a new redis storage engine
     * @param {Object} options
     * @param {Boolean} [options.useHash=false] - whether hash objects should be used for storing data
     * @property {Redis} client - redis client
     * @property {Boolean} ready - whether this storage engine is ready for usage
     * @property {Boolean} useHash - whether hash objects should be used for storing data
     * @property {Object} options - options that are passed to the redis client
     */
    constructor(options: {useHash:  boolean}) {
        this.client = null;
        this.ready = false;
        this.useHash = options.useHash || false;
        this.options = options;
    }

    /**
     * Initialize the storage engine and create a connection to redis
     * @returns {Promise.<void>}
     */
    initialize() : Promise<void> {
        return new Promise((res) => {
            this.client = new RedisClient();
            this.client.once('ready', () => {
                this.ready = true;
                return res();
            });
        });

    }

    /**
     * Get an object from the cache via id
     * @param {String} id - id of the object
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<*>}
     */
    async get(id: string, useHash = this.useHash): Promise<any> {
        if (useHash) {
            return this.client.hgetall(id);
        } else {
            let rawData = await this.client.get(id);
            return this.parseData(rawData);
        }
    }

    /**
     * Upsert an object into the cache
     * @param {String} id - id of the object
     * @param {Object} updateData - the new Data which get's merged with the old
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<void>}
     */
    async upsert(id: string, updateData: Object, useHash = this.useHash) : Promise<string | number> {
        let data;
        if (useHash) {
            return this.client.hmset(id, updateData);
        } else {
            data = await this.get(id);
            data = data || {};
            Object.assign(data, updateData);
            return this.client.set(id, this.prepareData(data));
        }
    }

    /**
     * Remove an object from the cache
     * @param {String} id - id of the object
     * @param {Boolean} useHash - whether to use hash objects for this action
     * @returns {Promise.<void>}
     */
    async remove(id : string, useHash = this.useHash) : Promise<number> {
        if (useHash) {
            let hashKeys = await this.client.hkeys(id);
            return this.client.hdel(id, hashKeys);
        } else {
            return this.client.del(id);
        }
    }

    /**
     * Filter for an object
     * @param {Function} fn - filter function to use
     * @param {String[]} ids - array of ids that should be used for the filtering
     * @param {String} namespace - namespace of the filter
     * @returns {Promise.<Array.<Object|null>>} - filtered data
     */
    async filter<T>(fn: Function, ids: string[], namespace: string): Promise<Array<T | null>> {
        let resolvedDataArray = [];
        let data = [];
        if (!ids) {
            data = await this.getListMembers(namespace);
        } else {
            data = ids;
        }
        data = data.map(id => `${namespace}.${id}`);
        for (let key of data) {
            let resolvedData = await this.get(key);
            resolvedDataArray.push(resolvedData);
        }
        //@ts-ignore
        return resolvedDataArray.filter(fn);
    }

    /**
     * Filter for an object and return after the first search success
     * @param {Function} fn - filter function to use
     * @param {String[]} ids - array of ids that should be used for the filtering
     * @param {String} namespace - namespace of the filter
     * @returns {Promise.<Object|null>} - the first result or null if nothing was found
     */
    async find<T>(fn:  Function, ids: string[] | null = null, namespace: string): Promise<T | null> {
        let data = [];
        if (typeof ids === 'string' && !namespace) {
            namespace = ids;
            ids = null;
        }
        if (!ids) {
            data = await this.getListMembers(namespace);
        } else {
            data = ids;
        }
        data = data.map(id => `${namespace}.${id}`);
        for (let key of data) {
            let resolvedData = await this.get(key);
            if (fn(resolvedData)) {
                return resolvedData;
            }
        }
    }

    /**
     * Get a list of values that are part of a list
     * @param {String} listId - id of the list
     * @returns {Promise.<String[]>} - array of ids that are members of the list
     */
    async getListMembers(listId: string) : Promise<string[]> {
        return this.client.smembers(listId);
    }

    /**
     * Add an id (or a list of them) to a list
     * @param {String} listId - id of the list
     * @param {String[]} ids - array of ids that should be added
     * @returns {Promise.<void>}
     */
    async addToList(listId: string, ids: string[] | string) : Promise<void> {
        return this.client.sadd(listId, ids);
    }

    /**
     * Check if an id is part of a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be checked
     * @returns {Promise.<boolean>}
     */
    async isListMember(listId : string, id: string) : Promise<boolean> {
        let res = await this.client.sismember(listId, id);
        return res === 1;
    }

    /**
     * Remove an id from a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be removed
     * @returns {Promise.<void>}
     */
    async removeFromList(listId: string, id: string) :Promise<void> {
        return this.client.srem(listId, id);
    }

    /**
     * Remove a list
     * @param {String} listId - id of the list
     * @returns {Promise.<void>}
     */
    async removeList(listId : string): Promise<number> {
        return this.remove(listId, false);
    }

    /**
     * Get the amount of items within a list
     * @param {String} listId - id of the list
     * @returns {Promise.<*>}
     */
    async getListCount(listId : string) : Promise<number> {
        return this.client.scard(listId);
    }

    /**
     * Prepare data for storage inside redis
     * @param data
     */
    prepareData(data : Object) {
        return JSON.stringify(data);
    }

    /**
     * Parse loaded data
     * @param data
     * @returns {Object|null}
     */
    parseData(data: string) : Promise<Object| null> {
        return data ? JSON.parse(data) : null;
    }

    /**
     * Prepare a namespace for a KEYS operation by adding a * at the end
     * @param {String} namespace - namespace to prepare
     * @returns {string} namespace + *
     */
    prepareNamespace(namespace: string): string {
        return namespace.endsWith('*') ? namespace : namespace + '*';
    }
}

export default RedisStorageEngine;
