import { Config } from "./configService";
export declare class TemplateStructure {
    config: Config;
    requiredFolderStructure: any;
    constructor(config: Config);
    init: () => void;
    validate: () => void;
}
