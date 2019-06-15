"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache responsible for storing guild members
 * @extends BaseCache
 */
class MemberCache extends BaseCache_1.default {
    /**
     * Creates a new MemberCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {Object} storageEngine - storage engine to use
     * @param {UserCache} userCache - user cache instance
     * @param {Object} [boundObject] - Bind an object to this instance
     * @property {String} namespace=member - namespace of this cache, defaults to `member`
     * @property {UserCache} user - user cache instance
     * @property {String} boundGuild - id of a guild this cache is bound to
     */
    constructor(storageEngine, userCache, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'member';
        this.user = userCache;
        this.boundGuild = '';
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get a member via id
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @returns {Promise.<MemberCache|null>} - bound member cache with properties of the member or null if no member is cached
     */
    async get(id, guildId = this.boundGuild) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let member = await this.storageEngine.get(this.buildId(id, guildId));
        if (!member) {
            return null;
        }
        return new MemberCache(this.storageEngine, this.user.bindUserId(member.id), member);
    }
    /**
     * Update data of a guild member
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @param {GuildMember} data - updated guild member data
     * @returns {Promise.<MemberCache>}
     */
    async update(id, guildId = this.boundGuild, data) {
        if (this.boundObject) {
            this.bindObject(data);
            await this.update(this.boundObject.id, this.boundObject.guild_id, data);
            return this;
        }
        if (!guildId) {
            throw new Error(`Empty guild id for member ${id}`);
        }
        if (!data.guild_id) {
            data.guild_id = guildId;
        }
        if (!data.id) {
            data.id = id;
        }
        if (data.user) {
            await this.user.update(data.user.id, data.user);
            delete data.user;
        }
        await this.addToIndex(id, guildId);
        await this.storageEngine.upsert(this.buildId(id, guildId), data);
        return new MemberCache(this.storageEngine, this.user.bindUserId(data.id), data);
    }
    /**
     * Remove a member from the cache
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @return {Promise.<void>}
     */
    async remove(id, guildId = this.boundGuild) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id, this.boundObject.guild_id);
        }
        let member = await this.storageEngine.get(this.buildId(id, guildId));
        if (member) {
            await this.removeFromIndex(id, guildId);
            return this.storageEngine.remove(this.buildId(id, guildId));
        }
        else {
            return null;
        }
    }
    /**
     * Filter for members by providing filter function which returns true upon success and false otherwise
     * @param fn
     * @param guildId
     * @param ids
     * @return {Promise.<Array|*|{}>}
     */
    async filter(fn, guildId = this.boundGuild, ids = null) {
        let members = await this.storageEngine.filter(fn, ids, super.buildId(guildId));
        return members.map(m => new MemberCache(this.storageEngine, this.user.bindUserId(m.id), m).bindGuild(this.boundGuild));
    }
    /**
     *
     * @param fn
     * @param guildId
     * @param ids
     * @return {Promise.<MemberCache>}
     */
    async find(fn, guildId = this.boundGuild, ids = null) {
        let member = await this.storageEngine.find(fn, ids, super.buildId(guildId));
        return new MemberCache(this.storageEngine, this.user.bindUserId(member.id), member);
    }
    /**
     * Build a unique key for storing member data
     * @param {String} userId - id of the user belonging to the member
     * @param {String} guildId - id of the guild the member+
     * @return {*}
     */
    buildId(userId, guildId) {
        if (!guildId) {
            return super.buildId(userId);
        }
        return `${this.namespace}.${guildId}.${userId}`;
    }
}
/**
 * @typedef {Object} GuildMember
 * @property {User} user - user belonging to the member
 * @property {?String} nick - nickname if the member has one
 * @property {String[]} roles - array of role ids
 * @property {String} joined_at - timestamp when the user joined the guild
 * @property {Boolean} deaf - if the user is deafened
 * @property {Boolean} mute - if the user is muted
 * @property {String} ?id - id of the user belonging to the guild member, only available with raincache
 * @property {String} ?guild_id - id of the guild the user is a member of, only available with raincache
 */
exports.default = MemberCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjYWNoZS9NZW1iZXJDYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUtwQzs7O0dBR0c7QUFDSCxNQUFNLFdBQVksU0FBUSxtQkFBUztJQUUvQjs7Ozs7Ozs7OztPQVVHO0lBQ0gsWUFBWSxhQUFnQyxFQUFFLFNBQW9CLEVBQUUsV0FBb0I7UUFDcEYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLFdBQVcsRUFBRTtZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVU7UUFDNUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQjtRQUNELElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVEOzs7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