import BaseStorageEngine from "../storageEngine/BaseStorageEngine";
declare class BaseCache {
    namespace: string;
    storageEngine: BaseStorageEngine;
    boundGuild: string | undefined;
    dataTimestamp: Date | undefined;
    boundObject: {
        type?: any;
        id?: any;
    } | undefined;
    /**
     * Base class for all cache classes.
     *
     * You should **not** create BaseCache by itself, but instead create a class that extends from it.
     *
     * **All Methods from BaseCache are also available on every class that is extending it.**
     * @property {StorageEngine} storageEngine - storage engine of the cache
     * @property {String} namespace=base - namespace of the cache
     * @property {String} [boundGuild] - guild id bound to this cache
     */
    constructor();
    /**
     * Bind an object to the cache instance, you can read more on binding on the landing page of the documentation
     * @param {Object} boundObject - Object to bind to this cache instance
     */
    bindObject(boundObject: Object): void;
    /**
     * Bind a guild id to the cache
     * @param {String} guildId - id of the guild that should be bound to this cache
     * @return {this}
     * @public
     */
    bindGuild(guildId: string): this;
    buildId(id: string, guildId: string): string;
    buildId(id: string): string;
    buildId(roleId: string, guildId: string): string;
    buildId(permissionId: string, channelId: string): string;
    buildId(emojiId: string, guildId: string): string;
    /**
     * Add an id to the index of a namespace
     * @param {String} id - id to add
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    addToIndex(id: string, objectId?: string): Promise<void>;
    /**
     * Remove an id from the index
     * @param {String} id - id to be removed
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    removeFromIndex(id: string, objectId?: string): Promise<void>;
    /**
     * Check if an id is a member of an index
     * @param {String} id - id to check
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<boolean>} - returns true if it is a part of the index, false otherwise
     */
    isIndexed(id: string, objectId?: string): Promise<boolean>;
    /**
     * Get all members from an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<String[]>}
     */
    getIndexMembers(objectId?: string): Promise<string[]>;
    /**
     * Delete an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    removeIndex(objectId?: string): Promise<void>;
    /**
     * Get the number of elements that are within an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<Number>}
     */
    getIndexCount(objectId?: string): Promise<number>;
}
export default BaseCache;
