//src/index.ts

import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";

// [追加]
import messageCreate from "./events/messageCreate";

const client = new Client({
  // メッセージ内容やメンバー情報を扱うための Intent を追加
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // メッセージ本文やメンションを読み取る場合必須
  ],
});

// イベントを登録
client.once("ready", () => ready(client));
client.on("interactionCreate", (interaction) => interactionCreate(interaction));

// [追加] messageCreateイベント
client.on("messageCreate", (message) => messageCreate(message));

// Bot起動
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("[ERROR] Discord ログインに失敗しました:", error);
});
