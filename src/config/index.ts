import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface Configurations {
  port: number;
  redis: {
    enable: boolean;
    host: string;
    port: number;
  };
}

type Profile = 'default' | 'alpha' | 'sandbox' | 'beta' | 'production';

const profile: Profile = (process.env.profile as Profile) || 'default';

export let config: Configurations;

try {
  console.log(`profile: ${profile}`);
  config = yaml.safeLoad(
    fs.readFileSync(path.resolve(`config/config.${profile}.yaml`), 'utf-8'),
  ) as Configurations;
} catch (e) {
  throw new Error(e);
}

export default config;
