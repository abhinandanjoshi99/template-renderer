"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configService_1 = require("./configService");
const dataFetch_1 = require("./dataFetch");
const handler_1 = require("./handler");
const serve_1 = require("./serve");
const clean_1 = require("./clean");
const templateStructure_1 = require("./templateStructure");
const args = require('args-parser')(process.argv);
var RenderCommand;
(function (RenderCommand) {
    RenderCommand["init"] = "init";
    RenderCommand["validate"] = "validate";
    RenderCommand["fetch"] = "fetch";
    RenderCommand["generate"] = "generate";
    RenderCommand["serve"] = "serve";
    RenderCommand["clean"] = "clean";
})(RenderCommand || (RenderCommand = {}));
class Renderer {
    constructor() {
        this.getLanguage = () => {
            const LANG = 'lang';
            const selectedLanguage = configService_1.Language.en;
            if (args[LANG]) {
                for (const arg in args) {
                    if (Object.keys(configService_1.Language).includes(arg)) {
                        return arg;
                    }
                }
            }
            return selectedLanguage;
        };
        this.main();
    }
    /**
     * Display the instructions
     */
    displayHelp() {
        const help = {
            "-h": "This flag prints these instructions",
            "-c": "This flag is used to pass the config file.",
            "init": "Initialise the template folder structure",
            "fetch": "Fetches data from our server",
            "generate": "Combines the template files with the data to generate HTML files",
            "serve": "Starts a static server to view the generated HTML files",
            "clean": "Cleans up the generated and data folders",
            "validate": "Validate the template folder structure"
        };
        console.log('\nUsage Instructions\n');
        for (let cmd in help) {
            const explanation = help[cmd];
            // Improve readability of output
            const MAX_CMD_LEN = 10;
            const spaces = Array(MAX_CMD_LEN - cmd.length).join(' ');
            console.log(cmd, spaces, explanation);
        }
    }
    /**
     * Extract the config file from the command line
     */
    getFilePath() {
        for (const arg in args) {
            if (arg.substring(arg.length - 5, arg.length) === '.json') {
                return arg;
            }
        }
        console.error('Please pass the configuration file');
        process.exit();
    }
    /**
     * Extract the command
     */
    getCommand() {
        const validCommands = Object.keys(RenderCommand);
        for (const arg in args) {
            if (validCommands.includes(arg)) {
                return arg;
            }
        }
        console.error('Error: We have not received a valid command');
        this.displayHelp();
        process.exit();
    }
    /**
     * Execute the main logic
     */
    main() {
        return new Promise((resolve, reject) => {
            // Check and display help
            if (args.h) {
                return resolve(this.displayHelp());
            }
            // If we have not received the config file, throw error
            if (!args.c) {
                console.error('We have not received the configuration file. Use -h for help or read the README.md file for complete instructions');
                process.exit();
            }
            // Get config file path and command
            const configFilePath = this.getFilePath();
            const command = this.getCommand();
            // Create config object
            const configObj = new configService_1.Config(configFilePath);
            // Execute the command
            switch (command) {
                case RenderCommand.init:
                    return resolve(new templateStructure_1.TemplateStructure(configObj).init());
                case RenderCommand.validate:
                    return resolve(new templateStructure_1.TemplateStructure(configObj).validate());
                case RenderCommand.fetch:
                    return resolve(new dataFetch_1.Fetch(configObj));
                case RenderCommand.generate:
                    return resolve(new handler_1.Render(configObj, this.getLanguage()));
                case RenderCommand.serve:
                    return resolve(new serve_1.Serve(configObj, this.getLanguage()));
                case RenderCommand.clean:
                    return resolve(new clean_1.Janitor(configObj));
            }
        });
    }
}
new Renderer();
