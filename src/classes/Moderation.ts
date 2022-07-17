// Imports
import { Events, LockdownsData, ModuleSystems, Options } from "../constants";
import { SystemsManager } from "./SystemsManager";
import { GuildSystems } from "./modules/GuildSystems";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { AutoRole } from "./AutoRole";
import { AntiSpam } from "./AntiSpam";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

// Discord.JS
import { Client, IntentsBitField, TextChannel } from "discord.js";
import { TypedEmitter } from "tiny-typed-emitter";

export interface Moderation {
  client: Client;
  options: Options;

  // Classes and Systems
  utils: Utils;
  mutes: MuteManager;
  warns: WarnManager;
  guildSystems: GuildSystems;
  systems: SystemsManager;
  autoRole: AutoRole;
  antiSpam: AntiSpam;
  logger: Logger;
}

/**
 * Main Moderation Class
 *
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {TypedEmitter<Events>}
 */
export class Moderation extends TypedEmitter<Events> {
  /**
   * @param {Client} client Discord.JS Client
   * @param {Options} options Module Options
   *
   * @constructor
   */
  constructor(client: Client, options: Options) {
    super();

    /**
     * Discord Client
     * @type {Client}
     */
    this.client = client;

    /**
     * Module Options
     * @type {Options}
     */
    this.options = options;

    /**
     * MuteManager Class
     * @type {MuteManager}
     */
    this.mutes = new MuteManager(this.client, this.options);

    /**
     * WarnManager Class
     * @type {WarnManager}
     */
    this.warns = new WarnManager(this.client, this.options);

    /**
     * Module Utils
     * @type {Utils}
     */
    this.utils = new Utils(this.client, this.options);

    /**
     * Auto-Role System
     * @type {AutoRole}
     */
    this.autoRole = new AutoRole(this.client, this.options);

    /**
     * Anti-Spam System
     * @type {AntiSpam}
     */
    this.antiSpam = new AntiSpam(this.client, this.options);

    /**
     * Systems Manager
     * @type {SystemsManager}
     */
    this.systems = new SystemsManager(this.client, this.options);

    /**
     * Module Systems
     * @type {SystemsManager}
     */
    this.guildSystems = new GuildSystems(this.client, this.options);

    this._init();
  }

  /**
   * @private
   * @returns {Promise<boolean>}
   */
  private _init(): Promise<boolean> {
    return new Promise((res, rej) => {
      const intents = new IntentsBitField(this.client.options.intents);
      if (
        !intents.has([
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.GuildMessages,
        ])
      ) {
        this.logger.error(
          "Moderation requires the following intents: Guilds, GuildMembers, GuildMessages"
        );

        return process.exit(1);
      }

      this.client.on("ready", () => {
        this.utils.checkMutes();
      });

      this.client.on("guildMemberAdd", async (member) => {
        this.mutes.handleUtilsMute(member);
      });
    });
  }

  /**
   * Method that locks channel.
   *
   * @param {TextChannel} channel Text Channel
   * @param {string} [reason] Reason for lock
   *
   * @returns {Promise<boolean>}
   */
  lockdown(channel: TextChannel, reason?: string): Promise<boolean> {
    return new Promise((res, rej) => {
      if (!reason) reason = "No reason";

      return channel.permissionOverwrites
        .set(
          [
            {
              id: channel.guild.roles.everyone,
              deny: ["SendMessages"],
            },
          ],
          reason
        )
        .then(async () => {
          const data = await this.utils.getGuild(channel.guild);
          data.lockdowns.push({
            id: data.lockdowns.length + 1,
            channelID: channel.id,
            reason: reason,
            date: Date.now(),
          });

          await this.utils.setData(channel.guild, data);
          this.emit("lockdownStart", channel, reason);

          return res(true);
        })
        .catch((err) => {
          return rej(err.message);
        });
    });
  }

  /**
   * Method that unlocks channel.
   *
   * @param {TextChannel} channel Text Channel
   * @returns {Promise<boolean>}
   */
  unlock(channel: TextChannel): Promise<boolean> {
    return new Promise((res, rej) => {
      return channel.permissionOverwrites
        .set([
          {
            id: channel.guild.roles.everyone,
            allow: ["SendMessages"],
          },
        ])
        .then(async () => {
          const data = await this.utils.getGuild(channel.guild);
          const lock_data = data.lockdowns.find(
            (l) => l.channelID === channel.id
          );

          this.emit("lockdownEnd", channel, lock_data.reason);
          return res(true);
        })
        .catch((err) => {
          return rej(err.message);
        });
    });
  }
}

