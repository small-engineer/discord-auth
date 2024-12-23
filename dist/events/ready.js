"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleGuildMemberAdd;
const discord_js_1 = require("discord.js");
const log_1 = require("../utils/log");
function handleGuildMemberAdd(client) {
    client.on("guildMemberAdd", async (member) => {
        const infoMessage = `[INFO] 新規メンバーが参加しました: ${member.user.tag}`;
        console.log(infoMessage);
        (0, log_1.logToChannel)(client, infoMessage);
        try {
            const channelId = "1320595048731250691";
            const channel = await client.channels.fetch(channelId);
            if (!channel || !(channel instanceof discord_js_1.TextChannel)) {
                const errorMessage = `[ERROR] 指定されたチャンネルが見つからないか、テキストチャンネルではありません: ${channelId}`;
                console.error(errorMessage);
                (0, log_1.logToChannel)(client, errorMessage);
                return;
            }
            // 認証ボタンの作成
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("auth_button")
                .setLabel("確認する")
                .setStyle(discord_js_1.ButtonStyle.Success));
            // 埋め込みメッセージの作成
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(0x00bfff)
                .setTitle("📜 #define サーバー規約")
                .setDescription(`
        **これは通常、以下の3点に要約されます:**\n
      **1.** 他人のプライバシーを尊重すること。\n
      **2.** タイプする前に考えること。\n
      **3.** 大いなる力には大いなる責任が伴うこと。\n
      **4.** すべての操作はログに記録されます。\n\n
            `)
                .setFooter({
                text: "ルールを守り、楽しい時間をお過ごしください！",
            })
                .setTimestamp();
            // チャンネルにメッセージを送信
            await channel.send({
                content: `ようこそ、<@${member.id}> さん！サーバーを利用する前に以下の規約をご確認ください！`,
                embeds: [embed],
                components: [row],
            });
            const successMessage = `[INFO] 認証メッセージをチャンネルに送信しました: ${channelId}`;
            console.log(successMessage);
            (0, log_1.logToChannel)(client, successMessage);
        }
        catch (error) {
            const errorMessage = `[ERROR] メッセージ送信に失敗しました: ${error instanceof Error ? error.message : error}`;
            console.error(errorMessage);
            (0, log_1.logToChannel)(client, errorMessage);
        }
    });
}
