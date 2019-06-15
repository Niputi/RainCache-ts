"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache responsible for storing role related data
 * @extends BaseCache
 */
class RoleCache extends BaseCache_1.default {
    /**
     * Create a new RoleCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {Role} boundObject - Optional, may be used to bind a role object to the cache
     * @property {String} namespace=role - namespace of the cache, defaults to `role`
     */
    constructor(storageEngine, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'role';
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get a role via id and guild id of the role
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {Promise.<RoleCache|null>} Returns a Role Cache with a bound role or null if no role was found
     */
    async get(id, guildId) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let role = await this.storageEngine.get(this.buildId(id, guildId));
        if (!role) {
            return null;
        }
        return new RoleCache(this.storageEngine, role);
    }
    /**
     * Update a role
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @param {Role} data - new role data
     * @return {Promise.<RoleCache>} - returns a bound RoleCache once the data was updated.
     */
    async update(id, guildId, data) {
        if (this.boundObject) {
            this.bindObject(data);
            await this.update(this.boundObject.id, this.bindObject.guild_id, data);
            return this;
        }
        if (!guildId) {
            return Promise.reject('Missing guild id');
        }
        if (!data.guild_id) {
            data.guild_id = guildId;
        }
        if (!data.id) {
            data.id = id;
        }
        await this.addToIndex(id, guildId);
        await this.storageEngine.upsert(this.buildId(id, guildId), data);
        return new RoleCache(this.storageEngine, data);
    }
    /**
     * Remove a role from the cache
     * @param {String} id - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {Promise.<void>}
     */
    async remove(id, guildId) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id, this.boundObject.guild_id);
        }
        let role = await this.storageEngine.get(this.buildId(id, guildId));
        if (role) {
            await this.removeFromIndex(id, guildId);
            return this.storageEngine.remove(this.buildId(id, guildId));
        }
        else {
            return null;
        }
    }
    /**
     * Filter for roles by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} guildId - id of the guild belonging to the roles
     * @param {String[]} ids - array of role ids that should be used for the filtering
     * @return {Promise.<RoleCache[]>} - array of bound role caches
     */
    async filter(fn, guildId = this.boundGuild, ids = null) {
        let roles = await this.storageEngine.filter(fn, ids, super.buildId(guildId));
        return roles.map(r => new RoleCache(this.storageEngine, r));
    }
    /**
     * Find a role by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for filtering for a single role
     * @param {String} guildId - id of the guild belonging to the roles
     * @param {String[]} ids - array of role ids that should be used for the filtering
     * @return {Promise.<RoleCache>} - bound role cache
     */
    async find(fn, guildId = this.boundGuild, ids = null) {
        let role = await this.storageEngine.find(fn, ids, super.buildId(guildId));
        return new RoleCache(this.storageEngine, role);
    }
    /**
     * Build a unique key for the role cache entry
     * @param {String} roleId - id of the role
     * @param {String} guildId - id of the guild belonging to the role
     * @return {String} - the prepared key
     */
    buildId(roleId, guildId) {
        if (!guildId) {
            return super.buildId(roleId);
        }
        return `${this.namespace}.${guildId}.${roleId}`;
    }
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
exports.default = RoleCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9sZUNhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2FjaGUvUm9sZUNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQW9DO0FBSXBDOzs7R0FHRztBQUNILE1BQU0sU0FBVSxTQUFRLG1CQUFTO0lBQzdCOzs7Ozs7O09BT0c7SUFDSCxZQUFZLGFBQWdDLEVBQUUsV0FBa0I7UUFDNUQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLFdBQVcsRUFBRTtZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVUsRUFBRSxPQUFnQjtRQUNsQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQVUsRUFBRSxPQUFlLEVBQUUsSUFBVztRQUNqRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFB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