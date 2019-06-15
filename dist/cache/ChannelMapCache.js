"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache for providing a guild/user -> channels map
 * @extends BaseCache
 */
class ChannelMapCache extends BaseCache_1.default {
    /**
     * Create a new ChannelMapCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {Object} boundObject - Optional, may be used to bind the map object to the cache
     * @property {String} namespace=channelmap - namespace of this cache, defaults to `channelmap`
     */
    constructor(storageEngine, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'channelmap';
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get a ChannelMap via id of the guild or the user
     * @param {String} id Id of the user or the guild
     * @param {String} [type=guild] Type of the map to get
     * @returns {Promise.<ChannelMapCache|null>}
     */
    async get(id, type = 'guild') {
        if (this.boundObject) {
            return this.boundObject;
        }
        let channelMapId = this.buildId(this._buildMapId(id, type));
        let channelMap = await this.storageEngine.getListMembers(channelMapId);
        if (channelMap) {
            return new ChannelMapCache(this.storageEngine, this._buildMap(id, channelMap, type));
        }
        else {
            return null;
        }
    }
    /**
     * Upsert a ChannelMap
     * @param {String} id Id of the user or the guild
     * @param {String[]} data Array of channel ids
     * @param {String} [type=guild] Type of the map to upsert
     * @param {Boolean} [remove=false] Remove old channels that don't exist anymore
     * @returns {Promise.<ChannelMapCache>}
     */
    async update(id, data, type = 'guild', remove = false) {
        if (this.boundObject) {
            this.bindObject(this._buildMap(id, data, type)); //using bindobject() to assure the data of the class is valid
            await this.update(this.boundObject.id, data, this.boundObject.type);
            return this;
        }
        let oldCacheData = await this.get(id, type);
        if (oldCacheData && !remove) {
            data = this._checkDupes(oldCacheData.channels, data);
        }
        if (remove) {
            if (!oldCacheData) {
                oldCacheData = { channels: [] };
            }
            data = this._removeOldChannels(oldCacheData.channels, data);
        }
        let channelMapId = this.buildId(this._buildMapId(id, type));
        await this.remove(id, type);
        await this.storageEngine.addToList(channelMapId, data);
        return new ChannelMapCache(this.storageEngine, this._buildMap(id, data, type));
    }
    /**
     * Remove a ChannelMap
     * @param {String} id Id of the user or the guild
     * @param {String} [type=guild] Type of the map to remove
     * @returns {Promise.<null>}
     */
    async remove(id, type = 'guild') {
        if (this.boundObject) {
            // this had two inputs at this function which take only one parameter
            return this.storageEngine.remove(this.boundObject.id);
        }
        let channelMapId = this.buildId(this._buildMapId(id, type));
        let channelMap = await this.storageEngine.getListMembers(channelMapId);
        if (channelMap) {
            return this.storageEngine.remove(channelMapId);
        }
        else {
            return null;
        }
    }
    /**
     * Remove old channels from the array of mapped channels
     * @param {Array} oldChannels Array of old channels
     * @param {Array} removeChannels Array of new channels
     * @returns {Array} Array of filtered channels
     * @private
     */
    _removeOldChannels(oldChannels, removeChannels) {
        for (let removeId of removeChannels) {
            if (oldChannels.indexOf(removeId) > -1) {
                oldChannels.splice(oldChannels.indexOf(removeId), 1);
            }
        }
        return oldChannels;
    }
    /**
     * Checks for duplicate ids in the provided arrays
     * @param {Array} oldIds Array of old ids
     * @param {Array} newIds Array of new ids
     * @returns {Array} Array of non duplicated Ids
     * @private
     */
    _checkDupes(oldIds, newIds) {
        for (let oldId of oldIds) {
            if (newIds.indexOf(oldId) > -1) {
                newIds.splice(newIds.indexOf(oldId), 1);
            }
        }
        return oldIds.concat(newIds);
    }
    /**
     * Build a unique key id for the channel map
     * @param {String} id - Id of the guild/user
     * @param {String} type - Type of the map
     * @returns {String}
     * @private
     */
    _buildMapId(id, type) {
        return `${type}.${id}`;
    }
    /**
     * Build a map object which is bound to the channelMapCache object
     * @param {String} id - Id of the guild/user
     * @param {Array} channels - Array of channel ids
     * @param {String} type - type of the map
     * @returns {{id: *, channels: *, type: *}}
     * @private
     */
    _buildMap(id, channels, type) {
        return { id, channels, type };
    }
}
exports.default = ChannelMapCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbE1hcENhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2FjaGUvQ2hhbm5lbE1hcENhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQW9DO0FBSXBDOzs7R0FHRztBQUNILE1BQU0sZUFBZ0IsU0FBUSxtQkFBUztJQUNuQzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxhQUFnQyxFQUFFLFdBQW9CO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDOUIsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsSUFBSSxHQUFHLE9BQU87UUFDaEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQjtRQUNELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZFLElBQUksVUFBVSxFQUFFO1lBQ1osT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3hGO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEVB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