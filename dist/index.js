"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RainCache_1 = require("./RainCache");
function RainCache(options, inboundConnector, outboundConnector) {
    return new RainCache_1.default(options, inboundConnector, outboundConnector);
}
RainCache.Connectors = {
    AmqpConnector: Promise.resolve().then(() => require('./connector/AmqpConnector')),
    DirectConnector: Promise.resolve().then(() => require('./connector/DirectConnector')),
};
RainCache.Engines = {
    RedisStorageEngine: require('./storageEngine/RedisStorageEngine'),
};
exports.default = RainCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUVwQyxTQUFTLFNBQVMsQ0FBQyxPQUFtRixFQUFFLGdCQUFtQyxFQUFFLGlCQUFvQztJQUM3SyxPQUFPLElBQUksbUJBQVMsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRUQsU0FBUyxDQUFDLFVBQVUsR0FBRztJQUNuQixhQUFhLHVDQUFTLDJCQUEyQixFQUFDO0lBQ2xELGVBQWUsdUNBQVMsNkJBQTZCLEVBQUM7Q0FDekQsQ0FBQztBQUVGLFNBQVMsQ0FBQyxPQUFPLEdBQUc7SUFDaEIsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLG9DQUFvQyxDQUFDO0NBQ3BFLENBQUM7QUFDRixrQkFBZSxTQUFTLENBQUMifQ==