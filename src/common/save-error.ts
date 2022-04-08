import { Logger } from './logger';
import { join } from 'path';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import moment from 'moment';
import { Environment } from '.';

export async function SaveError (err: Record<string, any>): Promise<void> {
  if (Environment.getNodeEnv() === 'test') {
    return;
  }

  Logger.error('=========================================');
  try {
    Logger.danger(`MESSAGE: ${err.message ?? ''}`);
    if (err.stack) {
      Logger.warn('STACKTRACE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      Logger.warn(err.stack);
      Logger.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }

    const errorMessage = `
        =========================================
        MESSAGE: ${err.message ?? ''}
        STACKTRACE:
        ${err.stack ?? ''}
        =========================================
    `;
    const filename = moment().format('DD-MMM-YYYY') + '.txt';
    if (existsSync(join('./error-log', filename))) {
      appendFileSync(join('./error-log', filename), errorMessage + '\n\n\n');
    } else {
      writeFileSync(join('./error-log', filename), errorMessage + '\n\n\n', { flag: 'w' });
    }
    Logger.success('ERROR SAVED');
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(err.message);
    }
  }
  Logger.error('=========================================');
}
