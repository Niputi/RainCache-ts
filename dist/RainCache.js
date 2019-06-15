"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventProcessor_1 = require("./EventProcessor");
const GuildCache_1 = require("./cache/GuildCache");
const ChannelCache_1 = require("./cache/ChannelCache");
const ChannelMapCache_1 = require("./cache/ChannelMapCache");
const MemberCache_1 = require("./cache/MemberCache");
const UserCache_1 = require("./cache/UserCache");
const RoleCache_1 = require("./cache/RoleCache");
const EmojiCache_1 = require("./cache/EmojiCache");
const PresenceCache_1 = require("./cache/PresenceCache");
const PermissionOverwriteCache_1 = require("./cache/PermissionOverwriteCache");
const events_1 = require("events");
/**
 * RainCache - Main class used for accessing caches via subclasses and initializing the whole library
 * @extends EventEmitter
 */
class RainCache extends events_1.EventEmitter {
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
    constructor(options, inboundConnector, outboundConnector) {
        super();
        if (!options.storage) {
            throw new Error('No storage engines were passed');
        }
        if (!options.cacheClasses) {
            options.cacheClasses = {
                guild: GuildCache_1.default,
                channel: ChannelCache_1.default,
                channelMap: ChannelMapCache_1.default,
                member: MemberCache_1.default,
                user: UserCache_1.default,
                role: RoleCache_1.default,
                emoji: EmojiCache_1.default,
                presence: PresenceCache_1.default,
                permOverwrite: PermissionOverwriteCache_1.default
            };
        }
        //@ts-ignore
        if (!options.storage.default) {
            // maybe warn that no default engine was passed ? :thunkong:
        }
        if (!options.disabledEvents) {
            options.disabledEvents = {};
        }
        this.options = options;
        this.ready = false;
        this.inbound = inboundConnector;
        this.outbound = outboundConnector;
    }
    async initialize() {
        try {
            for (let engine in this.options.storage) {
                if (this.options.storage.hasOwnProperty(engine)) {
                    if (!this.options.storage[engine].ready) {
                        await this.options.storage[engine].initialize();
                    }
                }
            }
        }
        catch (e) {
            throw new Error('Failed to initialize storage engines');
        }
        this.cache = this._createCaches(this.options.storage, this.options.cacheClasses);
        Object.assign(this, this.cache);
        this.eventProcessor = new EventProcessor_1.default({
            disabledEvents: this.options.disabledEvents,
            presenceInterval: this.options.presenceInterval,
            cache: {
                guild: this.cache.guild,
                channel: this.cache.channel,
                channelMap: this.cache.channelMap,
                member: this.cache.member,
                user: this.cache.user,
                role: this.cache.role,
                emoji: this.cache.emoji,
                presence: this.cache.presence
            }
        });
        if (this.inbound && !this.inbound.ready) {
            await this.inbound.initialize();
        }
        if (this.outbound && !this.outbound.ready) {
            await this.outbound.initialize();
        }
        if (this.inbound) {
            this.inbound.on('event', async (event) => {
                try {
                    await this.eventProcessor.inbound(event);
                    if (this.outbound) {
                        await this.outbound.send(event);
                    }
                }
                catch (e) {
                    this.emit('error', e);
                }
            });
        }
        if (this.options.debug) {
            this.eventProcessor.on('debug', (log) => this.emit('debug', log));
        }
        this.ready = true;
    }
    _createCaches(engines, cacheClasses) {
        let caches = {};
        if (cacheClasses['role']) {
            let engine = this._getEngine(engines, 'role');
            caches['role'] = new cacheClasses['role'](engine);
        }
        if (cacheClasses['emoji']) {
            let engine = this._getEngine(engines, 'emoji');
            caches['emoji'] = new cacheClasses['emoji'](engine);
        }
        if (cacheClasses['permOverwrite']) {
            let engine = this._getEngine(engines, 'permOverwrite');
            caches['permOverwrite'] = new cacheClasses['permOverwrite'](engine);
        }
        if (cacheClasses['user']) {
            let engine = this._getEngine(engines, 'user');
            caches['user'] = new cacheClasses['user'](engine);
        }
        if (cacheClasses['member']) {
            let engine = this._getEngine(engines, 'member');
            caches['member'] = new cacheClasses['member'](engine, caches['user']);
        }
        if (cacheClasses['presence']) {
            let engine = this._getEngine(engines, 'presence');
            caches['presence'] = new cacheClasses['presence'](engine, caches['user']);
        }
        if (cacheClasses['channelMap']) {
            let engine = this._getEngine(engines, 'channelMap');
            caches['channelMap'] = new cacheClasses['channelMap'](engine);
        }
        if (cacheClasses['channel']) {
            let engine = this._getEngine(engines, 'channel');
            caches['channel'] = new cacheClasses['channel'](engine, caches['channelMap'], caches['permOverwrite'], caches['user']);
        }
        if (cacheClasses['guild']) {
            let engine = this._getEngine(engines, 'guild');
            caches['guild'] = new cacheClasses['guild'](engine, caches['channel'], caches['role'], caches['member'], caches['emoji'], caches['presence'], caches['channelMap']);
        }
        return caches;
    }
    _getEngine(engines, engine) {
        return engines[engine] || engines['default'];
    }
}
exports.default = RainCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFpbkNhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiUmFpbkNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThDO0FBQzlDLG1EQUE0QztBQUM1Qyx1REFBZ0Q7QUFDaEQsNkRBQWlEO0FBQ2pELHFEQUE4QztBQUM5QyxpREFBMEM7QUFDMUMsaURBQTBDO0FBQzFDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFDbEQsK0VBQXlFO0FBQ3pFLG1DQUFzQztBQU90Qzs7O0dBR0c7QUFDSCxNQUFNLFNBQVUsU0FBUSxxQkFBWTtJQVNoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUNHO0lBQ0gsWUFBWSxPQUFtRixFQUFFLGdCQUFtQyxFQUFFLGlCQUFvQztRQUN0SyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxZQUFZLEdBQUc7Z0JBQ25CLEtBQUssRUFBRSxvQkFBVTtnQkFDakIsT0FBTyxFQUFFLHNCQUFZO2dCQUNyQixVQUFVLEVBQUUseUJBQVU7Z0JBQ3RCLE1BQU0sRUFBRSxxQkFBVztnQkFDbkIsSUFBSSxFQUFFLG1CQUFTO2dCQUNmLElBQUksRUFBRSxtQkFBUztnQkFDZixLQUFLLEVBQUUsb0JBQVU7Z0JBQ2pCLFFBQVEsRUFBRSx1QkFBYTtnQkFDdkIsYUFBYSxFQUFFLGtDQUF5QjthQUMzQyxDQUFDO1NBQ0w7UUFDRCxZQUFZO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFCLDREQUE0RDtTQUMvRDtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxjQUFjLEdB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