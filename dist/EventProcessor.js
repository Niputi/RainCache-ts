"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class EventProcessor extends events_1.EventEmitter {
    /**
     * Class responsible for executing methods on the correct cache class based on the event received from the incoming connector
     * @param options
     */
    constructor(options) {
        super();
        this.options = options || { disabledEvents: {}, presenceInterval: 1000 * 5 };
        if (!this.options.presenceInterval) {
            this.options.presenceInterval = 1000 * 5;
        }
        this.guildCache = options.cache.guild;
        this.channelCache = options.cache.channel;
        this.memberCache = options.cache.member;
        this.roleCache = options.cache.role;
        this.userCache = options.cache.user;
        this.emojiCache = options.cache.emoji;
        this.channelMapCache = options.cache.channelMap;
        this.presenceCache = options.cache.presence;
        this.ready = false;
        this.presenceQueue = {};
        this.presenceFlush = setInterval(async () => {
            await this.flushQueue();
        }, this.options.presenceInterval);
    }
    async inbound(event) {
        if (this.options.disabledEvents[event.t]) {
            return event;
        }
        await this.process(event);
        return event;
    }
    async process(event) {
        switch (event.t) {
            case 'READY':
                await this.processReady(event);
                this.ready = true;
                break;
            case 'GUILD_CREATE':
            case 'GUILD_UPDATE':
                this.emit('debug', `Cached guild ${event.d.id}|${event.d.name}`);
                await this.guildCache.update(event.d.id, event.d);
                break;
            case 'GUILD_DELETE':
                this.emit('debug', `Guild ${event.d.id} ${event.d.unavailable ? 'is unavailable' : 'was removed'}`);
                if (event.d.unavailable) {
                    await this.guildCache.update(event.d.id, event.d);
                }
                else {
                    await this.guildCache.remove(event.d.id);
                }
                break;
            case 'CHANNEL_CREATE':
            case 'CHANNEL_UPDATE':
                // console.log(event);
                // console.log(event.d.permission_overwrites);
                await this.onChannelCreate(event);
                break;
            case 'CHANNEL_DELETE':
                await this.onChannelDelete(event);
                break;
            case 'GUILD_MEMBER_ADD':
            case 'GUILD_MEMBER_UPDATE':
                await this.memberCache.update(event.d.user.id, event.d.guild_id, event.d);
                break;
            case 'GUILD_MEMBER_REMOVE':
                await this.memberCache.remove(event.d.user.id, event.d.guild_id);
                break;
            case 'GUILD_MEMBERS_CHUNK': {
                let guildMemberChunkPromises = [];
                for (let member of event.d.members) {
                    guildMemberChunkPromises.push(this.memberCache.update(member.user.id, event.d.guild_id, member));
                }
                await Promise.all(guildMemberChunkPromises);
                this.emit('debug', `Cached ${guildMemberChunkPromises.length} Members from Guild Member Chunk`);
                break;
            }
            case 'USER_UPDATE':
                await this.userCache.update(event.d.id, event.d);
                break;
            case 'PRESENCE_UPDATE':
                this.handlePresenceUpdate(event.d);
                break;
            case 'GUILD_ROLE_CREATE':
            case 'GUILD_ROLE_UPDATE':
                await this.roleCache.update(event.d.role.id, event.d.guild_id, event.d.role);
                break;
            case 'GUILD_ROLE_DELETE':
                await this.roleCache.remove(event.d.guild_id, event.d.role_id);
                break;
            case 'GUILD_EMOJIS_UPDATE': {
                let oldEmotes = await this.emojiCache.filter(() => true, event.d.guild_id);
                if (!oldEmotes || oldEmotes.length === 0) {
                    oldEmotes = [];
                }
                for (let emoji of event.d.emojis) {
                    let oldEmote = oldEmotes.find(e => e.id === emoji.id);
                    if (!oldEmote || oldEmote !== emoji) {
                        await this.emojiCache.update(emoji.id, event.d.guild_id, emoji);
                    }
                }
                for (let oldEmote of oldEmotes) {
                    let newEmote = event.d.emojis.find(e => e.id === oldEmote.id);
                    if (!newEmote) {
                        await this.emojiCache.remove(oldEmote.id, event.d.guild_id);
                    }
                }
                break;
            }
            case 'MESSAGE_CREATE': {
                if (event.d.author && !event.d.webhook_id) {
                    await this.userCache.update(event.d.author.id, event.d.author);
                }
                break;
            }
            default:
                if (event.t !== 'PRESENCE_UPDATE') {
                    this.emit('debug', `Unknown Event ${event.t}`);
                }
                break;
        }
    }
    handlePresenceUpdate(presenceEvent) {
        if (presenceEvent.roles) {
            delete presenceEvent.roles;
        }
        if (presenceEvent.guild_id) {
            delete presenceEvent.guild_id;
        }
        if (this.presenceQueue[presenceEvent.user.id]) {
            this.presenceQueue[presenceEvent.user.id] = Object.assign(this.presenceQueue[presenceEvent.user.id], {
                status: presenceEvent.status,
                game: presenceEvent.game,
                id: presenceEvent.user.id,
                user: presenceEvent.user
            });
        }
        else {
            this.presenceQueue[presenceEvent.user.id] = {
                status: presenceEvent.status,
                game: presenceEvent.game,
                id: presenceEvent.user.id,
                user: presenceEvent.user
            };
        }
    }
    async processReady(readyEvent) {
        let updates = [];
        updates.push(this.userCache.update('self', { id: readyEvent.d.user.id }));
        updates.push(this.userCache.update(readyEvent.d.user.id, readyEvent.d.user));
        for (let guild of readyEvent.d.guilds) {
            this.emit('debug', `Caching guild ${guild.id} from ready`);
            updates.push(this.guildCache.update(guild.id, guild));
        }
        return Promise.all(updates);
    }
    async onChannelCreate(channelCreateEvent) {
        switch (channelCreateEvent.d.type) {
            case 0:
            case 2:
            case 4:
                await this.channelMapCache.update(channelCreateEvent.d.guild_id, [channelCreateEvent.d.id], 'guild');
                // this.emit('debug', `Caching guild channel ${channelCreateEvent.d.id}`);
                return this.channelCache.update(channelCreateEvent.d.id, channelCreateEvent.d);
            default:
                break;
        }
        if (channelCreateEvent.d.type === 1) {
            if (!channelCreateEvent.d.recipients || channelCreateEvent.d.recipients.length === 0) {
                this.emit('debug', `Empty Recipients array for dm ${channelCreateEvent.d.id}`);
                return;
            }
            // this.emit('debug', `Caching dm channel ${channelCreateEvent.d.id}`);
            await this.channelMapCache.update(channelCreateEvent.d.recipients[0].id, [channelCreateEvent.d.id], 'user');
            return this.channelCache.update(channelCreateEvent.d.id, channelCreateEvent.d);
        }
        //ignore channel categories for now.
    }
    async onChannelDelete(channelDeleteEvent) {
        switch (channelDeleteEvent.d.type) {
            case 0:
            case 2:
                await this.channelMapCache.update(channelDeleteEvent.d.guild_id, [channelDeleteEvent.d.id], 'guild', true);
                return this.channelCache.remove(channelDeleteEvent.d.id);
            default:
                break;
        }
        if (channelDeleteEvent.d.type === 1) {
            await this.channelMapCache.update(channelDeleteEvent.d.recipients[0].id, [channelDeleteEvent.d.id], 'user', true);
            return this.channelCache.remove(channelDeleteEvent.d.id);
        }
    }
    async flushQueue() {
        let queue = this.presenceQueue;
        this.presenceQueue = {};
        let presenceUpdatePromises = [];
        for (let key in queue) {
            if (queue.hasOwnProperty(key)) {
                presenceUpdatePromises.push(this.presenceCache.update(key, queue[key]));
            }
        }
        await Promise.all(presenceUpdatePromises);
        this.emit('debug', `Flushed presence update queue with ${presenceUpdatePromises.length} updates`);
    }
}
exports.default = EventProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRQcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJFdmVudFByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQVV0QyxNQUFNLGNBQWUsU0FBUSxxQkFBWTtJQWVyQzs7O09BR0c7SUFDSCxZQUFZLE9BQTJQO1FBQ25RLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFFLElBQUksR0FBRyxDQUFDLEVBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7U0FDNUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7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