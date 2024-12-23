import { Interaction, GuildMember, Client } from "discord.js";
import { logToChannel } from "../utils/log";

export default async function interactionCreate(
  client: Client,
  interaction: Interaction
) {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "auth_button") return;

  const roleId = "1320603299174678629"; // 認証ロール
  const warningRoleId = "1320655664732700713"; // warningロール

  try {
    // メンバー情報を最新化
    const member = (await interaction.guild?.members.fetch(
      interaction.user.id
    )) as GuildMember;
    if (!member) {
      const errorMessage = `[ERROR] メンバー情報を取得できませんでした。`;
      console.error(errorMessage);
      logToChannel(client, errorMessage);
      await interaction.reply({
        content: ">>> " + errorMessage,
        ephemeral: true,
      });
      return;
    }

    // 警告ロールを持っている場合のチェック
    if (member.roles.cache.has(warningRoleId)) {
      const errorMessage = `[ERROR] ${member.user.tag} は警告ロールを所持しているため認証できません。`;
      console.error(errorMessage);
      logToChannel(client, errorMessage);
      await interaction.reply({
        content: ">>> " + errorMessage,
        ephemeral: true,
      });
      return;
    }

    // 既に認証済みかどうかをチェック
    if (member.roles.cache.has(roleId)) {
      const errorMessage = `[INFO] ${member.user.tag} は既に認証済みのユーザーです。`;
      console.log(errorMessage);
      logToChannel(client, errorMessage);
      await interaction.reply({
        content: ">>> " + errorMessage,
        ephemeral: true,
      });
      return;
    }

    // ロールを付与
    await member.roles.add(roleId);
    const successMessage = `[SUCCESS] ${member.user.tag} に認証ロールを付与しました。`;
    console.log(successMessage);
    logToChannel(client, successMessage);
    await interaction.reply({
      content: ">>> " + successMessage,
      ephemeral: true,
    });
  } catch (error) {
    const errorMessage = `[ERROR] ${interaction.user.tag} のロール付与中にエラーが発生しました: ${error}`;
    console.error(errorMessage);
    logToChannel(client, errorMessage);
    await interaction.reply({
      content:
        ">>> [ERROR] ロール付与に失敗しました。管理者にお問い合わせください。",
      ephemeral: true,
    });
  }
}
