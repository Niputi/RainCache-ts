'use strict';

import BaseStorageEngine from "../storageEngine/BaseStorageEngine";

class BaseCache {


    namespace: string
    storageEngine : BaseStorageEngine;

    boundGuild : string | undefined
    dataTimestamp: Date | undefined
    boundObject: {type?: any, id?: any} | undefined


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
    constructor() {
        this.storageEngine = null;
        this.namespace = 'base';
    }

    /**
     * Bind an object to the cache instance, you can read more on binding on the landing page of the documentation
     * @param {Object} boundObject - Object to bind to this cache instance
     */
    bindObject(boundObject : Object ) {
        this.dataTimestamp = new Date();
        this.boundObject = boundObject;
        Object.assign(this, boundObject);
    }

    /**
     * Bind a guild id to the cache
     * @param {String} guildId - id of the guild that should be bound to this cache
     * @return {this}
     * @public
     */
    bindGuild(guildId : string) : this {
        this.boundGuild = guildId;
        return this;
    }

    buildId(id: string, guildId: string): string
    buildId(id: string): string
    buildId(roleId: string, guildId: string): string
    buildId(permissionId: string, channelId : string) : string
    buildId(emojiId: string, guildId: string): string
    /**
     * Build an id consisting of $namespace.$id
     * @param {String} id - id to append to namespace
     * @return {String} - constructed id
     */
    buildId(id: string) : string {
        return `${this.namespace}.${id}`;
    }

    /**
     * Add an id to the index of a namespace
     * @param {String} id - id to add
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async addToIndex(id: string, objectId: string = this.boundGuild) : Promise<void> {
        return this.storageEngine.addToList(this.buildId(objectId), id);
    }

    /**
     * Remove an id from the index
     * @param {String} id - id to be removed
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async removeFromIndex(id: string, objectId = this.boundGuild): Promise<void> {
        return this.storageEngine.removeFromList(this.buildId(objectId), id);
    }

    /**
     * Check if an id is a member of an index
     * @param {String} id - id to check
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<boolean>} - returns true if it is a part of the index, false otherwise
     */
    async isIndexed(id: string, objectId: string = this.boundGuild): Promise<boolean> {
        return this.storageEngine.isListMember(this.buildId(objectId), id);
    }

    /**
     * Get all members from an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<String[]>}
     */
    async getIndexMembers(objectId = this.boundGuild) : Promise<string[]> {
        return this.storageEngine.getListMembers(this.buildId(objectId));
    }

    /**
     * Delete an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async removeIndex(objectId = this.boundGuild) : Promise<void> {
        return this.storageEngine.removeList(this.buildId(objectId));
    }

    /**
     * Get the number of elements that are within an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<Number>}
     */
    async getIndexCount(objectId = this.boundGuild): Promise<number> {
        return this.storageEngine.getListCount(this.buildId(objectId));
    }
}

export default BaseCache;
