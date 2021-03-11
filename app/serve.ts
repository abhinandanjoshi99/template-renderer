const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

import { Config, Language } from './configService';

export class Serve {
    config: Config;

    constructor(config: Config, language: Language) {
        this.config = config;

        const port = config.getPort();
        // const address = path.join(this.config.getSrc(), language);
        const address = config.getGeneratedFolder(language);
        const generatedFolderBase = path.basename(this.config.getGeneratedFolder(language));

        if (!fs.existsSync(address)) {
            console.error('We were unable to find the output folder. Please follow the instructions in the README.md file');
            process.exit();
        }

        console.log(`Server Started. Press 'Ctrl + C' to exit. Visit the following on your web browser\n`);

        const dataFilesArr: string[] = fs.readdirSync(address);
        dataFilesArr.forEach(dataFile => {
            console.log(`http://localhost:${port}/${generatedFolderBase}/${dataFile}`);
        });

        app.use(express.static(path.dirname(address)));
        app.listen(port);
    }
}