import BaseCache from "./BaseCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
import { TChannel } from "../LibTypes";

/**
 * Cache for providing a guild/user -> channels map
 * @extends BaseCache
 */
class ChannelMapCache extends BaseCache {
    /**
     * Create a new ChannelMapCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {Object} boundObject - Optional, may be used to bind the map object to the cache
     * @property {String} namespace=channelmap - namespace of this cache, defaults to `channelmap`
     */
    constructor(storageEngine: BaseStorageEngine, boundObject?: Object) {
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
    async get(id :string, type = 'guild'): Promise<ChannelMapCache | null | Object> {
        if (this.boundObject) {
            return this.boundObject;
        }
        let channelMapId = this.buildId(this._buildMapId(id, type));
        let channelMap = await this.storageEngine.getListMembers(channelMapId);
        if (channelMap) {
            return new ChannelMapCache(this.storageEngine, this._buildMap(id, channelMap, type));
        } else {
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
    async update(id: string, data: string[], type: string = 'guild', remove: boolean = false) : Promise<ChannelMapCache> {
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
                oldCacheData = {channels: []};
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
    async remove(id: string, type: string = 'guild') : Promise<null> {
        if (this.boundObject) {
            // this had two inputs at this function which take only one parameter
            return this.storageEngine.remove(this.boundObject.id);
        }
        let channelMapId = this.buildId(this._buildMapId(id, type));
        let channelMap = await this.storageEngine.getListMembers(channelMapId);
        if (channelMap) {
            return this.storageEngine.remove(channelMapId);
        } else {
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
    private _removeOldChannels(oldChannels:  TChannel[], removeChannels: TChannel[]):  TChannel[] {
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
    private _checkDupes(oldIds: string[], newIds: string[]): string[] {
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
    private _buildMapId(id: string, type: string): string {
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
    private _buildMap(id: string, channels: TChannel[], type: string): { id: string; channels: TChannel[]; type: string; } {
        return {id, channels, type};
    }
}

export default ChannelMapCache;
