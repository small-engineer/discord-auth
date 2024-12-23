import {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";

export default async function ready(client: Client) {
  console.log(`[INFO] Bot起動完了 - ${client?.user?.tag}`);

  try {
    const channelId = "1320608041078620160";
    const channel = await client.channels.fetch(channelId);

    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof TextChannel)
    ) {
      console.error(
        `[ERROR] 指定されたチャンネルが見つかりません: ${channelId}`
      );
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
  } catch (error) {
    console.error("[ERROR] メッセージ送信に失敗しました:", error);
  }
}
