import { TemplateRenderer } from './lib';
export declare class TemplateEJS extends TemplateRenderer {
    render(template: string, data: {
        [s: string]: any;
    }): string;
}
