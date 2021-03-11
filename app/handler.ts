const fs = require('fs');
const path = require('path');

import * as TemplateClasses from './library/lib';
import { Config, Language } from './configService';

export class Render {
    configObj: Config;
    language: Language

    constructor(configObj: Config, language: Language) {
        this.configObj = configObj;
        this.language = language;
        this.generate(configObj);
    }

    generate = (configObj: Config) => {

        const getNormalizedPath = (filePath: string) => {
            return path.normalize(filePath);
        }

        try {
            const dataFolderPath: string = getNormalizedPath(configObj.getData());
            const generatedFolderPath: string = this.configObj.getGeneratedFolder(this.language);
            const lang: string = configObj.getTemplateLanguage().toLowerCase().trim();

            const templateObj = new TemplateClasses[lang]();

            const templateFolderPath: string = this.configObj.getPagesFolder(this.language);
            const filenameMap: object = templateObj.getFileMap(dataFolderPath, templateFolderPath, lang);
            templateObj.createGeneratedFolder(generatedFolderPath);

            if (Object.keys(filenameMap).length === 0) {

                console.log('\nNo files were created.');
                process.exit(1);
            }

            for (const templateFilename in filenameMap) {

                const templateFilePath: string = path.join(templateFolderPath, templateFilename);
                const templateFileContent: string = fs.readFileSync(templateFilePath, 'utf-8');

                filenameMap[templateFilename].forEach(dataFilename => {
                    const dataFilePath: string = path.join(dataFolderPath, dataFilename);
                    const dataFileContent: string = fs.readFileSync(dataFilePath, 'utf-8');
                    const renderedContent: string = templateObj.render(templateFileContent, JSON.parse(dataFileContent));

                    templateObj.saveToGenerated(renderedContent, dataFilename, generatedFolderPath);
                });
            }

            console.log('\nFiles created at: ' + this.configObj.getGeneratedFolder(this.language));

        } catch (err) {

            console.log()
            if (err instanceof TypeError) {
                console.log('Language = \'' + configObj.getTemplateLanguage() + '\' isn\'t implemented yet.');

            } else if (err instanceof SyntaxError) {
                console.log(err.message + '. Please make sure the data files aren\'t corrupted.');

            } else {
                console.log(err.message);
            }
        }
    }
}

