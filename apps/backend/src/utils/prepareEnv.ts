import { APP_CONFIG } from '@/configs/app';
import { getObjectKeys } from 'badlib';
import { writeFile } from 'fs-extra';

export const prepareEnv = async () => {
  const config = getObjectKeys(APP_CONFIG);

  const env: string[] = [];

  for (const key of config) {
    if (!key.includes('POSTGRES')) continue;
    env.push(`${key}=${APP_CONFIG[key]}`);
  }

  await writeFile('.env', env.join('\n'));
};

prepareEnv();
