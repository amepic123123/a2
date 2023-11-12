const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    Logger.discordMessage("Client ready, logged in as " + this.discord.client.user.tag);
    this.discord.client.user.setPresence({
      activities: [{ name: `/help | by @duckysolucky` }],
    });

    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return Logger.errorMessage(`Channel "Guild" not found!`);
    }

    channel.send({
      embeds: [
        new EmbedBuilder().setAuthor({ name: `Chat Bridge is Online` }).setColor(config.discord.other.colors.success),
      ],
    });
  }

  async onClose() {
    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return Logger.errorMessage(`Channel "Guild" not found!`);
    }

    await channel.send({
      embeds: [
        new EmbedBuilder().setAuthor({ name: `Chat Bridge is Offline` }).setColor(config.discord.other.colors.fail),
      ],
    });
  }

  async getChannel(type) {
    if (typeof type !== "string" || type === undefined) {
      return Logger.errorMessage(`Channel type must be a string!`);
    }

    switch (type.replace(/§[0-9a-fk-or]/g, "").trim()) {
      case "Guild":
        return this.discord.client.channels.cache.get(config.discord.channels.guildChatChannel);
      case "Officer":
        return this.discord.client.channels.cache.get(config.discord.channels.officerChannel);
      case "Logger":
        return this.discord.client.channels.cache.get(config.discord.channels.loggingChannel);
      default:
        return this.discord.client.channels.cache.get(config.discord.channels.debugChannel);
    }
  }
}

module.exports = StateHandler;
