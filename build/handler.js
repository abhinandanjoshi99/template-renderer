"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const TemplateClasses = __importStar(require("./library/lib"));
class Render {
    constructor(configObj, language) {
        this.generate = (configObj) => {
            const getNormalizedPath = (filePath) => {
                return path.normalize(filePath);
            };
            try {
                const dataFolderPath = getNormalizedPath(configObj.getData());
                const generatedFolderPath = this.configObj.getGeneratedFolder(this.language);
                const lang = configObj.getTemplateLanguage().toLowerCase().trim();
                const templateObj = new TemplateClasses[lang]();
                const templateFolderPath = this.configObj.getPagesFolder(this.language);
                const filenameMap = templateObj.getFileMap(dataFolderPath, templateFolderPath, lang);
                templateObj.createGeneratedFolder(generatedFolderPath);
                if (Object.keys(filenameMap).length === 0) {
                    console.log('\nNo files were created.');
                    process.exit(1);
                }
                for (const templateFilename in filenameMap) {
                    const templateFilePath = path.join(templateFolderPath, templateFilename);
                    const templateFileContent = fs.readFileSync(templateFilePath, 'utf-8');
                    filenameMap[templateFilename].forEach(dataFilename => {
                        const dataFilePath = path.join(dataFolderPath, dataFilename);
                        const dataFileContent = fs.readFileSync(dataFilePath, 'utf-8');
                        const renderedContent = templateObj.render(templateFileContent, JSON.parse(dataFileContent));
                        templateObj.saveToGenerated(renderedContent, dataFilename, generatedFolderPath);
                    });
                }
                console.log('\nFiles created at: ' + this.configObj.getGeneratedFolder(this.language));
            }
            catch (err) {
                console.log();
                if (err instanceof TypeError) {
                    console.log('Language = \'' + configObj.getTemplateLanguage() + '\' isn\'t implemented yet.');
                }
                else if (err instanceof SyntaxError) {
                    console.log(err.message + '. Please make sure the data files aren\'t corrupted.');
                }
                else {
                    console.log(err.message);
                }
            }
        };
        this.configObj = configObj;
        this.language = language;
        this.generate(configObj);
    }
}
exports.Render = Render;
