import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';


export abstract class TemplateRenderer {

    //render method defined by subclasses
    public abstract render(template: string, data: { [s: string]: any }): string

    //returns an object with key as the template filename and value as the array of corresponding data files
    public getFileMap(dataFolderPath: string, templateFolderPath: string, lang: string): object {
        let templateFilesArr = [];
        let dataFilesArr = [];
        const filesNotMapped = [];
        const templatesNotMapped = [];

        if (fs.existsSync(dataFolderPath)) {
            dataFilesArr = fs.readdirSync(dataFolderPath);
            if (dataFilesArr.length === 0) {
                throw new Error(`No data files exist at ${dataFolderPath}`);
            }
        } else {
            throw new Error(`'${path.parse(dataFolderPath).base}' folder does not exist at ${path.parse(dataFolderPath).dir}`);
        }

        if (fs.existsSync(templateFolderPath)) {
            templateFilesArr = fs.readdirSync(templateFolderPath);
            if (templateFilesArr.length === 0) {
                throw new Error(`No template files exist at ${templateFolderPath}`);
            }
        } else {
            throw new Error(`'${path.parse(templateFolderPath).base}' folder does not exist at ${path.parse(templateFolderPath).dir}`);
        }

        const fileMap = {};

        templateFilesArr.forEach((templateFile) => {
            fileMap[templateFile] = [];
        });

        for (let dataFile of dataFilesArr) {
            try {
                const key = dataFile.split('-')[0] + '.' + lang;
                fileMap[key].push(dataFile);
            } catch {
                filesNotMapped.push(dataFile);
            }
        }

        if (filesNotMapped.length > 0) {
            console.log('\nThe following data files did not match any template: ');
            filesNotMapped.forEach((dataFile) => {
                console.log('- ' + dataFile);
            });
        }

        Object.keys(fileMap).forEach((template) => {
            if (fileMap[template].length === 0) {
                templatesNotMapped.push(template);
                delete fileMap[template];
            }
        });

        if (templatesNotMapped.length > 0) {
            console.log('\nThe following template files did not find any matching data file: ');
            templatesNotMapped.forEach((template) => {
                console.log('- ' + template);
            });
        }
        return fileMap;
    }

    //clears contents of generated folder if it exists, else it creates the generated folder
    public createGeneratedFolder(generatedFolderPath: string): void {
        try {
            if (fs.existsSync(generatedFolderPath)) {
                fse.emptyDirSync(generatedFolderPath);
            } else {
                fse.ensureDirSync(generatedFolderPath);
            }
        } catch (err) {
            throw new Error('Cannot create generated folder: ' + err.message);
        }
    }


    // saves the rendered html content to the generated folder sa 'dataFilename.html'
    public saveToGenerated(renderedContent: string, dataFilename: string, generatedPath: string) {
        dataFilename = path.parse(dataFilename).name;
        const generatedFilename: string = dataFilename + '.html';
        try {
            fs.writeFileSync(path.join(generatedPath, generatedFilename), renderedContent);
        } catch (err) {
            throw new Error(`Unable to write ${generatedFilename} to ${generatedPath}: ` + err.message);
        }
    }
}

//exports EJS, HBS to the main handler
export { TemplateEJS as ejs } from './ejs';
export { TemplateHBS as hbs } from './hbs';