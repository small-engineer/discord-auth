require("dotenv").config(); // dotenvを使う場合
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

// Botインスタンス作成
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Botが起動したときに実行されるイベント
client.once("ready", async () => {
  console.log(`[INFO] Logged in as ${client.user.tag}`);

  // メッセージを送信したいチャンネルのID
  const channelId = "1320608041078620160"; // <-- 差し替えてください
  const channel = await client.channels.fetch(channelId);

  // ボタンの行を作成
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("auth_button") // ボタンを識別するためのID
      .setLabel("▶ Authenticate") // UNIX風にするため英語表記
      .setStyle(ButtonStyle.Success) // 緑のボタン
  );

  // 認証ボタン付きメッセージを送信
  await channel.send({
    content: `\`\`\`
System: UNIX Discord Authenticator v1.0
---------------------------------------
To proceed with authentication:
1. Click the button below.
2. Verify your user role.

[INFO] Waiting for user input...
\`\`\``,
    components: [row],
  });
});

// ボタンが押されたときに実行されるイベント
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== "auth_button") return;

  const roleId = "1320603299174678629"; // <-- 差し替えてください

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (member.roles.cache.has(roleId)) {
      await interaction.reply({
        content: `\`\`\`
[ERROR] Role assignment failed.
Reason: User already has the authentication role.
\`\`\``,
        ephemeral: true,
      });
      return;
    }

    // ロール付与
    await member.roles.add(roleId);

    await interaction.reply({
      content: `\`\`\`
[INFO] Authentication successful.
Role 'user' has been assigned.
\`\`\``,
      ephemeral: true,
    });
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    await interaction.reply({
      content: `\`\`\`
[ERROR] Role assignment failed.
Reason: An unexpected error occurred.
\`\`\``,
      ephemeral: true,
    });
  }
});

// ログイン
client.login(process.env.DISCORD_TOKEN);
