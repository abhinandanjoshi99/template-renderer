import { Config, Language } from './configService';
export declare class Render {
    configObj: Config;
    language: Language;
    constructor(configObj: Config, language: Language);
    generate: (configObj: Config) => void;
}
