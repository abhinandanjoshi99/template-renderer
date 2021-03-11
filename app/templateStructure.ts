const fs = require('fs');
const path = require('path');

import { Config } from "./configService";

export class TemplateStructure {
    config: Config;

    requiredFolderStructure;

    constructor(config: Config) {
        this.config = config;
        this.requiredFolderStructure = this.config.getTemplateFolderStructure();
    }

    init = () => {
        this.config.getLanguages().forEach(language => {
            // Create folder for language
            const langFolderPath: string = path.join(this.config.getSrc(), language);;

            if (!fs.existsSync(langFolderPath)) {
                fs.mkdirSync(langFolderPath, { recursive: true });
                console.log(`Created ${language}/`);
            }

            for (const folder in this.requiredFolderStructure) {
                const fullFolderPath: string = path.join(langFolderPath, folder);

                // Create folder
                if (!fs.existsSync(fullFolderPath)) {
                    fs.mkdirSync(fullFolderPath, { recursive: true });
                    console.log(`Created ${folder}/`);
                }

                // Create files
                this.requiredFolderStructure[folder].forEach(file => {
                    const filename: string = `${file}.${this.config.getTemplateLanguage()}`;
                    const fullFilePath: string = path.join(fullFolderPath, `${filename}`);
                    if (!fs.existsSync(fullFilePath)) {
                        fs.writeFileSync(fullFilePath, '');
                        console.log(`Created ${filename}`);
                    }
                });
            }

        });

        console.log('\nThe template has been initialised!');
    }

    validate = () => {
        this.config.getLanguages().forEach(language => {
            // Create folder for language
            const langFolderPath: string = path.join(this.config.getSrc(), language);;

            if (!fs.existsSync(langFolderPath)) {
                console.error(`The folder '${language}' is missing in the template folder - ${this.config.getSrc()}`);
                process.exit();
            }

            for (const folder in this.requiredFolderStructure) {
                const fullFolderPath: string = path.join(langFolderPath, folder);
                // Validate folder
                if (!fs.existsSync(fullFolderPath)) {
                    console.error(`The folder '${folder}' is missing in template folder - ${langFolderPath}`);
                    process.exit();
                }

                // Validate file structure
                this.requiredFolderStructure[folder].forEach(file => {
                    const filename: string = `${file}.${this.config.getTemplateLanguage()}`;
                    const fullFilePath: string = path.join(fullFolderPath, filename);
                    if (!fs.existsSync(fullFilePath)) {
                        console.error(`The file '${filename}' is missing in template folder - ${fullFolderPath}`);
                        process.exit();
                    }
                });
            }
        });


        console.log('\nCongratulations! The template structure looks good!');
    }

}