const { SlashCommandBuilder } = require('discord.js');
const { entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('playbersac')
        .setDescription('On se dépèche ?'),
    async execute(interaction) {
        const member = interaction.member
        const vc = member.voice.channel

        if(!vc) {
            return interaction.reply({ content: 'Tu dois être dans un salon vocal pour que je puisse te rejoindre!', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
        } catch (error) {
            console.error('Erreur lors de la connexion au salon vocal :', error);
            connection.destroy();
            return interaction.reply({ content: 'Je n\'ai pas pu me connecter au salon vocal.', ephemeral: true });
        }

        const player = createAudioPlayer();
        const audioPath = path.join(__dirname, '../bersac.mp3');
        const resource = createAudioResource(createReadStream(audioPath));


        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.on('error', error => {
            console.error('Erreur du player audio :', error);
            connection.destroy();
        });

        return interaction.reply({ content: 'Je suis dans le salon vocal et j\'ai commencé à jouer le son !', ephemeral: true });
    },
};