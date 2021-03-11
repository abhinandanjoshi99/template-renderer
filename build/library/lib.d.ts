export declare abstract class TemplateRenderer {
    abstract render(template: string, data: {
        [s: string]: any;
    }): string;
    getFileMap(dataFolderPath: string, templateFolderPath: string, lang: string): object;
    createGeneratedFolder(generatedFolderPath: string): void;
    saveToGenerated(renderedContent: string, dataFilename: string, generatedPath: string): void;
}
export { TemplateEJS as ejs } from './ejs';
export { TemplateHBS as hbs } from './hbs';
