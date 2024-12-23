import "dotenv/config"; // require("dotenv").config() の代替
import { Client, GatewayIntentBits } from "discord.js";

// イベント登録ファイルを読み込む
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// イベントを登録
client.once("ready", () => ready(client));
client.on("interactionCreate", (interaction) => interactionCreate(interaction));

// Bot起動
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("[ERROR] Discord ログインに失敗しました:", error);
});
