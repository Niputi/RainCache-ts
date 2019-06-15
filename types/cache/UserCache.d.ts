import BaseCache from "./BaseCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
import { TUser } from "../LibTypes";
/**
 * Cache responsible for caching users
 * @extends BaseCache
 */
declare class UserCache extends BaseCache {
    storageEngine: BaseStorageEngine;
    id: string;
    /**
     * Create a new UserCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {User} boundObject - Optional, may be used to bind a user object to the cache
     * @property {String} namespace - namespace of this cache, defaults to `user`
     */
    constructor(storageEngine: BaseStorageEngine, boundObject?: TUser);
    /**
     * Loads a user from the cache via id
     * @param {String} [id=this.id] - discord id of the user
     * @return {Promise.<UserCache|Null>} Returns a User Cache with a bound user or null if no user was found
     */
    get(id?: string): Promise<UserCache | null | Object>;
    /**
     * Update a user entry in the cache
     * @param {String} id=this.id - discord id of the user
     * @param {Object|User} data - updated data of the user, it will be merged with the old data
     * @return {Promise.<UserCache>}
     */
    update(id: string, data: TUser): Promise<UserCache>;
    /**
     * Remove a user from the cache
     * @param {String} id=this.id - discord id of the user
     * @return {Promise.<void>}
     */
    remove(id?: string): Promise<void>;
    /**
     * Filter for users by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String[]} ids - Array of user ids, if omitted the global user index will be used
     * @return {Promise.<UserCache[]>}
     */
    filter(fn: Function, ids?: string[] | null): Promise<UserCache[]>;
    /**
     * Find a user by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for filtering for a user
     * @param {String[]} ids - List of ids that should be used as the scope of the filter
     * @return {Promise.<UserCache|null>} - Returns a User Cache with a bound user or null if no user was found
     */
    find(fn: Function, ids?: string[] | null): Promise<UserCache | null>;
    /**
     * Bind a user id to the cache, used by the member cache
     * @param {String} userId - id of the user
     * @return {UserCache} - Returns a UserCache that has an id bound to it, which serves as the default argument to get, update and delete
     */
    bindUserId(userId: string): UserCache;
    /**
     * Add a user to the index
     * @param {String} id - id of the user
     * @return {Promise.<void>}
     */
    addToIndex(id: string): Promise<void>;
    /**
     * Remove a user from the index
     * @param {String} id - id of the user
     * @return {Promise.<void>}
     */
    removeFromIndex(id: string): Promise<void>;
    /**
     * Check if a user is indexed
     * @param {String} id - id of the user
     * @return {Promise.<boolean>} - True if the user is indexed, false otherwise
     */
    isIndexed(id: string): Promise<boolean>;
    /**
     * Get a list of currently indexed users, since users is a global namespace,
     * this will return **ALL** users that the bot cached currently
     * @return {Promise.<String[]>} - Array with a list of ids of users that are indexed
     */
    getIndexMembers(): Promise<string[]>;
    /**
     * Delete the user index, you should probably **not** use this function, but I won't stop you.
     * @return {Promise.<void>}
     */
    removeIndex(): Promise<void>;
    /**
     * Get the number of users that are currently cached
     * @return {Promise.<Number>} - Number of users currently cached
     */
    getIndexCount(): Promise<number>;
}
/**
 * @typedef {Object} User - a discord user object
 * @property {String} id - id of the user
 * @property {String} username - username of the user
 * @property {String} discriminator - 4 digit long discord tag
 * @property {String} avatar - avatar hash of the user
 * @property {Boolean} bot - Whether the user is a bot
 */
export default UserCache;
