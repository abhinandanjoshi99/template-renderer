import { Config } from "./configService";
export declare class Janitor {
    config: Config;
    constructor(config: Config);
    cleanUpGeneratedFolder: () => void;
    cleanUpDataFolder: () => void;
    deleteFolderRecursive: (path: string) => void;
}
