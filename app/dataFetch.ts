import { Config } from "./configService";

const axios = require('axios');
const fs = require('fs');
var path = require('path');

export class Fetch {
    configObj: Config;
    endPoint: string;
    destinationDir: string;

    constructor(configObj: Config) {
        this.configObj = configObj;
        this.endPoint = configObj.getEndpoint();

        this.
            initDestinationDir().
            then(this.getFilesToDownload).
            then(this.downloadFiles);
    }

    initDestinationDir = () => {
        return new Promise((resolve, reject) => {
            this.destinationDir = this.configObj.getData();

            if (!fs.existsSync(this.destinationDir)) {
                try {
                    fs.mkdirSync(this.destinationDir, { recursive: true });
                    console.log("Created the destination directory");
                } catch (Error) {
                    console.error("Error : ", Error.message);
                    console.error("Could not create directory");
                    process.exit(0);
                }
            }

            resolve();
        });
    }

    getFilesToDownload = () => {
        return new Promise((resolve, reject) => {
            console.log('Contacting our server...')

            axios.get(this.endPoint)
            .then((response) => {
                const filesToDownload = response.data.files;
                resolve(filesToDownload);
            })
            .catch((error) => {
                try {
                    console.error("Error: ", error.response.statusText);
                    switch (error.response.status) {
                        case 403: console.error("Access to the resource is forbidden");
                            break;
                        case 404: console.error("Requested resource is not available");
                            break;
                        case 401: console.error("Unauthorized error");
                                    console.error("You are trying to access the resource has not been authenticated");
                                    break;
                    }
                } catch{
                    console.error("Server error");
                    console.error("Reason : Web server is not available or Gateway Timeout");
                }

                reject(error);
                process.exit();
            })
        });
    }

    downloadFiles = (filesToDownload) => {
        const promiseList = [];
        const failedToDownload: string[] = [];
        const failedToWrite: string[] = [];
        let successfulWrites: number = 0;
        let failedWrites: number = 0;

        console.log('Downloading data files \n');

        // Create download jobs
        for (let j = 0; j < filesToDownload.length; j++){
            const fileToDownload = filesToDownload[j];
            const fileName = filesToDownload[j].replace(/^.*[\\\/]/, '');
            const outputFileName = path.join(this.destinationDir,fileName);

            const filePromise = new Promise((resolve) => {
                resolve(axios.get(fileToDownload)
                    .then((response) => {
                        try {
                            fs.writeFileSync(outputFileName, JSON.stringify(response.data));
                            successfulWrites++;
                        } catch (Error) {
                            failedWrites++;
                            failedToWrite.push(`- ${fileName}`);
                            console.error("Error: ", Error.message);
                        }
                    })
                    .catch(() => {
                        failedWrites++;
                        failedToDownload.push(`- ${fileName}`);
                    })
                )
            });
            promiseList.push(filePromise);
        }

        // Actually download files
        Promise.all(promiseList)
            .then(() => {
                const totalFiles = promiseList.length;

                if (failedWrites > 0) {
                    console.log(`${successfulWrites}/${totalFiles} files were downloaded`);
                    // console.log("Number of unsuccessful file downloads : ", failedWrites);

                    if (failedToDownload.length > 0) {
                        console.log('\nThe following could not be downloaded');
                        console.log(failedToDownload.join('\n'));
                    }

                    if (failedToWrite.length > 0) {
                        console.log('\nThe following could not be written');
                        console.log(failedToWrite.join('\n'));
                    }
                }

                if (totalFiles - failedWrites > 0) {
                    console.log(`\nFiles have been downloaded to: ${this.destinationDir}`);
                }

                process.exit();
            })
            .catch((error) => {
                console.error(error);
                process.exit();
            });
    }
}
