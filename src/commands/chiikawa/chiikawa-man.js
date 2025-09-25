import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder.setName("save-chiikawa").setDescription(
    "Starts a game of hangman to save Chiikawa!",
  ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const gameId = interaction.id;

    await interaction.reply({
      content: `Go save Chiikawa, <@${userId}>!`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "Accept",
              custom_id: `accept_button_${gameId}`,
            },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};
