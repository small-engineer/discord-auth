require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`[INFO] Bot起動完了 - ${client.user.tag}`);

  const channelId = "1320608041078620160";
  const channel = await client.channels.fetch(channelId);

  // ボタンの行を作成
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("auth_button")
      .setLabel("認証する")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    content: `
\`\`\`
# サーバー利用規約
===================================
1. サーバー内では互いに敬意を払いましょう。
2. 不適切な発言や行動は厳禁です。
3. 管理者は必要に応じて規約を変更する権利を持ちます。
4. 規約違反者には適切な対応を行います。
===================================
# 以下のコマンドを実行してください:
[ 認証する ] ボタンをクリックして認証を完了します。
\`\`\``,
    components: [row],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "auth_button") return;

  const roleId = "1320603299174678629";

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.roles.cache.has(roleId)) {
      await interaction.reply({
        content: ">>> [ERROR] 既に認証済みのユーザーです。",
        ephemeral: true,
      });
      return;
    }
    await member.roles.add(roleId);
    await interaction.reply({
      content: ">>> [SUCCESS] 認証が完了しました！ようこそ！",
      ephemeral: true,
    });
  } catch (error) {
    console.error(`[ERROR] ロール付与中にエラーが発生しました: ${error}`);
    await interaction.reply({
      content:
        ">>> [ERROR] ロール付与に失敗しました。管理者にお問い合わせください。",
      ephemeral: true,
    });
  }
});

// ログイン
client.login(process.env.DISCORD_TOKEN);
