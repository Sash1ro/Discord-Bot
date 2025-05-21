const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setContexts(2,0,1)
        .setDescription('LGBTQIA+ édition premium python cream deluxe'),
    async execute(interaction) {
        const gayEmbed = new EmbedBuilder()
            .setTitle("Pas besoin de dire qui...")
            .setImage("https://i.imgur.com/TechQcg.jpeg")
            .setColor([139, 30, 63])
        await interaction.reply({ embeds: [gayEmbed] });
    },
};