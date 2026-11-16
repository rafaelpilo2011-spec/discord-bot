# Discord Bot - Administração, Moderação e AntiRaid

Bot completo para servidores Discord, desenvolvido em TypeScript com discord.js, PostgreSQL e Prisma.

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Conta de desenvolvedor Discord com bot token

## Instalação

```bash
cd discord-bot
cp .env.example .env
# Edite o .env com seu DISCORD_TOKEN, CLIENT_ID e DATABASE_URL
npm install
npx prisma generate
npx prisma db push
```

## Execução local

```bash
npm run dev
```

## Build e execução

```bash
npm run build
npm start
```

## Docker

```bash
docker-compose up -d
```

## Estrutura do projeto

```
src/
  index.ts              # Entrada do bot
  commands/             # Slash commands
  events/               # Eventos do Discord
  services/             # Serviços de negócio
  middleware/           # Middleware (automoderação)
  utils/                # Utilitários
  types/                # Tipos TypeScript
```

## Comandos disponíveis

### Configuração
- `/configurar` - Painel de configuração
- `/configuracao ver` - Exibe configurações
- `/configuracao exportar` - Exporta JSON
- `/configuracao importar` - Importa JSON
- `/configuracao restaurar` - Restaura padrão

### AntiRaid
- `/antiraid status` - Status proteção
- `/antiraid configurar` - Configurar regras
- `/antiraid modo` - Definir modo
- `/antiraid ativar` - Ativar proteção
- `/antiraid desativar` - Desativar proteção
- `/antiraid simular` - Simulação sintética

### Emergência
- `/emergencia ativar` - Ativar contenção
- `/emergencia encerrar` - Encerrar emergência

### Moderação
- `/avisar` - Avisar membro
- `/avisos listar` - Listar avisos
- `/avisos remover` - Remover aviso
- `/timeout aplicar` - Aplicar timeout
- `/timeout remover` - Remover timeout
- `/expulsar` - Expulsar membro
- `/banir` - Banir membro
- `/desbanir` - Desbanir usuário
- `/caso ver` - Ver caso
- `/historico` - Histórico do membro
- `/denunciar` - Denunciar membro

### Limpeza
- `/limpar` - Limpar mensagens
- `/limpar_usuario` - Limpar por usuário
- `/limpar_bots` - Limpar bots
- `/limpar_links` - Limpar links
- `/limpar_anexos` - Limpar anexos
- `/canal_periodo` - Limpar por período

### Canais
- `/canal_bloquear` - Bloquear canal
- `/canal_desbloquear` - Desbloquear canal
- `/canal_slowmode` - Definir slowmode
- `/canal_clonar` - Clonar canal
- `/canal_recriar` - Recriar canal (admin)

## Observações

- Respostas de moderação são efêmeras por padrão.
- DMs são tentadas, mas nunca bloqueiam a moderação.
- Simulação antiraid usa eventos sintéticos, não gera spam real.
- Emergência desfaz apenas alterações feitas pelo bot.
- Canal recriar está restrito a administradores e avisa sobre perda de histórico.

## Licença

MIT
