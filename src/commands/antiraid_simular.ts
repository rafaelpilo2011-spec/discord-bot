import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('antiraid_simular')
  .setDescription('Simula um evento de raid com dados sintéticos')
  .setDefaultMemberPermissions(['ManageGuild'] as any)
  .addStringOption((option: any) =>
    option
      .setName('tipo')
      .setDescription('Tipo de simulação')
      .setRequired(true)
      .addChoices(
        { name: 'Entradas em massa', value: 'join_spike' },
        { name: 'Contas novas', value: 'new_accounts' },
        { name: 'Spam de mensagens', value: 'message_spam' }
      )
  )
  .addIntegerOption((option: any) =>
    option.setName('quantidade').setDescription('Quantidade de eventos').setRequired(true).setMinValue(1).setMaxValue(100)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `antiraid_simular_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const type = interaction.options.getString('tipo')!;
  const quantity = interaction.options.getInteger('quantidade')!;

  const antiRaid = client.antiRaid;
  if (antiRaid) {
    const result = antiRaid.simulate(interaction.guild!.id, type, quantity);
    await successReply(interaction, `Simulação de **${type}** registrada: ${result.recorded} eventos sintéticos.`);
  } else {
    await warningReply(interaction, 'Serviço antiraid não inicializado.');
  }
};

export default { data, handler };
