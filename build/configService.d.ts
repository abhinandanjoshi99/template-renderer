export declare enum Language {
    en = "en",
    hi = "hi",
    ka = "ka"
}
export declare class Config {
    private internalConfig;
    private data;
    private src;
    private templateLanguage;
    private port;
    private languages;
    private fileListEndpoint;
    private templateFolderStructure;
    constructor(configFilePath: string);
    getData: () => string;
    getSrc: () => string;
    getPort: () => number | "8000";
    getTemplateLanguage: () => string;
    getLanguages: () => Language[];
    getGeneratedFolder: (language: Language) => any;
    getPagesFolder: (language: Language) => any;
    getTemplateFolderStructure: () => string;
    getEndpoint: () => string;
}
