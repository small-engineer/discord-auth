import {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { logToChannel } from "../utils/log";

export default function handleGuildMemberAdd(client: Client) {
  client.on("guildMemberAdd", async (member) => {
    const infoMessage = `[INFO] 新規メンバーが参加しました: ${member.user.tag}`;
    console.log(infoMessage);
    logToChannel(client, infoMessage);

    try {
      const channelId = "1320595048731250691";
      const channel = await client.channels.fetch(channelId);

      if (!channel || !(channel instanceof TextChannel)) {
        const errorMessage = `[ERROR] 指定されたチャンネルが見つからないか、テキストチャンネルではありません: ${channelId}`;
        console.error(errorMessage);
        logToChannel(client, errorMessage);
        return;
      }

      // 認証ボタンの作成
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("auth_button")
          .setLabel("確認する")
          .setStyle(ButtonStyle.Success)
      );

      // 埋め込みメッセージの作成
      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle("📜 #define サーバー規約")
        .setDescription(
          `
        **これは通常、以下の3点に要約されます:**\n
      **1.** 他人のプライバシーを尊重すること。\n
      **2.** タイプする前に考えること。\n
      **3.** 大いなる力には大いなる責任が伴うこと。\n
      **4.** すべての操作はログに記録されます。\n\n
            `
        )
        .setFooter({
          text: "ルールを守り、楽しい時間をお過ごしください！",
        })
        .setTimestamp();

      // チャンネルにメッセージを送信
      await channel.send({
        content: `
        ようこそ、<@${member.id}> さん！サーバーを利用する前に以下の規約をご確認ください！\n
        規約を確認したら #introduction チャンネルでぜひ自己紹介をお願いします！\n
        `,
        embeds: [embed],
        components: [row],
      });

      const successMessage = `[INFO] 認証メッセージをチャンネルに送信しました: ${channelId}`;
      console.log(successMessage);
      logToChannel(client, successMessage);
    } catch (error) {
      const errorMessage = `[ERROR] メッセージ送信に失敗しました: ${
        error instanceof Error ? error.message : error
      }`;
      console.error(errorMessage);
      logToChannel(client, errorMessage);
    }
  });
}
