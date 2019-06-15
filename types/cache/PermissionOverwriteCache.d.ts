import BaseCache from "./BaseCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
import { TPermissionOverwrite } from "../LibTypes";
/**
 * Cache used for saving overwrites of permissions belonging to channels
 * @extends BaseCache
 */
declare class PermissionOverwriteCache extends BaseCache {
    boundChannel: string;
    /**
     * Create a new PermissionOverwriteCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {PermissionOverwrite} [boundObject] - Optional, may be used to bind a permission overwrite object to this cache
     * @property {String} namespace=permissionoverwrite - namespace of the cache, defaults to `permissionoverwrite`
     */
    constructor(storageEngine: BaseStorageEngine, boundObject?: TPermissionOverwrite);
    /**
     * Get a permission overwrite via id
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {Promise.<PermissionOverwriteCache|null>} - returns a bound permission overwrite cache or null if nothing was found
     */
    get(id: string, channelId?: string): Promise<PermissionOverwriteCache | null | Object>;
    /**
     * Update a permission overwrite entry in the cache
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {PermissionOverwrite} data - updated permission overwrite data, will be merged with the old data
     * @return {Promise.<PermissionOverwriteCache>} - returns a bound permission overwrite cache
     */
    update(id: string, channelId: string, data: TPermissionOverwrite): Promise<PermissionOverwriteCache>;
    /**
     * Remove a permission overwrite entry from the cache
     * @param {String} id - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {Promise.<void>}
     */
    remove(id: string, channelId?: string): Promise<void>;
    /**
     * Filter for permission overwrites by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {String[]} ids - Array of permission overwrite ids, if omitted the permission overwrite index will be used
     * @return {Promise.<PermissionOverwriteCache[]>} - returns an array of bound permission overwrite caches
     */
    filter(fn: Function, channelId?: string, ids?: string[] | null): Promise<PermissionOverwriteCache[]>;
    /**
     * Find a permission overwrite by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @param {String[]} ids - Array of permission overwrite ids, if omitted the permission overwrite index will be used
     * @return {Promise.<PermissionOverwriteCache>} - returns a bound permission overwrite cache
     */
    find(fn: Function, channelId?: string, ids?: string[] | null): Promise<PermissionOverwriteCache>;
    /**
     * Build a unique key for storing the data in the datasource
     * @param {String} permissionId - id of the permission overwrite
     * @param {String} channelId=this.boundChannel - id of the channel that belongs to the permission overwrite
     * @return {String} - id for saving the permission overwrite
     */
    buildId(permissionId: string, channelId: string): string;
    /**
     * Bind a channel id to this permission overwrite cache
     * @param {String} channelId - id of the channel that belongs to the permission overwrite
     * @return {PermissionOverwriteCache} - returns a permission overwrite cache with boundChannel set to the passed channelId
     */
    bindChannel(channelId: string): this;
}
export default PermissionOverwriteCache;
