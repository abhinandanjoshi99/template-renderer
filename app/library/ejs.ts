import { TemplateRenderer } from './lib';
const ejs = require('ejs');

export class TemplateEJS extends TemplateRenderer {
    render(template: string, data: { [s: string]: any }): string {
        return ejs.render(template, data);
    }
}