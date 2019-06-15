import BaseCache from "./BaseCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache for providing a guild/user -> channels map
 * @extends BaseCache
 */
declare class ChannelMapCache extends BaseCache {
    /**
     * Create a new ChannelMapCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {Object} boundObject - Optional, may be used to bind the map object to the cache
     * @property {String} namespace=channelmap - namespace of this cache, defaults to `channelmap`
     */
    constructor(storageEngine: BaseStorageEngine, boundObject?: Object);
    /**
     * Get a ChannelMap via id of the guild or the user
     * @param {String} id Id of the user or the guild
     * @param {String} [type=guild] Type of the map to get
     * @returns {Promise.<ChannelMapCache|null>}
     */
    get(id: string, type?: string): Promise<ChannelMapCache | null | Object>;
    /**
     * Upsert a ChannelMap
     * @param {String} id Id of the user or the guild
     * @param {String[]} data Array of channel ids
     * @param {String} [type=guild] Type of the map to upsert
     * @param {Boolean} [remove=false] Remove old channels that don't exist anymore
     * @returns {Promise.<ChannelMapCache>}
     */
    update(id: string, data: string[], type?: string, remove?: boolean): Promise<ChannelMapCache>;
    /**
     * Remove a ChannelMap
     * @param {String} id Id of the user or the guild
     * @param {String} [type=guild] Type of the map to remove
     * @returns {Promise.<null>}
     */
    remove(id: string, type?: string): Promise<null>;
    /**
     * Remove old channels from the array of mapped channels
     * @param {Array} oldChannels Array of old channels
     * @param {Array} removeChannels Array of new channels
     * @returns {Array} Array of filtered channels
     * @private
     */
    private _removeOldChannels;
    /**
     * Checks for duplicate ids in the provided arrays
     * @param {Array} oldIds Array of old ids
     * @param {Array} newIds Array of new ids
     * @returns {Array} Array of non duplicated Ids
     * @private
     */
    private _checkDupes;
    /**
     * Build a unique key id for the channel map
     * @param {String} id - Id of the guild/user
     * @param {String} type - Type of the map
     * @returns {String}
     * @private
     */
    private _buildMapId;
    /**
     * Build a map object which is bound to the channelMapCache object
     * @param {String} id - Id of the guild/user
     * @param {Array} channels - Array of channel ids
     * @param {String} type - type of the map
     * @returns {{id: *, channels: *, type: *}}
     * @private
     */
    private _buildMap;
}
export default ChannelMapCache;
