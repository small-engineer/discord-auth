"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = guildMemberAdd;
function guildMemberAdd(client, member) {
    client.on("guildMemberAdd", async (member) => {
        console.log(`[INFO] 新しいメンバーが参加しました: ${member.user.tag}`);
        const authChannelId = "1320608041078620160"; // 認証チャンネルID
        try {
            // 認証チャンネルを取得
            const authChannel = await member.guild.channels.fetch(authChannelId);
            if (!authChannel || !authChannel.isTextBased()) {
                console.error(`[ERROR] 認証チャンネルが見つからないか、テキストチャンネルではありません: ${authChannelId}`);
                return;
            }
            // 認証チャンネルにメッセージを送信
            await authChannel.send({
                content: `ようこそ ${member.user.username} さん！🎉\nこのサーバーで活動を始める前に、認証を完了してください！下記のボタンをクリックして認証を進めてください。`,
            });
            console.log(`[INFO] ${member.user.tag} を認証チャンネルに案内しました。`);
        }
        catch (error) {
            console.error(`[ERROR] 認証チャンネルへの案内に失敗しました: ${error instanceof Error ? error.message : error}`);
        }
    });
}
