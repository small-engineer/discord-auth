import { Message, GuildMember, Client } from "discord.js";
import { logToChannel } from "../utils/log"; // ログ送信関数を利用

// ユーザーごとのメンション数管理用
const mentionCountMap = new Map<
  string,
  { count: number; lastResetTime: number }
>();
const everyoneMentionCountMap = new Map<
  string,
  { count: number; lastResetTime: number }
>();

// しきい値・リセット秒数
const MENTION_THRESHOLD = 20; // 個人メンション: 20秒で20回
const EVERYONE_THRESHOLD = 5; // @everyone/@here: 20秒で5回
const MENTION_RESET_INTERVAL = 20; // 20秒でカウントリセット

// ロールID
const AUTH_ROLE_ID = "1320603299174678629"; // 認証ロール
const WARNING_ROLE_ID = "1320655664732700713"; // warningロール

export default async function messageCreate(client: Client, message: Message) {
  if (!message.guild || message.author.bot) return;

  const member = message.member as GuildMember;
  if (!member) return;

  const now = Date.now() / 1000; // 秒単位タイムスタンプ

  // 個人メンションのカウント管理
  if (!mentionCountMap.has(member.id)) {
    mentionCountMap.set(member.id, { count: 0, lastResetTime: now });
  }
  const userMentionData = mentionCountMap.get(member.id);
  if (
    userMentionData &&
    now - userMentionData.lastResetTime >= MENTION_RESET_INTERVAL
  ) {
    userMentionData.count = 0;
    userMentionData.lastResetTime = now;
  }

  // @everyone/@here のカウント管理
  if (!everyoneMentionCountMap.has(member.id)) {
    everyoneMentionCountMap.set(member.id, { count: 0, lastResetTime: now });
  }
  const everyoneMentionData = everyoneMentionCountMap.get(member.id);
  if (
    everyoneMentionData &&
    now - everyoneMentionData.lastResetTime >= MENTION_RESET_INTERVAL
  ) {
    everyoneMentionData.count = 0;
    everyoneMentionData.lastResetTime = now;
  }

  // メンション数のカウント
  const individualMentions = message.mentions.users.size; // 個人メンション数
  const everyoneMentions = message.mentions.everyone ? 1 : 0; // @everyone/@here が含まれるか

  // カウント更新
  if (userMentionData) {
    userMentionData.count += individualMentions;
  }
  if (everyoneMentionData) {
    everyoneMentionData.count += everyoneMentions;
  }

  // 警告処理 (個人メンション)
  if (userMentionData && userMentionData.count > MENTION_THRESHOLD) {
    await applyWarning(client, message, member, "過剰な個人メンション");
  }

  // 警告処理 (@everyone/@here)
  if (everyoneMentionData && everyoneMentionData.count > EVERYONE_THRESHOLD) {
    await applyWarning(
      client,
      message,
      member,
      "@everyone または @here の過剰使用"
    );
  }
}

// 警告処理
async function applyWarning(
  client: Client,
  message: Message,
  member: GuildMember,
  reason: string
) {
  try {
    // 認証ロールを剥奪
    if (member.roles.cache.has(AUTH_ROLE_ID)) {
      await member.roles.remove(AUTH_ROLE_ID);
    }

    // warning ロールを付与
    if (!member.roles.cache.has(WARNING_ROLE_ID)) {
      await member.roles.add(WARNING_ROLE_ID);
    }

    // チャンネルが TextBased なら警告メッセージを送信
    if (message.channel.isTextBased() && !message.channel.isDMBased()) {
      await message.channel.send(
        `<@${member.id}> さん、${reason} のため警告ロールを付与しました。`
      );
    }

    // ログをチャンネルに送信
    const logMessage = `[WARNING] ${member.user.tag} に警告ロールを付与: ${reason}`;
    console.log(logMessage);
    logToChannel(client, logMessage);
  } catch (error) {
    const errorMessage = `[ERROR] ロール変更に失敗: ${error}`;
    console.error(errorMessage);
    logToChannel(client, errorMessage);
  }
}
