"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configService_1 = require("./configService");
const fs = require('fs');
const Path = require('path');
class Janitor {
    constructor(config) {
        this.cleanUpGeneratedFolder = () => {
            Object.keys(configService_1.Language).forEach((language) => {
                this.deleteFolderRecursive(this.config.getGeneratedFolder(language));
            });
            console.log('Generated folder has been cleaned up');
        };
        this.cleanUpDataFolder = () => {
            this.deleteFolderRecursive(this.config.getData());
            console.log('Data folder has been cleaned up');
        };
        this.deleteFolderRecursive = function (path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach((file, index) => {
                    const curPath = Path.join(path, file);
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        this.deleteFolderRecursive(curPath);
                    }
                    else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
        this.config = config;
        this.cleanUpGeneratedFolder();
        this.cleanUpDataFolder();
    }
}
exports.Janitor = Janitor;
