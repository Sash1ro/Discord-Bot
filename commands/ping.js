const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Renvoie la latence du Bot !'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setAuthor( { name : interaction.user.tag, iconURL: interaction.user.avatarURL() } )
            .setDescription(`**Latence moyenne**: \`${interaction.client.ws.ping}ms\``)
            .setThumbnail(`https://i.imgur.com/sULofJ9.png`)
            .setColor([139, 30, 63])
        await interaction.reply({ embeds: [pingEmbed] });
    },
};