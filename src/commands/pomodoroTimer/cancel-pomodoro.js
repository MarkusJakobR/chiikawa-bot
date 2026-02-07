import { SlashCommandBuilder } from "discord.js";
import { cancelSession } from "../../services/pomodoro/pomodoroService.js";

export default {
  data: new SlashCommandBuilder()
    .setName("cancel-pomodoro")
    .setDescription("Cancels your current pomodoro session."),

  async execute(interaction) {
    const userId = interaction.user.id;
    const timerId = interaction.channelId + userId;

    if (cancelSession(timerId)) {
      await interaction.reply({
        content: `Cancelling your current session, <@${userId}>...`,
      });
    } else {
      await interaction.reply({
        content: `You do not have a current session, <@${userId}>...`,
        ephemeral: true,
      });
    }
  },
};
