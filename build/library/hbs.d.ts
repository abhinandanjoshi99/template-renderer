import { TemplateRenderer } from './lib';
export declare class TemplateHBS extends TemplateRenderer {
    render(template: string, data: {
        [s: string]: any;
    }): string;
}
