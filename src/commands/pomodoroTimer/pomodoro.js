import { SlashCommandBuilder } from "discord.js";

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
    const timerId = interaction.id;

    const studyMinutes = interaction.options.getInteger("study") ?? 25;
    const breakMinutes = interaction.options.getInteger("break") ?? 5;
    const cycles = interaction.options.getInteger("cycle") ?? 1;

    // creates the initial interaction after entering the command
    await interaction.reply({
      content:
        `Study well and focused, <@${userId}>!\n\n` +
        `⏰ Study Time: **${studyMinutes}** min. \t| \t😴 Break Time: **${breakMinutes}** min.\n\n` +
        `This timer will repeat for **${cycles}**` +
        (cycles == 1 ? " cycle" : " cycles"),
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "Start Timer",
              custom_id: `start_button_${timerId}_${studyMinutes}_${breakMinutes}_${cycles}`,
            },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};
