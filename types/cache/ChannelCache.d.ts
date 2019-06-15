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
declare class ChannelCache extends BaseCache {
    channelMap: ChannelMapCache;
    permissionOverwrites: PermissionOverwriteCache;
    guildChannelMap: ChannelMapCache;
    recipients: UserCache;
    storageEngine: BaseStorageEngine;
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
    constructor(storageEngine: BaseStorageEngine, channelMap: ChannelMapCache, permissionOverwriteCache: PermissionOverwriteCache, userCache: UserCache, boundObject?: TChannel);
    /**
     * Get a channel via id
     * @param {String} id - id of the channel
     * @returns {Promise.<ChannelCache|null>} - ChannelCache with bound object or null if nothing was found
     */
    get(id: string): Promise<ChannelCache | null | Object>;
    /**
     * Upsert a channel into the cache
     * @param {String} id - id of the channel
     * @param {Object} data - data to insert
     * @returns {Promise.<ChannelCache>}
     */
    update(id: string, data: {
        guild_id?: any;
        recipients?: any;
        permission_overwrites?: any;
    }): Promise<ChannelCache>;
    /**
     * Remove a channel from the cache
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    remove(id: string): Promise<void>;
    /**
     * Filter through the collection of channels
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {Promise.<ChannelCache[]>} - array of channel caches with bound results
     */
    filter(fn: Function, channelMap: string[]): Promise<ChannelCache[]>;
    /**
     * Filter through the collection of channels and return on the first result
     * @param {Function} fn - Filter function
     * @param {String[]} channelMap - Array of ids used for the filter
     * @returns {ChannelCache} - First result bound to a channel cache
     */
    find(fn: Function, channelMap: string[]): Promise<ChannelCache>;
    /**
     * Add a channel to the channel index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    addToIndex(id: string): Promise<void>;
    /**
     * Remove a channel from the index
     * @param {String} id - id of the channel
     * @returns {Promise.<void>}
     */
    removeFromIndex(id: string): Promise<void>;
    /**
     * Check if a channel is indexed
     * @param {String} id - id of the channel
     * @returns {Promise.<Boolean>}
     */
    isIndexed(id: string): Promise<boolean>;
    /**
     * Get a list of ids of indexed channels
     * @returns {Promise.<String[]>}
     */
    getIndexMembers(): Promise<string[]>;
    /**
     * Remove the channel index, you should probably not call this at all :<
     * @returns {Promise.<*>}
     */
    removeIndex(): Promise<any>;
    /**
     * Get the number of channels that are currently cached
     * @return {Promise.<Number>} - Number of channels currently cached
     */
    getIndexCount(): Promise<number>;
}
export default ChannelCache;
