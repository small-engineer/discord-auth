"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // require("dotenv").config() の代替
const discord_js_1 = require("discord.js");
// イベント登録ファイルを読み込む
const ready_1 = __importDefault(require("./events/ready"));
const interactionCreate_1 = __importDefault(require("./events/interactionCreate"));
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers],
});
// イベントを登録
client.once("ready", () => (0, ready_1.default)(client));
client.on("interactionCreate", (interaction) => (0, interactionCreate_1.default)(interaction));
// Bot起動
client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("[ERROR] Discord ログインに失敗しました:", error);
});
