/// <reference types="node" />
import { EventEmitter } from "events";
import GuildCache from "./cache/GuildCache";
import ChannelCache from "./cache/ChannelCache";
import MemberCache from "./cache/MemberCache";
import RoleCache from "./cache/RoleCache";
import UserCache from "./cache/UserCache";
import EmojiCache from "./cache/EmojiCache";
import ChannelMapCache from "./cache/ChannelMapCache";
import PresenceCache from "./cache/PresenceCache";
declare class EventProcessor extends EventEmitter {
    ready: boolean;
    presenceQueue: any;
    presenceFlush: NodeJS.Timeout;
    guildCache: GuildCache;
    options: {
        cache: {
            guild: GuildCache;
            channel: ChannelCache;
            member: MemberCache;
            role: RoleCache;
            user: UserCache;
            emoji: EmojiCache;
            channelMap: ChannelMapCache;
            presence: PresenceCache;
        };
        presenceInterval: number | undefined;
        disabledEvents: any;
    };
    channelCache: ChannelCache;
    memberCache: MemberCache;
    roleCache: RoleCache;
    userCache: UserCache;
    emojiCache: EmojiCache;
    channelMapCache: ChannelMapCache;
    presenceCache: PresenceCache;
    /**
     * Class responsible for executing methods on the correct cache class based on the event received from the incoming connector
     * @param options
     */
    constructor(options?: {
        cache: {
            guild: GuildCache;
            channel: ChannelCache;
            member: MemberCache;
            role: RoleCache;
            user: UserCache;
            emoji: EmojiCache;
            channelMap: ChannelMapCache;
            presence: PresenceCache;
        };
        presenceInterval?: undefined | number;
        disabledEvents: any;
    });
    inbound(event: any): Promise<any>;
    process(event: Object): Promise<void>;
    handlePresenceUpdate(presenceEvent: any): void;
    processReady(readyEvent: any): Promise<any[]>;
    onChannelCreate(channelCreateEvent: any): Promise<ChannelCache>;
    onChannelDelete(channelDeleteEvent: any): Promise<void>;
    flushQueue(): Promise<void>;
}
export default EventProcessor;
