import { Client, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const intents = [
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers
];

const client = new Client({ intents });

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'approve' || commandName === 'disapprove') {
    const user = options.getUser('user');
    if (!user) {
      await interaction.reply('ユーザーが見つかりません。');
      return;
    }

    const userData = await User.findById(user.id) || new User({ _id: user.id });
    const isApprove = commandName === 'approve';

    const userArray = isApprove ? userData.approvedUsers : userData.disapprovedUsers;
    const oppositeArray = isApprove ? userData.disapprovedUsers : userData.approvedUsers;

    if (userArray.includes(interaction.user.id)) {
      await interaction.reply('あなたは既にこのアクションを実行しています。');
      return;
    }

    userArray.push(interaction.user.id);
    const oppositeIndex = oppositeArray.indexOf(interaction.user.id);
    if (oppositeIndex > -1) oppositeArray.splice(oppositeIndex, 1);

    await userData.save();
    await interaction.reply(`${user.username}に対して${isApprove ? '賛成' : '反対'}しました。`);
  }
});

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    client.login(process.env.DISCORD_TOKEN);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

