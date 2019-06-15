"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCache_1 = require("./BaseCache");
/**
 * Cache responsible for storing emoji related data
 * @property {StorageEngine} storageEngine - storage engine to use for this cache
 * @property {String} namespace=emoji - namespace of the cache
 * @extends BaseCache
 */
class EmojiCache extends BaseCache_1.default {
    /**
     * Create a new EmojiCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {Emoji} [boundObject] - Optional, may be used to bind an emoji object to the cache
     */
    constructor(storageEngine, boundObject) {
        super();
        this.namespace = 'emoji';
        this.storageEngine = storageEngine;
        if (boundObject) {
            this.bindObject(boundObject);
        }
    }
    /**
     * Get an emoji via id
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {Promise.<EmojiCache|null>} EmojiCache with bound object or null if nothing was found
     */
    async get(id, guildId = this.boundGuild) {
        if (this.boundObject) {
            return this.boundObject;
        }
        let emoji = await this.storageEngine.get(this.buildId(id, guildId));
        if (emoji) {
            return new EmojiCache(this.storageEngine, emoji);
        }
        else {
            return null;
        }
    }
    /**
     * Update a emoji
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @param {Emoji} data - new data of the emoji, that will get merged with the old data
     * @return {Promise.<EmojiCache>} - returns a bound EmojiCache
     */
    async update(id, guildId = this.boundGuild, data) {
        if (this.boundObject) {
            this.bindObject(data);
            await this.update(id, guildId, data);
            return this;
        }
        await this.addToIndex(id, guildId);
        await this.storageEngine.upsert(this.buildId(id, guildId), data);
        return new EmojiCache(this.storageEngine, data);
    }
    /**
     * Remove an emoji from the cache
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {Promise.<void>}
     */
    async remove(id, guildId = this.boundGuild) {
        if (this.boundObject) {
            return this.remove(this.boundObject.id, guildId);
        }
        let emoji = await this.storageEngine.get(this.buildId(id, guildId));
        if (emoji) {
            await this.removeFromIndex(id, guildId);
            return this.storageEngine.remove(this.buildId(id, guildId));
        }
        else {
            return null;
        }
    }
    /**
     * Filter for emojis by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} guildId - id of the guild the emojis searched belong to
     * @param ids
     * @return {Promise.<EmojiCache[]>} - array of bound emoji caches
     */
    async filter(fn, guildId = this.boundGuild, ids = null) {
        let emojis = await this.storageEngine.filter(fn, ids, super.buildId(guildId));
        return emojis.map(e => new EmojiCache(this.storageEngine, e));
    }
    /**
     * Find an emoji by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for filtering for a single emoji
     * @param guildId
     * @param ids
     * @return {Promise.<EmojiCache>} - bound emoji cache
     */
    async find(fn, guildId = this.boundGuild, ids = null) {
        let emoji = await this.storageEngine.find(fn, ids, super.buildId(guildId));
        return new EmojiCache(this.storageEngine, emoji);
    }
    /**
     * Build a unique key to store the emoji in the datasource
     * @param {String} emojiId - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {String} - prepared key
     */
    buildId(emojiId, guildId) {
        if (!guildId) {
            return super.buildId(emojiId);
        }
        return `${this.namespace}.${guildId}.${emojiId}`;
    }
}
exports.default = EmojiCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1vamlDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImNhY2hlL0Vtb2ppQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBb0M7QUFJcEM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVcsU0FBUSxtQkFBUztJQUM5Qjs7Ozs7O09BTUc7SUFDSCxZQUFZLGFBQWlDLEVBQUUsV0FBb0I7UUFDL0QsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLFdBQVcsRUFBRTtZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVUsRUFBRSxVQUFrQixJQUFJLENBQUMsVUFBVTtRQUNuRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksS0FBSyxFQUFFO1lBQ1AsT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQVk7UUFDNUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxD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