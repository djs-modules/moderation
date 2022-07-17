import colors from "colors";

/**
 * Class that Create Logs in the Console.
 *
 * @class
 * @classdesc Logger Class
 */
export class Logger {
  public tag: string;

  constructor() {
    this.tag = "[Moderation]";
  }

  /**
   * Logging Something
   *
   * @param {string} message Message to Log
   * @returns {void}
   */
  log(message: string): void {
    const tag = colors.magenta(this.tag);

    return console.log(`${tag}: ${message}`);
  }

  /**
   * Logging Something
   *
   * @param {string} message Message to Log
   * @returns {void}
   */
  warn(message: string): void {
    const tag = colors.magenta(this.tag);
    const msg = colors.yellow(message);

    return console.log(`${tag}: ${msg}`);
  }

  /**
   * Logging Something
   *
   * @param {string} message Message to Log
   * @returns {void}
   */
  error(message: string): void {
    const tag = colors.magenta(this.tag);
    const msg = colors.red(message);

    return console.log(`${tag}: ${msg}`);
  }
}
