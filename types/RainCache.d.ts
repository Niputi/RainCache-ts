/// <reference types="node" />
import EventProcessor from "./EventProcessor";
import GuildCache from "./cache/GuildCache";
import ChannelCache from "./cache/ChannelCache";
import MemberCache from "./cache/MemberCache";
import UserCache from "./cache/UserCache";
import RoleCache from "./cache/RoleCache";
import EmojiCache from "./cache/EmojiCache";
import PresenceCache from "./cache/PresenceCache";
import PermissionsOverwriteCache from "./cache/PermissionOverwriteCache";
import { EventEmitter } from "events";
import ChannelMapCache from "./cache/ChannelMapCache";
import BaseCache from "./cache/BaseCache";
import BaseStorageEngine from "./storageEngine/BaseStorageEngine";
interface TCaches {
    role?: RoleCache;
    emoji?: EmojiCache;
    permOverwrite?: PermissionsOverwriteCache;
    user?: UserCache;
    member?: MemberCache;
    presence?: PresenceCache;
    channelMap?: ChannelMapCache;
    channel?: ChannelCache;
    guild?: GuildCache;
}
/**
 * RainCache - Main class used for accessing caches via subclasses and initializing the whole library
 * @extends EventEmitter
 */
declare class RainCache extends EventEmitter {
    ready: boolean;
    options: any;
    inbound: any;
    outbound: any;
    cache: TCaches;
    eventProcessor: EventProcessor;
    /**
     * Create a new Cache instance
     * @param {Object} options Options that should be used by RainCache
     * @param {Object} options.storage - object with storage engines to use for the different cache classes
     * @param {StorageEngine} [options.storage.default] - default storage engine to use when no special storage engine was passed for a class.
     *
     * **Use this option if you do not want to use a different type of storage engine for certain caches**
     *
     * You may also combine options: e.g. a RedisStorageEngine for presence and the rest within mongo, that's no issue.
     *
     * The cache type specific storage engine takes priority over the default one.
     * @param {StorageEngine} [options.storage.guild=options.storage.default] - storage engine used by the guild cache
     * @param {StorageEngine} [options.storage.channel=options.storage.default] - storage engine used by the channel cache
     * @param {StorageEngine} [options.storage.channelMap=options.storage.default] - storage engine used by the channelMap cache
     * @param {StorageEngine} [options.storage.member=options.storage.default] - storage engine used by the member cache
     * @param {StorageEngine} [options.storage.user=options.storage.default] - storage engine used by the user cache
     * @param {StorageEngine} [options.storage.role=options.storage.default] - storage engine used by the role cache
     * @param {StorageEngine} [options.storage.emoji=options.storage.default] - storage engine used by the emoji cache
     * @param {StorageEngine} [options.storage.presence=options.storage.default] - storage engine used by the presence cache
     * @param {StorageEngine} [options.storage.permOverwrite=options.storage.default] - storage engine used by the permission overwrite cache
     * @param {Object} [options.disabledEvents={}] - If you want to disable events from being processed,
     * you can add them here like this: `{'MESSAGE_CREATE':true}`,
     * this would disable any message_creates from being cached
     * @param {Object} [options.cacheClasses] - object with classes (**not objects**) that should be used for each type of data that is cached
     *
     * **RainCache automatically uses default classes when no cache classes are passed, else it will use your classes.**
     * @param {Object} [options.cacheClasses.guild=GuildCache] - cache class to use for guilds, defaults to the GuildCache
     * @param {Object} [options.cacheClasses.channel=ChannelCache] - cache class to use for channels, defaults to ChannelCache
     * @param {Object} [options.cacheClasses.channelMap=ChannelMapCache] - cache class to use for channels, defaults to ChannelMapCache
     * @param {Connector} inboundConnector
     * @param {Connector} outboundConnector
     *
     * @property {Object} options - options that the user passed through the constructor
     * @property {Boolean} ready=false - whether the cache is ready to process events
     * @property {Connector} inbound - Connector used for receiving events
     * @property {Connector} outbound - Connector used for forwarding events
     * @property {Object} cache - Instantiated cache classes
     * @property {GuildCache} cache.guild - Instantiated Guild Cache
     * @property {ChannelCache} cache.channel - Instantiated Channel Cache
     */
    constructor(options: {
        storage: BaseStorageEngine;
        disabledEvents: any;
        cacheClasses?: Object;
    }, inboundConnector: BaseStorageEngine, outboundConnector: BaseStorageEngine);
    initialize(): Promise<void>;
    _createCaches(engines: BaseCache[], cacheClasses: any): TCaches;
    _getEngine(engines: BaseCache[], engine: any): any;
}
export default RainCache;
