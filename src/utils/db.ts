export class GuildConfigServiceStub {
  constructor(private prisma: any) {}
}

export async function connectDb() {
  console.log('[DB] Modo stub - Prisma Client não disponível sem geração');
}

export async function disconnectDb() {
  console.log('[DB] Desconectado');
}
