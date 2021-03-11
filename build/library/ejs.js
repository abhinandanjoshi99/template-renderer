"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const ejs = require('ejs');
class TemplateEJS extends lib_1.TemplateRenderer {
    render(template, data) {
        return ejs.render(template, data);
    }
}
exports.TemplateEJS = TemplateEJS;
