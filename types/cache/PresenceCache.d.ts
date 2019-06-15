import BaseCache from "./BaseCache";
import UserCache from "./UserCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache responsible for storing presence related data
 * @extends BaseCache
 */
declare class PresenceCache extends BaseCache {
    users: UserCache;
    /**
     * Create a new Presence Cache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {UserCache} userCache -
     * @param {Presence} boundObject - Optional, may be used to bind a presence object to the cache
     * @property {String} namespace=user - namespace of the cache
     */
    constructor(storageEngine: BaseStorageEngine, userCache: UserCache, boundObject: any);
    /**
     * Get a presence via user id
     * @param {String} id - id of a discord user
     * @return {Promise.<PresenceCache|null>} - Returns a new PresenceCache with bound data or null if nothing was found
     */
    get(id: string): Promise<PresenceCache | null | Object>;
    /**
     * Upsert the presence of a user.
     *
     * **This function automatically removes the guild_id, roles and user of a presence update before saving it**
     * @param {String} id - id of the user the presence belongs to
     * @param {Presence} data - updated presence data of the user
     * @return {Promise.<PresenceCache>} - returns a bound presence cache
     */
    update(id: string, data: any): Promise<PresenceCache>;
    /**
     * Remove a stored presence from the cache
     * @param {String} id - id of the user the presence belongs to
     * @return {Promise.<void>}
     */
    remove(id: string): Promise<void>;
}
/**
 * @typedef {Object} Presence - A discord presence object
 * @property {User} user - the user which presence is being updated
 * @property {String[]} roles - array of role ids that belong to the user
 * @property {Game} game - null or the current activity of the user
 * @property {String} guild_id - id of the guild
 * @property {String} status - status of the user, either "idle", "dnd", "online", or "offline"
 */
/**
 * @typedef {Object} Game - A discord game object
 * @property {String} name - name of the game
 * @property {Number} type - type of the game, checkout [activity types](https://discordapp.com/developers/docs/topics/gateway#game-object-activity-types) for more info
 * @property {String} ?url - stream url, only present with a type value of 1
 */
export default PresenceCache;
