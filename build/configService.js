"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const isValid = require('is-valid-path');
const DEFAULT_PORT = '8000';
const INTERNAL_CONFIG_FILEPATH = path.join(__dirname, '..', 'config', 'config.json');
const TEMPLATE_FOLDER_STRUCTURE_FILEPATH = path.join(__dirname, '..', 'config', 'folderStructure.json');
var Language;
(function (Language) {
    Language["en"] = "en";
    Language["hi"] = "hi";
    Language["ka"] = "ka";
})(Language = exports.Language || (exports.Language = {}));
class Config {
    constructor(configFilePath) {
        this.getData = () => this.data;
        this.getSrc = () => this.src;
        this.getPort = () => this.port || DEFAULT_PORT;
        this.getTemplateLanguage = () => this.templateLanguage;
        this.getLanguages = () => this.languages;
        this.getGeneratedFolder = (language) => path.join(this.src, language, this.internalConfig['generated_folder']);
        this.getPagesFolder = (language) => path.join(this.src, language, this.internalConfig['pages_folder']);
        this.getTemplateFolderStructure = () => this.templateFolderStructure;
        this.getEndpoint = () => this.fileListEndpoint;
        if (isValid(configFilePath) !== true) {
            console.log("Enter Valid File Address!!");
            process.exit();
        }
        try {
            const configContents = JSON.parse(fs.readFileSync(configFilePath));
            this.internalConfig = JSON.parse(fs.readFileSync(INTERNAL_CONFIG_FILEPATH));
            const templateFolderStructure = JSON.parse(fs.readFileSync(TEMPLATE_FOLDER_STRUCTURE_FILEPATH));
            this.data = configContents['data'];
            this.src = configContents['src'];
            this.templateLanguage = configContents['template-language'];
            this.port = configContents['port'];
            this.languages = configContents['languages'] || ['en'];
            this.fileListEndpoint = this.internalConfig['file_list_endpoint'];
            this.templateFolderStructure = templateFolderStructure;
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.error("We were unable to find the config file. Please check the path and try again");
                process.exit();
            }
            else {
                console.error("The configuration file is not a valid JSON document");
                process.exit();
            }
        }
        if (this.data === undefined) {
            console.error("The 'data' key is missing in the configuration.");
            process.exit();
        }
        if (this.src === undefined) {
            console.error("The 'src' key is missing in the configuration.");
            process.exit();
        }
        if (this.templateLanguage === undefined) {
            console.error("The 'lang' key is missing in the configuration.");
            process.exit();
        }
    }
}
exports.Config = Config;
