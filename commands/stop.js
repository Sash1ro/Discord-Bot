const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Arrt le son'),
    async execute(interaction) {
        const member = interaction.member
        const vc = member.voice.channel

        if(!vc) {
            return interaction.reply({ content: 'Tu est nonchalant, rejoint un salon vocal d\'abord !', ephemeral: true });
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
        
        return interaction.reply({ content: 'Allez on se dépèche !', ephemeral: true });
    },
};