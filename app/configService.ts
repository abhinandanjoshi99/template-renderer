const fs = require('fs');
const path = require('path');
const isValid = require('is-valid-path');

const DEFAULT_PORT = '8000';
const INTERNAL_CONFIG_FILEPATH = path.join(__dirname, '..', 'config', 'config.json');
const TEMPLATE_FOLDER_STRUCTURE_FILEPATH = path.join(__dirname, '..', 'config', 'folderStructure.json');

export enum Language {
    en = 'en',
    hi = 'hi',
    ka = 'ka'
}

export class Config {
    private internalConfig;

    private data: string;
    private src: string;
    private templateLanguage: string;
    private port: number;
    private languages: Language[];

    private fileListEndpoint: string;
    private templateFolderStructure: string;

    constructor (configFilePath: string) {

        if (isValid(configFilePath) !== true)    {
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

        }   catch (err) {
            if (err.code === 'ENOENT')  {
                console.error("We were unable to find the config file. Please check the path and try again");
                process.exit();
            } else {
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

    getData = () => this.data;
    getSrc  = () => this.src;
    getPort = () => this.port || DEFAULT_PORT;
    getTemplateLanguage = () => this.templateLanguage;
    getLanguages = () => this.languages;

    getGeneratedFolder = (language: Language) => path.join(this.src, language, this.internalConfig['generated_folder']);
    getPagesFolder = (language: Language) => path.join(this.src, language, this.internalConfig['pages_folder']);
    getTemplateFolderStructure = () => this.templateFolderStructure;
    getEndpoint = () => this.fileListEndpoint;
}
