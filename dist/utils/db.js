"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildConfigServiceStub = void 0;
exports.connectDb = connectDb;
exports.disconnectDb = disconnectDb;
class GuildConfigServiceStub {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
}
exports.GuildConfigServiceStub = GuildConfigServiceStub;
async function connectDb() {
    console.log('[DB] Modo stub - Prisma Client não disponível sem geração');
}
async function disconnectDb() {
    console.log('[DB] Desconectado');
}
//# sourceMappingURL=db.js.map