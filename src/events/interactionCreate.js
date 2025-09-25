import { startGame } from "../services/hangman/hangmanService.js";

export default {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found`,
        );
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `There was an error while executing this command!`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const componentId = interaction.customId;

      if (componentId.startsWith("accept_button_")) {
        await interaction.deferUpdate();
        await startGame(interaction);
      }
    }
  },
};
