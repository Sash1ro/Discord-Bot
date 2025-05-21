const {ContextMenuCommandBuilder, EmbedBuilder, userMention, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('kiss')
        .setContexts(2,0,1)
        .setType(ApplicationCommandType.User),
    async execute(interaction) {

        const target = interaction.targetUser

        const kissEmbed = new EmbedBuilder()
            .setDescription(`**${interaction.user.displayName} a embrassé**: ${userMention(target.id)} !`)
            .setImage(`https://i.imgur.com/rnLEvMa.gif`)
            .setColor([139, 30, 63])

        
        await interaction.reply({ embeds: [kissEmbed] });
    },
};