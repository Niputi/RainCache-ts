import BaseCache from "./BaseCache";
import { TGuild, TChannel, TGuildMember, TEmoji, TRole } from "../LibTypes";
import PresenceCache from "./PresenceCache";
import EmojiCache from "./EmojiCache";
import MemberCache from "./MemberCache";
import RoleCache from "./RoleCache";
import ChannelMapCache from "./ChannelMapCache";
import ChannelCache from "./ChannelCache";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache responsible for guilds
 * @extends BaseCache
 */
declare class GuildCache extends BaseCache {
    roles: RoleCache;
    channels: ChannelCache;
    members: MemberCache;
    emojis: EmojiCache;
    presences: PresenceCache;
    guildChannelMap: ChannelMapCache;
    /**
     * Create a new GuildCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - Storage engine to use for this cache
     * @param {ChannelCache} channelCache - Instantiated ChannelCache class
     * @param {RoleCache} roleCache - Instantiated RoleCache class
     * @param {MemberCache} memberCache - Instantiated MemberCache class
     * @param {EmojiCache} emojiCache - Instantiated EmojiCache class
     * @param {PresenceCache} presenceCache - Instantiated PresenceCache class
     * @param {ChannelMapCache} guildToChannelCache - Instantiated ChannelMap class
     * @param {Guild} boundObject - Optional, may be used to bind a guild object to the cache
     * @property {String} namespace=guild - namespace of the cache, defaults to `guild`
     * @property {ChannelCache} channels - Instantiated ChannelCache class
     * @property {RoleCache} roles - Instantiated RoleCache class
     * @property {MemberCache} members - Instantiated MemberCache class
     * @property {EmojiCache} emojis - Instantiated EmojiCache class
     * @property {PresenceCache} presences - Instantiated PresenceCache class
     * @property {ChannelMapCache} guildChannelMap - Instantiated ChannelMap class
     */
    constructor(storageEngine: BaseStorageEngine, channelCache: ChannelCache, roleCache: RoleCache, memberCache: MemberCache, emojiCache: EmojiCache, presenceCache: PresenceCache, guildToChannelCache: ChannelMapCache, boundObject?: TGuild);
    /**
     * Retrieves a guild via id
     * @param id - Discord id of the guild
     * @returns {Promise.<GuildCache|null>} Returns either a Guild Object or null if the guild does not exist.
     */
    get(id: string): Promise<Object | null | GuildCache>;
    /**
     * Upsert a guild object
     * @param {String} id - id of the guild
     * @param {Object} data - data received from the event
     * @param {?Channel[]} data.channels - Array of channels
     * @param {?Array} data.members - Array of members
     * @param {?Array} data.presences - Array of presences
     * @param {?Role[]} data.roles - Array of roles
     * @param {?Emoji[]} data.emojis - Array of emojis
     * @returns {Promise.<GuildCache>} - returns a bound guild cache
     */
    update(id: string, data: {
        channels?: TChannel[];
        members?: TGuildMember[];
        presences?: any[];
        emojis?: TEmoji[];
        roles?: TRole[];
    }): Promise<this | GuildCache>;
    /**
     * Removes a guild and associated elements from the cache.
     * @param {String} id - id of the guild to remove
     * @returns {Promise.<void>}
     */
    remove(id: string): Promise<void>;
    /**
     * Filter through the collection of guilds
     * @param {Function} fn - Filter function
     * @returns {Promise.<GuildCache[]>} - array of bound guild caches
     */
    filter(fn: Function): Promise<GuildCache[]>;
    /**
     * Filter through the collection of guilds and return the first match
     * @param {Function} fn - Filter function
     * @returns {Promise.<GuildCache>} - returns a bound guild cache
     */
    find(fn: Function): Promise<GuildCache>;
    /**
     * Add a guild to the guild index
     * @param {String} id - id of the guild
     * @returns {Promise.<void>}
     */
    addToIndex(id: string): Promise<void>;
    /**
     * Remove a guild from the guild index
     * @param {String} id - id of the guild
     * @returns {Promise.<void>}
     */
    removeFromIndex(id: string): Promise<void>;
    /**
     * Check if a guild is indexed alias cached
     * @param {String} id - id of the guild
     * @returns {Promise.<Boolean>} - True if this guild is cached and false if not
     */
    isIndexed(id: string): Promise<boolean>;
    /**
     * Get all guild ids currently indexed
     * @returns {Promise.<String[]>} - array of guild ids
     */
    getIndexMembers(): Promise<string[]>;
    /**
     * Remove the guild index, you should probably not call this at all :<
     * @returns {Promise.<void>}
     */
    removeIndex(): Promise<void>;
    /**
     * Get the number of guilds that are currently cached
     * @return {Promise.<Number>} - Number of guilds currently cached
     */
    getIndexCount(): Promise<number>;
}
/**
 * @typedef {Object} Guild - Object describing a regular discord guild
 * @property {String} id - guild id
 * @property {String} name - guild name
 * @property {String} icon - icon hash
 * @property {String} splash - splash image hash
 * @property {String} owner_id - id of the owner
 * @property {String} region - id of the voice region
 * @property {String} afk_channel_id - id of the afk channel
 * @property {Number} afk_timeout - afk timeout in seconds
 * @property {Boolean} embed_enabled - if the guild is embeddable
 * @property {String} embed_channel_id - id of embedded channel
 * @property {Number} verification level - [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level) of the guild
 * @property {Number} default_message_notifications - default
 * [notification level](https://discordapp.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of the guild
 * @property {Number} explicit_content_filter - default [filter level](https://discordapp.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level)
 * @property {Role[]} roles - Array of roles
 * @property {Emoji[]} emojis - Array of emojis
 * @property {String[]} features - Array of enabled guild features
 * @property {Number} mfa_level - required [mfa level](https://discordapp.com/developers/docs/resources/guild#guild-object-mfa-level) for the guild
 * @property {String} [application_id] - application id of the guild creator, if the guild was created by a bot
 * @property {Boolean} widget_enabled - if the server widget is enabled
 * @property {String} widget_channel_id - channel id of the server widget
 */
export default GuildCache;
