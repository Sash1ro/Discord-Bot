const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Embrasse qlq !')
        .addUserOption(option => 
            option.setName('user')
            .setDescription("L'utilisateur à embrasser")
            .setRequired(true)
        ),
    async execute(interaction) {

        const target = interaction.options.getUser('user')

        const kissEmbed = new EmbedBuilder()
            .setDescription(`**${interaction.user.displayName} a embrassé**: ${userMention(target.id)} !`)
            .setImage(`https://i.imgur.com/rnLEvMa.gif`)
            .setColor([139, 30, 63])

        
        await interaction.reply({ embeds: [kissEmbed] });
    },
};