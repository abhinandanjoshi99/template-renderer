"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
class TemplateStructure {
    constructor(config) {
        this.init = () => {
            this.config.getLanguages().forEach(language => {
                // Create folder for language
                const langFolderPath = path.join(this.config.getSrc(), language);
                ;
                if (!fs.existsSync(langFolderPath)) {
                    fs.mkdirSync(langFolderPath, { recursive: true });
                    console.log(`Created ${language}/`);
                }
                for (const folder in this.requiredFolderStructure) {
                    const fullFolderPath = path.join(langFolderPath, folder);
                    // Create folder
                    if (!fs.existsSync(fullFolderPath)) {
                        fs.mkdirSync(fullFolderPath, { recursive: true });
                        console.log(`Created ${folder}/`);
                    }
                    // Create files
                    this.requiredFolderStructure[folder].forEach(file => {
                        const filename = `${file}.${this.config.getTemplateLanguage()}`;
                        const fullFilePath = path.join(fullFolderPath, `${filename}`);
                        if (!fs.existsSync(fullFilePath)) {
                            fs.writeFileSync(fullFilePath, '');
                            console.log(`Created ${filename}`);
                        }
                    });
                }
            });
            console.log('\nThe template has been initialised!');
        };
        this.validate = () => {
            this.config.getLanguages().forEach(language => {
                // Create folder for language
                const langFolderPath = path.join(this.config.getSrc(), language);
                ;
                if (!fs.existsSync(langFolderPath)) {
                    console.error(`The folder '${language}' is missing in the template folder - ${this.config.getSrc()}`);
                    process.exit();
                }
                for (const folder in this.requiredFolderStructure) {
                    const fullFolderPath = path.join(langFolderPath, folder);
                    // Validate folder
                    if (!fs.existsSync(fullFolderPath)) {
                        console.error(`The folder '${folder}' is missing in template folder - ${langFolderPath}`);
                        process.exit();
                    }
                    // Validate file structure
                    this.requiredFolderStructure[folder].forEach(file => {
                        const filename = `${file}.${this.config.getTemplateLanguage()}`;
                        const fullFilePath = path.join(fullFolderPath, filename);
                        if (!fs.existsSync(fullFilePath)) {
                            console.error(`The file '${filename}' is missing in template folder - ${fullFolderPath}`);
                            process.exit();
                        }
                    });
                }
            });
            console.log('\nCongratulations! The template structure looks good!');
        };
        this.config = config;
        this.requiredFolderStructure = this.config.getTemplateFolderStructure();
    }
}
exports.TemplateStructure = TemplateStructure;
