import { Config, Language } from './configService';
import { Fetch } from './dataFetch';
import { Render } from './handler';
import { Serve } from './serve';
import { Janitor } from './clean';
import { TemplateStructure } from './templateStructure';

const args = require('args-parser')(process.argv);

enum RenderCommand {
    init = 'init',
    validate = 'validate',
    fetch = 'fetch',
    generate = 'generate',
    serve = 'serve',
    clean = 'clean'
}

class Renderer {
    constructor() {
        this.main();
    }

    /**
     * Display the instructions
     */
    displayHelp(): void {
        const help = {
            "-h": "This flag prints these instructions",
            "-c": "This flag is used to pass the config file.",
            "init": "Initialise the template folder structure",
            "fetch": "Fetches data from our server",
            "generate": "Combines the template files with the data to generate HTML files",
            "serve": "Starts a static server to view the generated HTML files",
            "clean": "Cleans up the generated and data folders",
            "validate": "Validate the template folder structure"
        }

        console.log('\nUsage Instructions\n')

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
    getFilePath(): string {
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
    getCommand(): string {
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

    getLanguage = (): Language => {
        const LANG = 'lang';
        const selectedLanguage: Language = Language.en;

        if (args[LANG]) {
            for (const arg in args) {
                if (Object.keys(Language).includes(arg)) {
                    return <Language> arg;
                }
            }
        }

        return selectedLanguage;
    }

    /**
     * Execute the main logic
     */
    main(): Promise<any> {
        return new Promise((resolve,reject) => {
            // Check and display help
            if (args.h) { return resolve(this.displayHelp()); }

            // If we have not received the config file, throw error
            if (!args.c) {
                console.error('We have not received the configuration file. Use -h for help or read the README.md file for complete instructions');
                process.exit();
            }

            // Get config file path and command
            const configFilePath: string = this.getFilePath();
            const command: string = this.getCommand();

            // Create config object
            const configObj = new Config(configFilePath);

            // Execute the command
            switch(command) {
                case RenderCommand.init:
                    return resolve(new TemplateStructure(configObj).init());

                case RenderCommand.validate:
                    return resolve(new TemplateStructure(configObj).validate());

                case RenderCommand.fetch:
                    return resolve(new Fetch(configObj));

                case RenderCommand.generate:
                    return resolve(new Render(configObj, this.getLanguage()));

                case RenderCommand.serve:
                    return resolve(new Serve(configObj, this.getLanguage()));

                case RenderCommand.clean:
                    return resolve(new Janitor(configObj));
            }

        })
    }
}

new Renderer();