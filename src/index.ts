import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";
import { setupLogging } from "./utils/log";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ログ機能をセットアップ
setupLogging(client);

// イベントを登録
client.once("ready", () => ready(client));
client.on("interactionCreate", (interaction) => interactionCreate(interaction));
client.on("messageCreate", (message) => messageCreate(message));

// Bot起動
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("[ERROR] Discord ログインに失敗しました:", error);
});
