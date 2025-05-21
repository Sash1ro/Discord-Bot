const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('SoundBoard Pro')
        .addStringOption(option =>
            option.setName("son")
                .setDescription("Choisi le son")
                .addChoices(
                    { name: "L'attaque des tableaux", value: "groutch.mp3" },
                    { name: "Bersac", value: "bersac.mp3" }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const member = interaction.member
        const vc = member.voice.channel

        if (!vc) {
            return interaction.reply({ content: 'Tu est nonchalant, rejoint un salon vocal d\'abord !', ephemeral: true });
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
        const son = interaction.options.getString('son')
        const player = createAudioPlayer();
        const audioPath = path.join(__dirname, `../../music/${son}`);
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

        const playEmbed = new EmbedBuilder()
            .setColor([139, 30, 63])
            .setDescription(`${son} lancée !`)
            .setImage("https://i.imgur.com/TcPg7yA.gif")

        return interaction.reply({ embeds: [playEmbed] });
    },
};