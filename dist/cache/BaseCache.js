'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCache {
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
    bindObject(boundObject) {
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
    bindGuild(guildId) {
        this.boundGuild = guildId;
        return this;
    }
    /**
     * Build an id consisting of $namespace.$id
     * @param {String} id - id to append to namespace
     * @return {String} - constructed id
     */
    buildId(id) {
        return `${this.namespace}.${id}`;
    }
    /**
     * Add an id to the index of a namespace
     * @param {String} id - id to add
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async addToIndex(id, objectId = this.boundGuild) {
        return this.storageEngine.addToList(this.buildId(objectId), id);
    }
    /**
     * Remove an id from the index
     * @param {String} id - id to be removed
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async removeFromIndex(id, objectId = this.boundGuild) {
        return this.storageEngine.removeFromList(this.buildId(objectId), id);
    }
    /**
     * Check if an id is a member of an index
     * @param {String} id - id to check
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<boolean>} - returns true if it is a part of the index, false otherwise
     */
    async isIndexed(id, objectId = this.boundGuild) {
        return this.storageEngine.isListMember(this.buildId(objectId), id);
    }
    /**
     * Get all members from an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<String[]>}
     */
    async getIndexMembers(objectId = this.boundGuild) {
        return this.storageEngine.getListMembers(this.buildId(objectId));
    }
    /**
     * Delete an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<void>}
     */
    async removeIndex(objectId = this.boundGuild) {
        return this.storageEngine.removeList(this.buildId(objectId));
    }
    /**
     * Get the number of elements that are within an index
     * @param {String} [objectId=this.boundGuild] - id of the parent object of the index
     * @return {Promise.<Number>}
     */
    async getIndexCount(objectId = this.boundGuild) {
        return this.storageEngine.getListCount(this.buildId(objectId));
    }
}
exports.default = BaseCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2FjaGUvQmFzZUNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFJYixNQUFNLFNBQVM7SUFXWDs7Ozs7Ozs7O09BU0c7SUFDSDtRQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVLENBQUMsV0FBb0I7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFNBQVMsQ0FBQyxPQUFnQjtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBT0Q7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxFQUFVO1FBQ2QsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFVLEVBQUUsV0FBbUIsSUFBSSxDQUFDLFVBQVU7UUFDM0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBVSxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVTtRQUN4RCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFVLEVBQUUsV0FBbUIsSUFBSSxDQUFDLFVBQVU7UUFDMUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVU7UUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVTtRQUN4QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVO1FBQzFDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDSjtBQUVELGtCQUFlLFNBQVMsQ0FBQyJ9