import { TemplateRenderer } from './lib';
const hbs = require('hbs');

export class TemplateHBS extends TemplateRenderer {
    render(template: string, data: { [s: string]: any }): string {
        const templateFunc = hbs.compile(template);
        return templateFunc(data);
    }
}