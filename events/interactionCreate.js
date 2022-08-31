module.exports = {
	once: false,
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;

		if(interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
		
			try {
				await command.execute(interaction);
			} catch (error) {
				interaction.reply({
					content: "There was an error executing the command!",
					ephemeral: true
				});
			
				console.log(error);
			}
		}
	}
}
