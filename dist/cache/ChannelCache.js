"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache responsible for storing channel related data
 * @extends BaseCache
 */
class ChannelCache extends BaseCache_1.default {
    /**
     * Create a new ChanneCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {ChannelMapCache} channelMap - Instantiated ChannelMap class
     * @param {PermissionOverwriteCache} permissionOverwriteCache - Instantiated PermissionOverwriteCache class
     * @param {UserCache} userCache - Instantiated UserCache class
     * @param {TChannel} [boundObject] - Optional, may be used to bind a channel object to this cache
     * @property {String} namespace=channel - namespace of the cache, defaults to `channel`
     * @property {ChannelMapCache} guildChannelMap - Instantiated ChannelMap class
     * @property {PermissionOverwriteCache} permissionOverwrites - Instantiated PermissionOverwrite class
     * @property {UserCache} recipients - Instantiated UserCache class
     */
    constructor(storageEngine, channelMap, permissionOverwriteCache, userCache, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'channel';
        this.channelMap = channelMap;
        this.permissionOverwrites = permissionOverwriteCache;
        this.recipients = userCache;
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get a channel via id
     * @param {String} id - id of the channel
     * @returns {Promise.<ChannelCache|null>} - ChannelCache with bound object or null if nothing was found
     */
    async get(id) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let channel = await this.storageEngine.get(this.buildId(id));
        if (channel) {
            return new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(channel.id), this.recipients, channel);
        }
        else {
            return null;
        }
    }
    /**
     * Upsert a channel into the cache
     * @param {String} id - id of the channel
     * @param {Object} data - data to insert
     * @returns {Promise.<ChannelCache>}
     */
    async update(id, data) {
        if (this.boundObject) {
            this.bindObject(data); //using bindobject() to assure the data of the class is valid
            await this.update(this.boundObject.id, data);
            return this;
        }
        if (data.guild_id) {
            await this.channelMap.update(data.guild_id, [data.id]);
        }
        else if (data.recipients) {
            if (data.recipients[0]) {
                await this.channelMap.update(data.recipients[0].id, [data.id], 'user');
            }
        }
        if (data.permission_overwrites) {
            for (let overwrite of data.permission_overwrites) {
                await this.permissionOverwrites.update(overwrite.id, id, overwrite);
            }
        }
        delete data.permission_overwrites;
        delete data.recipients;
        await this.addToIndex(id);
        await this.storageEngine.upsert(this.buildId(id), data);
        let channel = await this.storageEngine.get(this.buildId(id));
        return new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(channel.id), this.recipients, channel);
    }
    /**
     * Remove a channel from the cache
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    async remove(id) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id);
        }
        let channel = await this.storageEngine.get(this.buildId(id));
        if (channel) {
            await this.removeFromIndex(id);
            return this.storageEngine.remove(this.buildId(id));
        }
        else {
            return null;
        }
    }
    /**
     * Filter through the collection of channels
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {Promise.<ChannelCache[]>} - array of channel caches with bound results
     */
    async filter(fn, channelMap) {
        let channels = await this.storageEngine.filter(fn, channelMap, this.namespace);
        return channels.map(c => new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(c.id), this.recipients, c));
    }
    /**
     * Filter through the collection of channels and return on the first result
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {ChannelCache} - First result bound to a channel cache
     */
    async find(fn, channelMap) {
        let channel = await this.storageEngine.find(fn, channelMap, this.namespace);
        return new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(channel.id), this.recipients, channel);
    }
    /**
     * Add a channel to the channel index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    async addToIndex(id) {
        return this.storageEngine.addToList(this.namespace, id);
    }
    /**
     * Remove a channel from the index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    async removeFromIndex(id) {
        return this.storageEngine.removeFromList(this.namespace, id);
    }
    /**
     * Check if a channel is indexed
     * @param {String} id - id of the channel
     * @returns {Promise.<Boolean>}
     */
    async isIndexed(id) {
        return this.storageEngine.isListMember(this.namespace, id);
    }
    /**
     * Get a list of ids of indexed channels
     * @returns {Promise.<String[]>}
     */
    async getIndexMembers() {
        return this.storageEngine.getListMembers(this.namespace);
    }
    /**
     * Remove the channel index, you should probably not call this at all :<
     * @returns {Promise.<*>}
     */
    async removeIndex() {
        return this.storageEngine.removeList(this.namespace);
    }
    /**
     * Get the number of channels that are currently cached
     * @return {Promise.<Number>} - Number of channels currently cached
     */
    async getIndexCount() {
        return this.storageEngine.getListCount(this.namespace);
    }
}
exports.default = ChannelCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbENhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2FjaGUvQ2hhbm5lbENhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQW9DO0FBUXBDOzs7R0FHRztBQUNILE1BQU0sWUFBYSxTQUFRLG1CQUFTO0lBUWhDOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxZQUFZLGFBQWlDLEVBQUUsVUFBMkIsRUFBRSx3QkFBa0QsRUFBRSxTQUFxQixFQUFFLFdBQXVCO1FBQzFLLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLHdCQUF3QixDQUFDO1FBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVO1FBQ2hCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7UUFDRCxJQUFJLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLE9BQU8sRUFBRTtZQUNULE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFV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