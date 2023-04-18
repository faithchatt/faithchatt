const { InteractionType } = require("discord.js");

module.exports = {
	once: false,
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;

		if(interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(interaction).catch(err => console.error(err));
			} catch (error) {
				try {
					interaction.reply({
						content: "There was an error executing the command!",
						ephemeral: true
					});
				} catch (error) {}
			
				console.log(error);
			}
		} else if (interaction.type === InteractionType.ModalSubmit) {
			const modal = client.modals.get(interaction.customId);
			if (!modal) return;
			try {
				await modal.execute(interaction)
			} catch (error) {
				console.log(error);
			}
		} else if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);
			if (!button) return;
			try {
				await button.execute(interaction)
			} catch (error) {
				console.log(error);
			}
		}
	}
}
