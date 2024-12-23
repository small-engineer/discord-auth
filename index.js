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
  console.log(`Logged in as ${client.user.tag}`);

  // メッセージを送信したいチャンネルのID
  const channelId = "1320608041078620160"; // <-- 差し替えてください
  const channel = await client.channels.fetch(channelId);

  // ボタンの行を作成
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("auth_button") // ボタンを識別するためのID
      .setLabel("認証する")
      .setStyle(ButtonStyle.Primary)
  );

  // 認証ボタン付きメッセージを送信
  await channel.send({
    content: "下のボタンを押して認証ロールを取得してください。",
    components: [row],
  });
});

// ボタンが押されたときに実行されるイベント
client.on(Events.InteractionCreate, async (interaction) => {
  // ボタンが押されたかどうかを判定
  if (!interaction.isButton()) return;
  if (interaction.customId !== "auth_button") return; // 上記で設定したボタンIDと一致するか

  // 付与したいロールID
  const roleId = "1320603299174678629"; // <-- 差し替えてください

  try {
    // interaction.user はボタンを押したユーザーを指します
    const member = await interaction.guild.members.fetch(interaction.user.id);

    // すでにロールを持っていないかどうかのチェック（必要に応じて）
    if (member.roles.cache.has(roleId)) {
      await interaction.reply({
        content: "すでに認証ロールを持っています！",
        ephemeral: true,
      });
      return;
    }

    // ロール付与
    await member.roles.add(roleId);

    // ユーザーに返信 (ephemeral: true でユーザー本人にのみ見えるメッセージにする)
    await interaction.reply({
      content: "認証ロールを付与しました！",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "ロール付与に失敗しました。",
      ephemeral: true,
    });
  }
});

// ログイン
client.login(process.env.DISCORD_TOKEN);
