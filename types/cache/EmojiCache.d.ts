import BaseCache from "./BaseCache";
import { TEmoji } from "../LibTypes";
import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
/**
 * Cache responsible for storing emoji related data
 * @property {StorageEngine} storageEngine - storage engine to use for this cache
 * @property {String} namespace=emoji - namespace of the cache
 * @extends BaseCache
 */
declare class EmojiCache extends BaseCache {
    /**
     * Create a new EmojiCache
     *
     * **This class is automatically instantiated by RainCache**
     * @param {StorageEngine} storageEngine - storage engine to use for this cache
     * @param {Emoji} [boundObject] - Optional, may be used to bind an emoji object to the cache
     */
    constructor(storageEngine: BaseStorageEngine, boundObject?: TEmoji);
    /**
     * Get an emoji via id
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {Promise.<EmojiCache|null>} EmojiCache with bound object or null if nothing was found
     */
    get(id: string, guildId?: string): Promise<EmojiCache | null | Object>;
    /**
     * Update a emoji
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @param {Emoji} data - new data of the emoji, that will get merged with the old data
     * @return {Promise.<EmojiCache>} - returns a bound EmojiCache
     */
    update(id: string, guildId: string, data: TEmoji): Promise<EmojiCache>;
    /**
     * Remove an emoji from the cache
     * @param {String} id - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {Promise.<void>}
     */
    remove(id: string, guildId?: string): Promise<void>;
    /**
     * Filter for emojis by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for the filtering
     * @param {String} guildId - id of the guild the emojis searched belong to
     * @param ids
     * @return {Promise.<EmojiCache[]>} - array of bound emoji caches
     */
    filter(fn: Function, guildId?: string, ids?: string[]): Promise<EmojiCache[]>;
    /**
     * Find an emoji by providing a filter function which returns true upon success and false otherwise
     * @param {Function} fn - filter function to use for filtering for a single emoji
     * @param guildId
     * @param ids
     * @return {Promise.<EmojiCache>} - bound emoji cache
     */
    find(fn: Function, guildId?: string, ids?: string[]): Promise<EmojiCache>;
    /**
     * Build a unique key to store the emoji in the datasource
     * @param {String} emojiId - id of the emoji (this does not refer to the name of the emoji)
     * @param {String} guildId - id of the guild this emoji belongs to
     * @return {String} - prepared key
     */
    buildId(emojiId: string, guildId: string): string;
}
export default EmojiCache;
