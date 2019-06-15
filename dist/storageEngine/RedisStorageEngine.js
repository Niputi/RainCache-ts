"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
/**
 * StorageEngine which uses redis as a datasource
 * @extends BaseStorageEngine
 */
class RedisStorageEngine {
    /**
     * Create a new redis storage engine
     * @param {Object} options
     * @param {Boolean} [options.useHash=false] - whether hash objects should be used for storing data
     * @property {Redis} client - redis client
     * @property {Boolean} ready - whether this storage engine is ready for usage
     * @property {Boolean} useHash - whether hash objects should be used for storing data
     * @property {Object} options - options that are passed to the redis client
     */
    constructor(options) {
        this.client = null;
        this.ready = false;
        this.useHash = options.useHash || false;
        this.options = options;
    }
    /**
     * Initialize the storage engine and create a connection to redis
     * @returns {Promise.<void>}
     */
    initialize() {
        return new Promise((res) => {
            this.client = new ioredis_1.default();
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
    async get(id, useHash = this.useHash) {
        if (useHash) {
            return this.client.hgetall(id);
        }
        else {
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
    async upsert(id, updateData, useHash = this.useHash) {
        let data;
        if (useHash) {
            return this.client.hmset(id, updateData);
        }
        else {
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
    async remove(id, useHash = this.useHash) {
        if (useHash) {
            let hashKeys = await this.client.hkeys(id);
            return this.client.hdel(id, hashKeys);
        }
        else {
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
    async filter(fn, ids, namespace) {
        let resolvedDataArray = [];
        let data = [];
        if (!ids) {
            data = await this.getListMembers(namespace);
        }
        else {
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
    async find(fn, ids = null, namespace) {
        let data = [];
        if (typeof ids === 'string' && !namespace) {
            namespace = ids;
            ids = null;
        }
        if (!ids) {
            data = await this.getListMembers(namespace);
        }
        else {
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
    async getListMembers(listId) {
        return this.client.smembers(listId);
    }
    /**
     * Add an id (or a list of them) to a list
     * @param {String} listId - id of the list
     * @param {String[]} ids - array of ids that should be added
     * @returns {Promise.<void>}
     */
    async addToList(listId, ids) {
        return this.client.sadd(listId, ids);
    }
    /**
     * Check if an id is part of a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be checked
     * @returns {Promise.<boolean>}
     */
    async isListMember(listId, id) {
        let res = await this.client.sismember(listId, id);
        return res === 1;
    }
    /**
     * Remove an id from a list
     * @param {String} listId - id of the list
     * @param {String} id - id that should be removed
     * @returns {Promise.<void>}
     */
    async removeFromList(listId, id) {
        return this.client.srem(listId, id);
    }
    /**
     * Remove a list
     * @param {String} listId - id of the list
     * @returns {Promise.<void>}
     */
    async removeList(listId) {
        return this.remove(listId, false);
    }
    /**
     * Get the amount of items within a list
     * @param {String} listId - id of the list
     * @returns {Promise.<*>}
     */
    async getListCount(listId) {
        return this.client.scard(listId);
    }
    /**
     * Prepare data for storage inside redis
     * @param data
     */
    prepareData(data) {
        return JSON.stringify(data);
    }
    /**
     * Parse loaded data
     * @param data
     * @returns {Object|null}
     */
    parseData(data) {
        return data ? JSON.parse(data) : null;
    }
    /**
     * Prepare a namespace for a KEYS operation by adding a * at the end
     * @param {String} namespace - namespace to prepare
     * @returns {string} namespace + *
     */
    prepareNamespace(namespace) {
        return namespace.endsWith('*') ? namespace : namespace + '*';
    }
}
exports.default = RedisStorageEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVkaXNTdG9yYWdlRW5naW5lLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3RvcmFnZUVuZ2luZS9SZWRpc1N0b3JhZ2VFbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxQ0FBMkM7QUFFM0M7OztHQUdHO0FBQ0gsTUFBTSxrQkFBa0I7SUFVcEI7Ozs7Ozs7O09BUUc7SUFDSCxZQUFZLE9BQTRCO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILFVBQVU7UUFDTixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFXLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDbEIsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPO1FBQ3hDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsQzthQUFNO1lBQ0gsSUFBSSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENB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