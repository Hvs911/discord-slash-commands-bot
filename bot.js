const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

// Create the slash command
const command = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option => option
        .setName('source')
        .setDescription('The source of the song')
        .setRequired(true)
        .addChoice('YouTube', 'youtube')
        .addChoice('Spotify', 'spotify')
        .addChoice('SoundCloud', 'soundcloud')
        .addSubcommand(subcommand => subcommand
            .setName('playlist')
            .setDescription('Play a playlist')
            .addStringOption(option => option
                .setName('url')
                .setDescription('The URL of the playlist')
                .setRequired(true)
            )
        )
    );

// Handle the interaction
const playCommandHandler = async (interaction = new CommandInteraction()) => {
    const source = interaction.options.getString('source');
    switch (source) {
        case 'youtube':
            // Play a song from YouTube
            break;
        case 'spotify':
            // Play a song from Spotify
            break;
        case 'soundcloud':
            // Play a song from SoundCloud
            break;
    }

    if (interaction.options.getSubcommand() === 'playlist') {
        const url = interaction.options.getSubcommand().options.getString('url');
        // Play a playlist from the given URL
    }
};

module.exports = {
    data: command,
    execute: playCommandHandler,
};