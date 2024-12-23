import { GuildMember } from "discord.js";

export default async function guildMemberAdd(member: GuildMember) {
  // 認証チャンネルのIDを指定
  const authChannelId = "1320608041078620160"; // <-- 認証チャンネルIDに置き換えてください

  try {
    // 認証チャンネルを取得
    const authChannel = await member.guild.channels.fetch(authChannelId);

    if (!authChannel || !authChannel.isTextBased()) {
      console.error(
        `[ERROR] 認証チャンネルが見つからないか、テキストチャンネルではありません: ${authChannelId}`
      );
      return;
    }

    // 認証チャンネルにメンバー宛のメッセージを送信
    await authChannel.send({
      content: `ようこそ ${member.user.username} さん！🎉\nこのサーバーで活動を始める前に、認証を完了してください！下記のボタンをクリックして認証を進めてください。`,
    });

    console.log(`[INFO] ${member.user.tag} を認証チャンネルに案内しました。`);
  } catch (error) {
    console.error(`[ERROR] 認証チャンネルへの案内に失敗しました: ${error}`);
  }
}
