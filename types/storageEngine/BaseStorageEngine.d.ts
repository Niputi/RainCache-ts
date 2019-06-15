/**
 * Base Storage engine class defining the methods being used by RainCache that a storage engine is supposed to have
 */
declare abstract class BaseStorageEngine {
    ready: boolean;
    constructor();
    abstract initialize(): Promise<void>;
    abstract get(id: string): Promise<any>;
    abstract upsert(id: string, data: Object): Promise<any>;
    abstract remove(id: string): Promise<any>;
    abstract getListMembers(listid: string): Promise<any>;
    abstract addToList(listId: string, ids: string[] | string): Promise<any>;
    abstract isListMember(listId: string, id: string): Promise<any>;
    abstract removeFromList(listId: string, id: string): Promise<any>;
    abstract removeList(listId: string): Promise<any>;
    abstract getListCount(listId: string): Promise<any>;
    abstract filter<T>(fn: Function, ids: string[], namespace: string): Promise<Array<T | null>>;
    abstract find<T>(fn: Function, ids: string[] | null, namespace: string): Promise<T | null>;
}
export default BaseStorageEngine;
