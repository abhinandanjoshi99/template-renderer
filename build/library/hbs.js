"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const hbs = require('hbs');
class TemplateHBS extends lib_1.TemplateRenderer {
    render(template, data) {
        const templateFunc = hbs.compile(template);
        return templateFunc(data);
    }
}
exports.TemplateHBS = TemplateHBS;
