/* eslint no-console: [ "off" ] */

import { isString } from './type-checker';

export const COLOR_PREFIX = {
  // output control
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',

  // font color (foreground)
  FG_BLACK: '\x1b[30m',
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  FG_YELLOW: '\x1b[33m',
  FG_BLUE: '\x1b[34m',
  FG_MAGENTA: '\x1b[35m',
  FG_CYAN: '\x1b[36m',
  FG_WHITE: '\x1b[37m',

  // background color
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',

  TextRed: '\x1b[31m%s\x1b[0m',
  TextGreen: '\x1b[32m%s\x1b[0m',
  TextYellow: '\x1b[33m%s\x1b[0m',
  TextBlue: '\x1b[34m%s\x1b[0m',
  TextMagenta: '\x1b[35m%s\x1b[0m',
  TextCyan: '\x1b[36m%s\x1b[0m',

  TextError: '\x1b[30m\x1b[41m%s\x1b[0m',

  BgGreen: '\x1b[30m\x1b[42m%s\x1b[0m',
  BgBlue: '\x1b[30m\x1b[44m%s\x1b[0m',
  BgYellow: '\x1b[30m\x1b[43m%s\x1b[0m',
  BgMagenta: '\x1b[30m\x1b[45m%s\x1b[0m',
  BgCyan: '\x1b[30m\x1b[46m%s\x1b[0m',
  BgWhite: '\x1b[30m\x1b[47m%s\x1b[0m'
};

export type LogLevel = 'info' | 'success' | 'warn' | 'danger' | 'error';

export class Logger {
  static info (log: any): void {
    console.log(COLOR_PREFIX.TextBlue, isString(log) ? log : JSON.stringify(log));
  }

  static success (log: any): void {
    console.log(COLOR_PREFIX.TextGreen, isString(log) ? log : JSON.stringify(log));
  }

  static warn (log: any): void {
    console.log(COLOR_PREFIX.TextYellow, isString(log) ? log : JSON.stringify(log));
  }

  static danger (log: any): void {
    console.log(COLOR_PREFIX.TextRed, isString(log) ? log : JSON.stringify(log));
  }

  static error (log: any): void {
    console.log(COLOR_PREFIX.TextError, isString(log) ? log : JSON.stringify(log));
  }
}
