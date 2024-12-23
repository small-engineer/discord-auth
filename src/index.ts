import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";
import voiceStateUpdate from "./events/voiceStateUpdate";
import { setupLogging } from "./utils/log";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

setupLogging(client);

client.once("ready", () => ready(client));
client.on("interactionCreate", (interaction) =>
  interactionCreate(client, interaction)
);
client.on("messageCreate", (message) => messageCreate(client, message));
client.on("voiceStateUpdate", (oldState, newState) =>
  voiceStateUpdate(client, oldState, newState)
);

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("[ERROR] Discord ログインに失敗しました:", error);
});
