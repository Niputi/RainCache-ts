import BaseCache from "./BaseCache";
import UserCache from "./UserCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache responsible for storing guild members
 * @extends BaseCache
 */
declare class MemberCache extends BaseCache {
    user: UserCache;
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
    constructor(storageEngine: BaseStorageEngine, userCache: UserCache, boundObject?: Object);
    /**
     * Get a member via id
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @returns {Promise.<MemberCache|null>} - bound member cache with properties of the member or null if no member is cached
     */
    get(id: string, guildId?: string): Promise<object | MemberCache | null>;
    /**
     * Update data of a guild member
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @param {GuildMember} data - updated guild member data
     * @returns {Promise.<MemberCache>}
     */
    update(id: any, guildId: string, data: any): Promise<MemberCache>;
    /**
     * Remove a member from the cache
     * @param {String} id - id of the member
     * @param {String} [guildId=this.boundGuild] - id of the guild of the member, defaults to the bound guild of the cache
     * @return {Promise.<void>}
     */
    remove(id: string, guildId?: string): Promise<void>;
    /**
     * Filter for members by providing filter function which returns true upon success and false otherwise
     * @param fn
     * @param guildId
     * @param ids
     * @return {Promise.<Array|*|{}>}
     */
    filter(fn: Function, guildId?: string, ids?: string[] | null): Promise<Array<MemberCache>>;
    /**
     *
     * @param fn
     * @param guildId
     * @param ids
     * @return {Promise.<MemberCache>}
     */
    find(fn: Function, guildId?: string, ids?: string[] | null): Promise<MemberCache>;
    /**
     * Build a unique key for storing member data
     * @param {String} userId - id of the user belonging to the member
     * @param {String} guildId - id of the guild the member+
     * @return {*}
     */
    buildId(userId: string, guildId: string): string;
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
export default MemberCache;
