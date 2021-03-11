import { Config } from "./configService";
export declare class Fetch {
    configObj: Config;
    endPoint: string;
    destinationDir: string;
    constructor(configObj: Config);
    initDestinationDir: () => Promise<unknown>;
    getFilesToDownload: () => Promise<unknown>;
    downloadFiles: (filesToDownload: any) => void;
}
