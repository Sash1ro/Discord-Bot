const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Arrt le son'),
    async execute(interaction) {
        const member = interaction.member
        const vc = member.voice.channel

        const bot = interaction.guild.members.cache.get(interaction.client.user.id)
        const bot_vc = bot.voice.channel

        if(!vc) {
            return interaction.reply({ content: 'Tu est nonchalant, rejoint un salon vocal d\'abord !', ephemeral: true });
        }

        if(!bot_vc) {
            return interaction.reply({ content: 'Je ne suis pas dans un salon vocal !', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator,
            selfDeaf: false
        });
        
        
        try {
            connection.destroy();
        } catch(error) {
            console.error(error)
            return interaction.reply({ content: "Erreur inconnue !", ephemeral: true });
        } 
        
        return interaction.reply({ content: `SoundBoard arrêtée !`, ephemeral: true });
    },
};