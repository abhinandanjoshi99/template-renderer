"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fse = __importStar(require("fs-extra"));
class TemplateRenderer {
    //returns an object with key as the template filename and value as the array of corresponding data files
    getFileMap(dataFolderPath, templateFolderPath, lang) {
        let templateFilesArr = [];
        let dataFilesArr = [];
        const filesNotMapped = [];
        const templatesNotMapped = [];
        if (fs.existsSync(dataFolderPath)) {
            dataFilesArr = fs.readdirSync(dataFolderPath);
            if (dataFilesArr.length === 0) {
                throw new Error(`No data files exist at ${dataFolderPath}`);
            }
        }
        else {
            throw new Error(`'${path.parse(dataFolderPath).base}' folder does not exist at ${path.parse(dataFolderPath).dir}`);
        }
        if (fs.existsSync(templateFolderPath)) {
            templateFilesArr = fs.readdirSync(templateFolderPath);
            if (templateFilesArr.length === 0) {
                throw new Error(`No template files exist at ${templateFolderPath}`);
            }
        }
        else {
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
            }
            catch (_a) {
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
    createGeneratedFolder(generatedFolderPath) {
        try {
            if (fs.existsSync(generatedFolderPath)) {
                fse.emptyDirSync(generatedFolderPath);
            }
            else {
                fse.ensureDirSync(generatedFolderPath);
            }
        }
        catch (err) {
            throw new Error('Cannot create generated folder: ' + err.message);
        }
    }
    // saves the rendered html content to the generated folder sa 'dataFilename.html'
    saveToGenerated(renderedContent, dataFilename, generatedPath) {
        dataFilename = path.parse(dataFilename).name;
        const generatedFilename = dataFilename + '.html';
        try {
            fs.writeFileSync(path.join(generatedPath, generatedFilename), renderedContent);
        }
        catch (err) {
            throw new Error(`Unable to write ${generatedFilename} to ${generatedPath}: ` + err.message);
        }
    }
}
exports.TemplateRenderer = TemplateRenderer;
//exports EJS, HBS to the main handler
var ejs_1 = require("./ejs");
exports.ejs = ejs_1.TemplateEJS;
var hbs_1 = require("./hbs");
exports.hbs = hbs_1.TemplateHBS;
