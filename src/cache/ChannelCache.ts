import BaseCache from "./BaseCache";

import ChannelMapCache from "./ChannelMapCache";
import PermissionOverwriteCache from "./PermissionOverwriteCache";
import UserCache from "./UserCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine"; 
import { TChannel } from "../LibTypes";

/**
 * Cache responsible for storing channel related data
 * @extends BaseCache
 */
class ChannelCache extends BaseCache {

    channelMap: ChannelMapCache
    permissionOverwrites: PermissionOverwriteCache
    guildChannelMap: ChannelMapCache
    recipients: UserCache
    storageEngine: BaseStorageEngine

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
    constructor(storageEngine : BaseStorageEngine, channelMap: ChannelMapCache, permissionOverwriteCache: PermissionOverwriteCache, userCache : UserCache, boundObject? : TChannel) {
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
    async get(id: string): Promise<ChannelCache | null | Object> {
        if (this.boundObject) {
            return this.boundObject;
        }
        let channel = await this.storageEngine.get(this.buildId(id));
        if (channel) {
            return new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(channel.id), this.recipients, channel);
        } else {
            return null;
        }
    }

    /**
     * Upsert a channel into the cache
     * @param {String} id - id of the channel
     * @param {Object} data - data to insert
     * @returns {Promise.<ChannelCache>}
     */
    async update(id: string, data : {guild_id?: any, recipients?: any, permission_overwrites?: any }) : Promise<ChannelCache> {
        if (this.boundObject) {
            this.bindObject(data); //using bindobject() to assure the data of the class is valid
            await this.update(this.boundObject.id, data);
            return this;
        }
        if (data.guild_id) {
            await this.channelMap.update(data.guild_id, [data.id]);
        } else if (data.recipients) {
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
    async remove(id: string): Promise<void> {
        if (this.boundObject) {
            return this.remove(this.boundObject.id);
        }
        let channel = await this.storageEngine.get(this.buildId(id));
        if (channel) {
            await this.removeFromIndex(id);
            return this.storageEngine.remove(this.buildId(id));
        } else {
            return null;
        }
    }

    /**
     * Filter through the collection of channels
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {Promise.<ChannelCache[]>} - array of channel caches with bound results
     */
    async filter(fn: Function, channelMap: string[]): Promise<ChannelCache[]> {
        let channels = await this.storageEngine.filter(fn, channelMap, this.namespace);
        return channels.map(c => new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(c.id), this.recipients, c));
    }

    /**
     * Filter through the collection of channels and return on the first result
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {ChannelCache} - First result bound to a channel cache
     */
    async find(fn: Function, channelMap: string[]): Promise<ChannelCache> {
        let channel: TChannel = await this.storageEngine.find(fn, channelMap, this.namespace);
        return new ChannelCache(this.storageEngine, this.channelMap, this.permissionOverwrites.bindChannel(channel.id), this.recipients, channel);
    }

    /**
     * Add a channel to the channel index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    async addToIndex(id: string): Promise<void> {
        return this.storageEngine.addToList(this.namespace, id);
    }

    /**
     * Remove a channel from the index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    async removeFromIndex(id: string): Promise<void> {
        return this.storageEngine.removeFromList(this.namespace, id);
    }

    /**
     * Check if a channel is indexed
     * @param {String} id - id of the channel
     * @returns {Promise.<Boolean>}
     */
    async isIndexed(id: string): Promise<boolean> {
        return this.storageEngine.isListMember(this.namespace, id);
    }

    /**
     * Get a list of ids of indexed channels
     * @returns {Promise.<String[]>}
     */
    async getIndexMembers() : Promise<string[]> {
        return this.storageEngine.getListMembers(this.namespace);
    }

    /**
     * Remove the channel index, you should probably not call this at all :<
     * @returns {Promise.<*>}
     */
    async removeIndex(): Promise<any> {
        return this.storageEngine.removeList(this.namespace);
    }

    /**
     * Get the number of channels that are currently cached
     * @return {Promise.<Number>} - Number of channels currently cached
     */
    async getIndexCount() : Promise<number> {
        return this.storageEngine.getListCount(this.namespace);
    }
}

export default ChannelCache;
