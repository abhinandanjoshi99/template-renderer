import { Config, Language } from "./configService";
const fs = require('fs');
const Path = require('path');

export class Janitor {
    config: Config;

    constructor (config: Config) {
        this.config = config;

        this.cleanUpGeneratedFolder();
        this.cleanUpDataFolder();
    }

    cleanUpGeneratedFolder = () => {
        Object.keys(Language).forEach((language: Language) => {
            this.deleteFolderRecursive(this.config.getGeneratedFolder(language));
        });

        console.log('Generated folder has been cleaned up');
    }

    cleanUpDataFolder = () => {
        this.deleteFolderRecursive(this.config.getData());
        console.log('Data folder has been cleaned up');
    }

    deleteFolderRecursive = function(path: string) {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach((file: string, index: number) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              this.deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
    };
}