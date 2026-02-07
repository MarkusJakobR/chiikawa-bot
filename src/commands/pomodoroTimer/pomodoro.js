import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { startTimer } from "../../services/pomodoro/pomodoroService.js";

// creates a command for the pomodoro command
export default {
  data: new SlashCommandBuilder()
    .setName("pomodoro")
    .setDescription("Creates a pomodoro timer for you to study with.")
    .addIntegerOption((option) =>
      option
        .setName("study")
        .setDescription("Number of study minutes")
        .setMinValue(1)
        .setMaxValue(60),
    )
    .addIntegerOption((option) =>
      option
        .setName("break")
        .setDescription("Number of break minutes")
        .setMinValue(1)
        .setMaxValue(30),
    )
    .addIntegerOption((option) =>
      option
        .setName("cycle")
        .setDescription("Number of pomodoro cycles")
        .setMinValue(1)
        .setMaxValue(10),
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const timerId = interaction.channelId + interaction.user.id;

    const studyMinutes = interaction.options.getInteger("study") ?? 25;
    const breakMinutes = interaction.options.getInteger("break") ?? 5;
    const cycles = interaction.options.getInteger("cycle") ?? 1;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(
          `start_button_${timerId}_${studyMinutes}_${breakMinutes}_${cycles}`,
        )
        .setLabel("Start Session")
        .setStyle(ButtonStyle.Success),
    );

    const response = await interaction.reply({
      content:
        `Ready to start your pomodoro session, <@${userId}>?\n\n` +
        `⏰ Study Time: **${studyMinutes}** min. \t| \t😴 Break Time: **${breakMinutes}** min.\n\n` +
        `This timer will repeat for **${cycles}**` +
        (cycles == 1 ? " cycle" : " cycles"),
      components: [row],
      ephemeral: true,
      fetchReply: true,
    });
    const filter = (i) => i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter,
        time: 60000,
      });
      if (confirmation.customId.startsWith("start_button_")) {
        await confirmation.update({
          content: "Your pomodoro session is starting...",
          components: [],
        });

        await startTimer(interaction, studyMinutes, breakMinutes, cycles);
      }
    } catch {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute. Cancelling...",
        components: [],
      });
    }
  },
};
