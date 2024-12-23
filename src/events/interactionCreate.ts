import { Interaction, GuildMember } from "discord.js";

export default async function interactionCreate(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "auth_button") return;

  const roleId = "1320603299174678629"; // 認証ロール
  const warningRoleId = "1320600782101545000"; // warningロール

  try {
    // メンバー情報を最新化
    const member = (await interaction.guild?.members.fetch(
      interaction.user.id
    )) as GuildMember;
    if (!member) {
      await interaction.reply({
        content: ">>> [ERROR] メンバー情報を取得できませんでした。",
        ephemeral: true,
      });
      return;
    }

    // 警告ロールを持っている場合のチェック
    if (member.roles.cache.has(warningRoleId)) {
      await interaction.reply({
        content:
          ">>> [ERROR] あなたは警告ロールを所持しているため認証できません。",
        ephemeral: true,
      });
      return;
    }

    // 既に認証済みかどうかをチェック
    if (member.roles.cache.has(roleId)) {
      await interaction.reply({
        content: ">>> [ERROR] 既に認証済みのユーザーです。",
        ephemeral: true,
      });
      return;
    }

    // ロールを付与
    await member.roles.add(roleId);
    await interaction.reply({
      content: ">>> [SUCCESS] 認証が完了しました！ようこそ！",
      ephemeral: true,
    });
  } catch (error) {
    console.error(`[ERROR] ロール付与中にエラーが発生しました: ${error}`);
    await interaction.reply({
      content:
        ">>> [ERROR] ロール付与に失敗しました。管理者にお問い合わせください。",
      ephemeral: true,
    });
  }
}
