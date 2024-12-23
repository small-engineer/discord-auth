"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToChannel = logToChannel;
exports.setupLogging = setupLogging;
// ログを送信するチャンネルIDを環境変数から取得
const LOG_CHANNEL_ID = "1320654324145193012";
// ログ送信用関数
function logToChannel(client, message) {
    if (!LOG_CHANNEL_ID) {
        console.error("[ERROR] LOG_CHANNEL_ID が設定されていません");
        return;
    }
    const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel && logChannel.isTextBased() && !logChannel.isDMBased()) {
        logChannel.send(`[LOG] ${message}`).catch((error) => {
            console.error("[ERROR] ログの送信に失敗:", error);
        });
    }
    else {
        console.error("[ERROR] ログチャンネルが見つからないか利用できません");
    }
}
// 既存の console.log を上書き
function setupLogging(client) {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        const logMessage = args.map((arg) => String(arg)).join(" ");
        originalConsoleLog(...args); // 元の console.log を実行
        logToChannel(client, logMessage); // ログをチャンネルに送信
    };
}
