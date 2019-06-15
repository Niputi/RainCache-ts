"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache used for saving overwrites of permissions belonging to channels
 * @extends BaseCache
 */
class PermissionOverwriteCache extends BaseCache_1.default {
    /**
     * Create a new PermissionOverwriteCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {PermissionOverwrite} [boundObject] - Optional, may be used to bind a permission overwrite object to this cache
     * @property {String} namespace=permissionoverwrite - namespace of the cache, defaults to `permissionoverwrite`
     */
    constructor(storageEngine, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'permissionoverwrite';
        this.boundChannel = '';
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get a permission overwrite via id
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {Promise.<PermissionOverwriteCache|null>} - returns a bound permission overwrite cache or null if nothing was found
     */
    async get(id, channelId = this.boundChannel) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let permissionOverwrite = await this.storageEngine.get(this.buildId(id, channelId));
        if (permissionOverwrite) {
            return new PermissionOverwriteCache(this.storageEngine, permissionOverwrite);
        }
        else {
            return null;
        }
    }
    /**
     * Update a permission overwrite entry in the cache
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {PermissionOverwrite} data - updated permission overwrite data, will be merged with the old data
     * @return {Promise.<PermissionOverwriteCache>} - returns a bound permission overwrite cache
     */
    async update(id, channelId = this.boundChannel, data) {
        if (this.boundObject) {
            this.bindObject(data);
            await this.update(id, channelId, data);
            return this;
        }
        await super.addToIndex(id, channelId);
        await this.storageEngine.upsert(this.buildId(id, channelId), data);
        return new PermissionOverwriteCache(this.storageEngine, data);
    }
    /**
     * Remove a permission overwrite entry from the cache
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {Promise.<void>}
     */
    async remove(id, channelId = this.boundChannel) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id, channelId);
        }
        let permissionOverwrite = await this.storageEngine.get(this.buildId(id, channelId));
        if (permissionOverwrite) {
            await super.removeFromIndex(id, channelId);
            return this.storageEngine.remove(this.buildId(id, channelId));
        }
        else {
            return null;
        }
    }
    /**
     * Filter for permission overwrites by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {String[]} ids - Array of permission overwrite ids, if omitted the permission overwrite index will be used
     * @return {Promise.<PermissionOverwriteCache[]>} - returns an array of bound permission overwrite caches
     */
    async filter(fn, channelId = this.boundChannel, ids = null) {
        let permissionOverwrites = await this.storageEngine.filter(fn, ids, super.buildId(channelId));
        return permissionOverwrites.map(p => new PermissionOverwriteCache(this.storageEngine, p));
    }
    /**
     * Find a permission overwrite by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {String[]} ids - Array of permission overwrite ids, if omitted the permission overwrite index will be used
     * @return {Promise.<PermissionOverwriteCache>} - returns a bound permission overwrite cache
     */
    async find(fn, channelId = this.boundChannel, ids = null) {
        let permissionOverwrite = await this.storageEngine.find(fn, ids, super.buildId(channelId));
        return new PermissionOverwriteCache(this.storageEngine, permissionOverwrite);
    }
    /**
     * Build a unique key for storing the data in the datasource
     * @param {String} permissionId - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {String} - id for saving the permission overwrite
     */
    buildId(permissionId, channelId) {
        if (!channelId) {
            return super.buildId(permissionId);
        }
        return `${this.namespace}.${channelId}.${permissionId}`;
    }
    /**
     * Bind a channel id to this permission overwrite cache
     * @param {String} channelId - id of the channel that belongs to the permission overwrite
     * @return {PermissionOverwriteCache} - returns a permission overwrite cache with boundChannel set to the passed channelId
     */
    bindChannel(channelId) {
        this.boundChannel = channelId;
        this.boundGuild = channelId;
        return this;
    }
}
exports.default = PermissionOverwriteCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbk92ZXJ3cml0ZUNhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2FjaGUvUGVybWlzc2lvbk92ZXJ3cml0ZUNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQW9DO0FBSXBDOzs7R0FHRztBQUNILE1BQU0sd0JBQXlCLFNBQVEsbUJBQVM7SUFFNUM7Ozs7Ozs7T0FPRztJQUNILFlBQVksYUFBZ0MsRUFBRSxXQUFrQztRQUM1RSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsWUFBb0IsSUFBSSxDQUFDLFlBQVk7UUFDdkQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQjtRQUNELElBQUksbUJBQW1CLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3BGLElBQUksbUJBQW1CLEVBQUU7WUFDckIsT0FBTyxJQUFJLHdCQUF3QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztTQUNoRjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQVUsRUFBRSxZQUFvQixJQUFJLENBQUMsWUFBWSxF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