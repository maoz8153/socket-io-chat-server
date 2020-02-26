import { resolve } from "path"
import { config } from "dotenv"

export interface IConfig {
    NODE_ENV: string;
    NODE_PORT: number;
    DB_URI: string;
    DB_NAME: string;
}

export class ConfigService {

    environment: IConfig;

    constructor(env?: string) {
        this.environment = config({ path: resolve(__dirname, `../../${env || '.env'}`) }).parsed;
    }

}