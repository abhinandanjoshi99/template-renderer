# Template Renderer

The Template Renderer helps web-designers iteratively test their Omnibus templates to ensure that their pages look good for different combinations of data.

**Workflow**

*  The Designer creates a configuration file and sets it to the template folder
*  The Template Renderer fetches data files from our servers
*  The tool stitches the configured templates with the fetched data
*  Using the Serve command, the designer can start a static web-server locally and view the pages

## Prerequisites

Template Renderer requires `nodejs v12.4.0` or higher

## Installation

After downloading the project, run `npm install` to install the required dependencies

## Configuration File Format

```
{
    "src": "<path to the template folder>",
    "data": "<path for data files to be stored>",
    "template-language": "<templating language - supports hbs, ejs>",
    "port": "<port for static web server - Example: 8000>",
    "languages": ["en"]
}
```

## Commands

### Initialise

The `init` command initialises the template structure in the `src` folder based on the templating language

```
npm run render -- -c <path to config json> init
```

### Fetch

The `fetch` command will download sample data files from our servers into the `data` folder specified by the configuration file.

```
npm run render -- -c <path to config json> fetch
```

### Generate HTML files

The `generate` command will combine the template files with the data files to produce the final HTML files. The files will be added to the `generated` folder in your template.

```
npm run render -- -c <path to config json> generate
```

The `generate` command comes with language support. The default is English (`en`), but you can use the `--lang` flag to specify the language that you want to test. Here is an example with Hindi (`hi`)

```
npm run render -- -c <path to config json> generate --lang hi
```

**Tip** - We suggest adding the `generated` in your `.gitignore` folder to avoid checking in these files accidentally

### Check out your pages

The `serve` command will start a static server and let you view the outcome of combining your template files with the data. If you want to make any changes in your template, run the `generate` command again and view the files

```
npm run render -- -c <path to config json> serve
```

### Clean up

The `clean` command will delete the generated and data folders and can be the last step of the process.

```
npm run render -- -c <path to config json> clean
```

### Validate

The `validate` command validates the project folder and file structure.

```
npm run render -- -c <path to config json> validate
```
