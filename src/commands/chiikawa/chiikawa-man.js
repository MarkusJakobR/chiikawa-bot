import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ButtonStyle,
} from "discord.js";
import { startGame } from "../../services/hangman/hangmanService.js";

// creates a command for the hangman chiikawa
export default {
  data: new SlashCommandBuilder()
    .setName("save-chiikawa")
    .setDescription("Starts a game of hangman to save Chiikawa!"),
  async execute(interaction) {
    const userId = interaction.user.id;
    const gameId = interaction.id;

    // creates the initial interaction after entering the command
    // await interaction.reply({
    //   content: `Go save Chiikawa, <@${userId}>!`,
    //   components: [
    //     {
    //       type: 1,
    //       components: [
    //         {
    //           type: 2,
    //           style: 1,
    //           label: "Accept",
    //           custom_id: `accept_button_${gameId}`,
    //         },
    //       ],
    //     },
    //   ],
    //   ephemeral: true,
    // });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_button_${gameId}`)
        .setLabel("Accept Mission")
        .setStyle(ButtonStyle.Success),
    );

    const response = await interaction.reply({
      content: `Go save Chiikawa, <@${userId}>!`,
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
      if (confirmation.customId.startsWith("accept_button_")) {
        await confirmation.update({
          content: "Transporting you to Chiikawa land...",
          components: [],
        });
        await startGame(interaction);
      }
    } catch {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute. Cancelling...",
        components: [],
      });
    }
  },
};
