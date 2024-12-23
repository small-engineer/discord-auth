import {
  Client,
  VoiceState,
  EmbedBuilder,
  TextChannel,
  CategoryChannel,
} from "discord.js";

export default async function voiceStateUpdate(
  client: Client,
  oldState: VoiceState,
  newState: VoiceState
) {
  // ボイスチャンネルへの参加を検知
  if (!oldState.channel && newState.channel) {
    const voiceChannel = newState.channel;

    // 参加者が1人（初めて参加）になった場合のみ通知
    if (voiceChannel.members.size === 1) {
      const category = voiceChannel.parent as CategoryChannel | null;

      // 同じカテゴリ内のテキストチャンネルを取得
      const textChannels = voiceChannel.guild.channels.cache
        .filter(
          (ch) =>
            ch.isTextBased() &&
            ch.parentId === voiceChannel.parentId &&
            ch.type === 0 // 通常のテキストチャンネル
        )
        .toJSON() as TextChannel[];

      const sortedChannels = textChannels.sort(
        (a, b) => a.position - b.position
      );

      const targetChannel = sortedChannels[0];

      if (targetChannel) {
        const member = newState.member;
        const embed = new EmbedBuilder()
          .setColor(0x6ab547)
          .setTitle("通話が始まりました！")
          .setDescription(
            `${member?.displayName} が **${
              voiceChannel.name
            }** に参加しました！\nカテゴリ: **${category?.name || "なし"}**`
          )
          .setThumbnail(member?.user.displayAvatarURL() || "")
          .setTimestamp();

        // メッセージ送信
        await targetChannel.send({ content: "@here", embeds: [embed] });
      }
    }
  }
}
