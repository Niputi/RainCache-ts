"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache responsible for guilds
 * @extends BaseCache
 */
class GuildCache extends BaseCache_1.default {
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
    constructor(storageEngine, channelCache, roleCache, memberCache, emojiCache, presenceCache, guildToChannelCache, boundObject) {
        super();
        this.storageEngine = storageEngine;
        this.namespace = 'guild';
        this.channels = channelCache;
        this.roles = roleCache;
        this.members = memberCache;
        this.emojis = emojiCache;
        this.presences = presenceCache;
        this.guildChannelMap = guildToChannelCache;
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Retrieves a guild via id
     * @param id - Discord id of the guild
     * @returns {Promise.<GuildCache|null>} Returns either a Guild Object or null if the guild does not exist.
     */
    async get(id) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let guild = await this.storageEngine.get(this.buildId(id));
        if (guild) {
            return new GuildCache(this.storageEngine, this.channels.bindGuild(guild.id), this.roles.bindGuild(guild.id), this.members.bindGuild(guild.id), this.emojis.bindGuild(guild.id), this.presences.bindGuild(guild.id), this.guildChannelMap.bindGuild(guild.id), guild);
        }
        else {
            return null;
        }
    }
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
    async update(id, data) {
        if (this.boundObject) {
            this.bindObject(data); //using bindobject() to assure the data of the class is valid
            await this.update(this.boundObject.id, data);
            return this;
        }
        if (data.channels && data.channels.length > 0) {
            await this.guildChannelMap.update(id, data.channels.map(c => c.id));
            for (let channel of data.channels) {
                channel.guild_id = id;
                await this.channels.update(channel.id, channel);
                // console.log(`Cached channel ${channel.id}|#"${channel.name}"|${typeof channel.name}`);
            }
        }
        if (data.members && data.members.length > 0) {
            let membersPromiseBatch = [];
            for (let member of data.members) {
                member.guild_id = id;
                membersPromiseBatch.push(this.members.update(member.user.id, id, member));
            }
            await Promise.all(membersPromiseBatch);
            // console.log(`Cached ${data.members.length} Guild Members from guild ${id}|${data.name}`);
        }
        if (data.presences && data.presences.length > 0) {
            let presencePromiseBatch = [];
            for (let presence of data.presences) {
                presencePromiseBatch.push(this.presences.update(presence.user.id, presence));
            }
            await Promise.all(presencePromiseBatch);
            // console.log(`Cached ${data.presences.length} presences from guild ${id}|${data.name}`);
        }
        if (data.roles && data.roles.length > 0) {
            let rolePromiseBatch = [];
            for (let role of data.roles) {
                rolePromiseBatch.push(this.roles.update(role.id, id, role));
            }
            await Promise.all(rolePromiseBatch);
            // console.log(`Cached ${data.roles.length} roles from guild ${id}|${data.name}`);
        }
        if (data.emojis && data.emojis.length > 0) {
            let emojiPromiseBatch = [];
            for (let emoji of data.emojis) {
                emojiPromiseBatch.push(this.emojis.update(emoji.id, id, emoji));
            }
            await Promise.all(emojiPromiseBatch);
        }
        delete data.members;
        delete data.voice_states;
        delete data.roles;
        delete data.presences;
        delete data.emojis;
        delete data.features;
        delete data.channels;
        await this.addToIndex(id);
        await this.storageEngine.upsert(this.buildId(id), data);
        let guild = await this.storageEngine.get(this.buildId(id));
        return new GuildCache(this.storageEngine, this.channels.bindGuild(guild.id), this.roles.bindGuild(guild.id), this.members.bindGuild(guild.id), this.emojis.bindGuild(guild.id), this.presences.bindGuild(guild.id), this.guildChannelMap.bindGuild(guild.id), guild);
    }
    /**
     * Removes a guild and associated elements from the cache.
     * @param {String} id - id of the guild to remove
     * @returns {Promise.<void>}
     */
    async remove(id) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id);
        }
        let guild = await this.storageEngine.get(this.buildId(id));
        if (guild) {
            let channelMap = await this.guildChannelMap.get(id);
            let roles = await this.roles.getIndexMembers(id);
            let emojis = await this.emojis.getIndexMembers(id);
            let members = await this.members.getIndexMembers(id);
            for (let emoji of emojis) {
                await this.emojis.remove(emoji, id);
            }
            for (let role of roles) {
                await this.roles.remove(role, id);
            }
            for (let channel of channelMap.channels) {
                await this.channels.remove(channel);
            }
            for (let member of members) {
                await this.members.remove(member, id);
            }
            await this.guildChannelMap.remove(id);
            await this.removeFromIndex(id);
            return this.storageEngine.remove(this.buildId(id));
        }
        else {
            return null;
        }
    }
    /**
     * Filter through the collection of guilds
     * @param {Function} fn - Filter function
     * @returns {Promise.<GuildCache[]>} - array of bound guild caches
     */
    async filter(fn) {
        // possible bug here
        let guilds = await this.storageEngine.filter(fn, null, this.namespace);
        return guilds.map(g => new GuildCache(this.storageEngine, this.channels, this.roles.bindGuild(g.id), this.members.bindGuild(g.id), this.emojis.bindGuild(g.id), this.presences.bindGuild(g.id), this.guildChannelMap.bindGuild(g.id), g));
    }
    /**
     * Filter through the collection of guilds and return the first match
     * @param {Function} fn - Filter function
     * @returns {Promise.<GuildCache>} - returns a bound guild cache
     */
    async find(fn) {
        // possible bug here
        let guild = await this.storageEngine.find(fn, null, this.namespace);
        return new GuildCache(this.storageEngine, this.channels.bindGuild(guild.id), this.roles.bindGuild(guild.id), this.members.bindGuild(guild.id), this.emojis.bindGuild(guild.id), this.presences.bindGuild(guild.id), this.guildChannelMap.bindGuild(guild.id), guild);
    }
    /**
     * Add a guild to the guild index
     * @param {String} id - id of the guild
     * @returns {Promise.<void>}
     */
    async addToIndex(id) {
        return this.storageEngine.addToList(this.namespace, id);
    }
    /**
     * Remove a guild from the guild index
     * @param {String} id - id of the guild
     * @returns {Promise.<void>}
     */
    async removeFromIndex(id) {
        return this.storageEngine.removeFromList(this.namespace, id);
    }
    /**
     * Check if a guild is indexed alias cached
     * @param {String} id - id of the guild
     * @returns {Promise.<Boolean>} - True if this guild is cached and false if not
     */
    async isIndexed(id) {
        return this.storageEngine.isListMember(this.namespace, id);
    }
    /**
     * Get all guild ids currently indexed
     * @returns {Promise.<String[]>} - array of guild ids
     */
    async getIndexMembers() {
        return this.storageEngine.getListMembers(this.namespace);
    }
    /**
     * Remove the guild index, you should probably not call this at all :<
     * @returns {Promise.<void>}
     */
    async removeIndex() {
        return this.storageEngine.removeList(this.namespace);
    }
    /**
     * Get the number of guilds that are currently cached
     * @return {Promise.<Number>} - Number of guilds currently cached
     */
    async getIndexCount() {
        return this.storageEngine.getListCount(this.namespace);
    }
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
exports.default = GuildCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImNhY2hlL0d1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBb0M7QUFVcEM7OztHQUdHO0FBQ0gsTUFBTSxVQUFXLFNBQVEsbUJBQVM7SUFPOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSCxZQUFZLGFBQWdDLEVBQUUsWUFBMEIsRUFBRSxTQUFvQixFQUFFLFdBQXdCLEVBQUUsVUFBc0IsRUFBRSxhQUE0QixFQUFFLG1CQUFvQyxFQUFFLFdBQW9CO1FBQ3RPLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQztRQUMzQyxJQUFJLFdBQVcsRUFBRTtZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxLQUFL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