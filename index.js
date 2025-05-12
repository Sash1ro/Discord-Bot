require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron')
const { REST, Routes } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType,
    PresenceUpdateStatus,
    Events,
    EmbedBuilder
} = require('discord.js');

const deployCommands = async () => {
    try {
        const commands = [];

        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`WARNING: The command at ${file} is missing a required 'data' or 'execute' property.`);
            }
        }

        const rest = new REST().setToken(process.env.BOT_TOKEN);

        console.log(`Started refreshing application slash commands globally.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded all commands!');
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates // nécessaire pour écouter les salons vocaux
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`The Command ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Deploy commands
    await deployCommands();
    console.log(`Commands deployed globally.`);

    const statusType = process.env.BOT_STATUS || 'online';
    const activityType = process.env.ACTIVITY_TYPE || 'PLAYING';
    const activityName = process.env.ACTIVITY_NAME || 'Discord';

    const activityTypeMap = {
        'PLAYING': ActivityType.Playing,
        'WATCHING': ActivityType.Watching,
        'LISTENING': ActivityType.Listening,
        'STREAMING': ActivityType.Streaming,
        'COMPETING': ActivityType.Competing
    };

    const statusMap = {
        'online': PresenceUpdateStatus.Online,
        'idle': PresenceUpdateStatus.Idle,
        'dnd': PresenceUpdateStatus.DoNotDisturb,
        'invisible': PresenceUpdateStatus.Invisible
    };

    client.user.setPresence({
        status: statusMap[statusType],
        activities: [{
            name: activityName,
            type: activityTypeMap[activityType]
        }]
    });

    console.log(`Bot status set to: ${statusType}`);
    console.log(`Activity set to: ${activityType} ${activityName}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

});


client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!oldState.channel && newState.channel && !newState.member.user.bot) {
        const channel = newState.channel;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
        } catch (error) {
            console.error('Connexion échouée :', error);
            connection.destroy();
            return;
        }

        const player = createAudioPlayer();
        const audioPath = path.join(__dirname, 'bersac.mp3');
        const resource = createAudioResource(fs.createReadStream(audioPath));
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy(); // Quitter après la fin du son
        });

        player.on('error', error => {
            console.error('Erreur audio :', error);
            connection.destroy();
        });
    }
});

imageLinks = [
    "https://i.imgur.com/rLZDaHo.png",
    "https://i.imgur.com/HBOejro_d.png",
    "https://i.imgur.com/sULofJ9_d.png",
    "https://i.imgur.com/rnLEvMa.gif",
    "https://i.imgur.com/TcPg7yA.gif"
]

async function sendDailyMessage() {
    const Day = new EmbedBuilder()
        .setTitle("Bonjour !")
        .setImage(imageLinks[Math.floor(Math.random() * imageLinks.length)])
        .setColor([139, 30, 63])
    try {
        const channel = await client.channels.fetch(process.env.CH_ID);
        if (channel) {
            channel.send({ embeds: [Day] });
        } else {
            console.log('Canal non trouvé');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du canal :', error);
    }
}

cron.schedule('0 10 * * *', () => {
    sendDailyMessage();
});

client.login(process.env.BOT_TOKEN);
