"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const ready_1 = __importDefault(require("./events/ready"));
const interactionCreate_1 = __importDefault(require("./events/interactionCreate"));
const messageCreate_1 = __importDefault(require("./events/messageCreate"));
const voiceStateUpdate_1 = __importDefault(require("./events/voiceStateUpdate"));
const log_1 = require("./utils/log");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
(0, log_1.setupLogging)(client);
client.once("ready", () => (0, ready_1.default)(client));
client.on("interactionCreate", (interaction) => (0, interactionCreate_1.default)(client, interaction));
client.on("messageCreate", (message) => (0, messageCreate_1.default)(client, message));
client.on("voiceStateUpdate", (oldState, newState) => (0, voiceStateUpdate_1.default)(client, oldState, newState));
client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("[ERROR] Discord ログインに失敗しました:", error);
});