/**
 * @event Moderation#muteCreate
 *
 * @type {Object}
 * @param {number} id ID of the Mute
 * @param {string} type Type of the Mute
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Muted Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 * @param {number} [time] Time of the Mute
 * @param {number} [unmutedAt] Unmuting Date
 */

/**
 * @event Moderation#muteEnd
 *
 * @type {Object}
 * @param {number} id ID of the Mute
 * @param {string} type Type of the Mute
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Muted Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 * @param {number} [time] Time of the Mute
 * @param {number} [unmutedAt] Unmuting Date
 */

/**
 * @event Moderation#warnCreate
 *
 * @type {Object}
 * @param {number} id ID of the Warn
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#warnDelete
 *
 * @type {Object}
 * @param {number} id ID of the Warn
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#warnKick
 *
 * @type {Object}
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#warnMute
 *
 * @type {Object}
 * @param {string} guildID ID of the Guild
 * @param {string} memberID ID of the Warned Member
 * @param {string} moderatorID ID of the Moderator
 * @param {string} channelID ID of the Channel
 * @param {string} reason Reason of the Mute
 */

/**
 * @event Moderation#lockdownStart
 *
 * @type {Object}
 * @param {TextChannel} channel Text Channel
 * @param {string} reason Lockdown Reason
 */

/**
 * @event Moderation#lockdownEnd
 *
 * @type {Object}
 * @param {TextChannel} channel Text Channel
 * @param {string} reason Lockdown Reason
 */

/**
 * Module Options
 * @typedef {Object} Options
 * @prop {string} dbPath Storage Path
 * @prop {string} [locale] Date Locale (default 'en-US')
 * @prop {ModuleSystems} [defaultSystems] Default Systems Values
 */

/**
 * Module Options
 * @typedef {Object} ModuleSystems
 * @prop {boolean} [autoRole] Auto Role System
 * @prop {boolean} [antiSpam] Anti Spam System
 * @prop {boolean} [antiInvite] Anti Invite System
 * @prop {boolean} [antiJoin] Anti Join System
 * @prop {boolean} [antiLink] Anti Link System
 * @prop {boolean} [blacklist] Blacklist System
 * @prop {boolean} [ghostPing] Ghost Ping Detecting System
 */

/**
 * Mute Data
 * @typedef {Object} MutesData
 * @prop {number} id ID of the Mute
 * @prop {string} type Type of the Mute
 * @prop {string} guildID  Guild ID
 * @prop {string} memberID Member ID
 * @prop {string} moderatorID Moderator ID
 * @prop {string} channelID Channel ID
 * @prop {number} time Mute Time
 * @prop {number} unmutedAt Time when Member will be Unmuted
 */

/**
 * Guild Data
 * @typedef {Object} GuildData
 * @prop {string} guildID Guild ID
 * @prop {null | string} muteRole Mute Role ID
 * @prop {null | string} autoRole Auto Role ID
 * @prop {Array<WarnsData>} warns Guild Warns
 * @prop {Array<MutesData>} mutes Guild Mutes
 * @prop {Array<ImmunityUsersData>} ImmunityUsersData Users with Immunity
 * @prop {Array<LockdownsData>} lockdowns Guild Lockdowns
 * @prop {ModuleSystems} systems Guild Systems
 */

/**
 * Warn Data
 * @typedef {Object} WarnsData
 * @prop {number} id ID of the Warn
 * @prop {string} guildID Guild ID
 * @prop {string} memberID Member ID
 * @prop {string} moderatorID Moderator ID
 * @prop {string} channelID Channel ID
 * @prop {number | null} warns Warns Length
 * @prop {string} reason Warn Reason
 */

/**
 * Lockdown Data
 * @typedef {Object} LockdownsData
 * @prop {number} id ID of Lockdown
 * @prop {string} channelID Channel ID
 * @prop {string} reason Lockdown Reason
 * @prop {number} date Lockdown Date
 */

/**
 * Immunity Users Data
 * @typedef {Object} ImmunityUsersData
 * @prop {boolean} status Status of Immunity
 * @prop {string} memberID Member ID
 */

/**
 * Users Map
 * @typedef {Object} UserMap
 * @prop {number} msgCount Count of Sent User Messages
 * @prop {Message} lastMessage Last Message by User
 * @prop {NodeJS.Timeout} timer Timeout
 */

/**
 * Return Object
 * @typedef {Object} ReturnObject
 * @prop {boolean} status Status
 * @prop {string} [message] Error Message
 */

/**
 * * autoRole
 * * antiSpam
 * * antiInvite
 * * antiJoin
 * * antiLink
 * * ghostPing
 *
 * @typedef {string} AvaliableSystems
 */
