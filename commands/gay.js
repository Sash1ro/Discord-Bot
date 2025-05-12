const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription('LGBTQIA+ édition premium python cream deluxe'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setAuthor( { name : interaction.user.tag, iconURL: interaction.user.avatarURL() } )
            .setImage("https://i.imgur.com/TcPg7yA.gif")
            .setColor([139, 30, 63])
        await interaction.reply({ embeds: [pingEmbed] });
    },
};