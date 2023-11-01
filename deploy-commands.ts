import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('approve')
    .setDescription('難民受け入れに賛成する')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('ユーザーを選択')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('disapprove')
    .setDescription('難民受け入れを取り下げる')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('ユーザーを選択')
        .setRequired(true)),
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

