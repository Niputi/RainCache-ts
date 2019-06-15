import BaseCache from "./BaseCache";
import { TRole } from "../LibTypes";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache responsible for storing role related data
 * @extends BaseCache
 */
declare class RoleCache extends BaseCache {
    /**
     * Create a new RoleCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {Role} boundObject - Optional, may be used to bind a role object to the cache
     * @property {String} namespace=role - namespace of the cache, defaults to `role`
     */
    constructor(storageEngine: BaseStorageEngine, boundObject: TRole);
    /**
     * Get a role via id and guild id of the role
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {Promise.<RoleCache|null>} Returns a Role Cache with a bound role or null if no role was found
     */
    get(id: string, guildId: string): Promise<RoleCache | null | Object>;
    /**
     * Update a role
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @param {Role} data - new role data
     * @return {Promise.<RoleCache>} - returns a bound RoleCache once the data was updated.
     */
    update(id: string, guildId: string, data: TRole): Promise<RoleCache>;
    /**
     * Remove a role from the cache
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {Promise.<void>}
     */
    remove(id: string, guildId: string): Promise<void>;
    /**
     * Filter for roles by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} guildId - id of the guild belonging to the roles
     * @param {String[]} ids - array of role ids that should be used for the filtering
     * @return {Promise.<RoleCache[]>} - array of bound role caches
     */
    filter(fn: Function, guildId?: string, ids?: string[] | null): Promise<RoleCache[]>;
    /**
     * Find a role by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for filtering for a single role
     * @param {String} guildId - id of the guild belonging to the roles
     * @param {String[]} ids - array of role ids that should be used for the filtering
     * @return {Promise.<RoleCache>} - bound role cache
     */
    find(fn: Function, guildId?: string, ids?: string[] | null): Promise<RoleCache>;
    /**
     * Build a unique key for the role cache entry
     * @param {String} roleId - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {String} - the prepared key
     */
    buildId(roleId: string, guildId: string): string;
}
/**
 * @typedef {Object} Role - a discord role object
 * @property {String} id - role id
 * @property {String} name - role name
 * @property {Number} color - integer representation of hexadecimal color code
 * @property {Boolean} hoist - if this role is hoisted
 * @property {Number} position - position of the role, Roles with a lower position can't execute actions on roles with a higher position
 * @property {Number} permissions - permission bit set
 * @property {Boolean} managed - if this role is managed by an integration (also true for bot roles that are added when you add a bot that requires permissions)
 * @property {Boolean} mentionable - if this role can be mentioned
 * @property {String} ?guild_id - optional guild id, of the guild that owns this role, not supplied by discord.
 */
export default RoleCache;
