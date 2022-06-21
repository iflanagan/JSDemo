/* eslint-disable camelcase */

/**
 *  HTML Report Create
 * 
 *  Parameters
 * 
 *      resultIdOrUrl  (required)   : Test Results Page address bar URL 
 *                                  Get the URL from the Chrome address bar of the results to generate a report for
 *      accessTokenURL (required)   : Temp token for accessing results API
 *                                  Get the URL from the download screenshots step menu button
 * 
 *      filePath                    : Path to folder location to place report files
 *      embedImages [optional]      : true/false (default = false)
 *      generatePDF [optional ]     : true/false (default = false)
 * 
 *  Instalation/Configuration
 *  
 *      If running in nodejs in VSCode you will need to install adm-zip and html-pdf-node:  
 *              npm install adm-zip -g
 *              npm i html-pdf-node -g
 *      Testim will also need to enable downloading step result images.  Ask your CSM to enable "allowDownloadResultScreenshots".
 * 
 *  Directions 
 * 
 *      Navigate to any test result
 *      Click on the three elipses button (...)
 *      Right click "Download result screenshots" and COPY the link address
 *      Replace accessTokenURL's value with the copied link address (this will have to be done every 30-60 minutes due to the expiration of the access-token)
 *      Copy the main Testim page URL from the address bar and set resultIdOrUrl to the copied result URL
 *      Set the variable filePath to a writeable directory on your comupter such as "c:\\temp\\" or wherever.
 *      Run this file and your results should show in the target directory
 * 
 *  References
 * 
 *      https://www.npmjs.com/package/adm-zip
 *      https://www.npmjs.com/package/html-pdf-node
 * 
 *  ToDo:
 *    
 *      Get Result JSON via DB call
 *      Use Report Template file
 *      Generate/Obsfucate/Encrypt access token
 *      Get multiiple result links from run url
 *          https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/runs/suites/fuXVqkn6R1OfsATV?status=All%20statuses&author=All%20owners&failureType=All%20failure%20types
 *          https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/branch/master/test/24uu7ptaEs5CqY2V?result-id=4ynRQLa8BzUHCEV3
 *          https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/runs/tests?period=Yesterday&test_id=fc273vW4BOAXdiT;fc273i2jZ1gFMGs;fc273t2RMYeVHoJ;KgPGGWZHCotQLz2j;p6XxiORZrgrxdBXu&failureType=All%20failure%20types *
 *          https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/runs/tests?period=Yesterday&failureType=All%20failure%20types
 *          https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/runs/tests
 *              ?period=Last%207%20Days
 *              &test_id=aiOEfxSxxtSTzbV4;NFNsR0M5SDjUGRCQ;fc273vW4BOAXdiT
 *              &failureType=All%20failure%20types *
 * 
 *      Single Monster Report w/ Multiple Tests
 *      Folder w/ Test Report and Top level aggregation report
 */

// eslint-disable-next-line no-redeclare
/* globals generatePDF, embedImages, filePath, Promise, require */

/* vvv PARAMETER OVERRIDES vvv */

let resultIdOrUrl = [
    '',
    '',
    '',
];
let accessTokenURL = "";
let resultData = "";

let resultInfo =
{
    ResultLink: "https://app.testim.io/#/project/xtE0dtINhdJ1YSGmv5Mu/branch/master/test/Eyyeq8JQvc9ISr8k?result-id=B7XbeSZROrd9pUpO",
    TestResultData: null,

    AccessTokenURL: "https://services.testim.io/result/DUlV5bkuMTkdHa29/screenshots?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhnSHN5UFRDM0NGOUNRbXdZcVp1IiwiaWF0IjoxNjM2MDUwMzY0LCJleHAiOjE2MzYwNTM5NjR9.EqQ_R9CiLtNavdv-nDLzGtP5cJpecXOr1fyK13s7AYI&projectId=n9JEQjiPUi5yhbWiHEmB"
;
resultIdOrUrl = resultInfo.ResultLink;
accessTokenURL = resultInfo.AccessTokenURL;
resultData = resultInfo.TestResultData;

let embedImages = true;
let generatePDF = true;

/* ^^^ PARAMETER OVERRIDES ^^^ */

console.log("================================================");
console.log("               HTML Report Create               ");
console.log("================================================");

let file_path = (typeof filePath !== 'undefined' && filePath !== null) ? filePath : "/Users/ianflanagan";
let generate_pdf = (typeof generatePDF !== 'undefined' && generatePDF === true) ? true : false;
let embed_images = (typeof embedImages !== 'undefined' && embedImages === true) ? true : false;

const http = require('http');
const https = require('https');
const AdmZip = require('adm-zip');
const HtmlToPdf = require('html-pdf-node');
const fs = require('fs');

function htmlReportStyleGet() {
    return "<style>\n"
        + "   .styled-table {"
        + "     border-collapse: collapse;"
        + "     margin: 25px 0;"
        + "     font-size: 0.9em;"
        + "     font-family: sans-serif;"
        + "     min-width: 400px;"
        + "     box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);"
        + "   }"
        + "   .styled-table thead tr { "
        + "       background-color: #009879;"
        + "       color: #ffffff;"
        + "       text-align: left;"
        + "   }"
        + "   .styled-table th,"
        + "   .styled-table td {"
        + "       padding: 12px 15px;"
        + "   }"
        + "   .styled-table tbody tr {"
        + "      border-bottom: thin solid #dddddd;"
        + "  }"
        + "  "
        + "  .styled-table tbody tr:nth-of-type(even) {"
        + "      background-color: #f3f3f3;"
        + "  }"
        + "  "
        + "  .styled-table tbody tr:last-of-type {"
        + "      border-bottom: 2px solid #009879;"
        + "  }"
        + "  .styled-table tbody tr.active-row {"
        + "      font-weight: bold;"
        + "      color: #009879;"
        + "  }"
        + ".screenshot { width: 150px; height: 100px; padding: 10px }"
        + "  </style>\n";
}
function htmlReportTestInfoHeaderCreate(project_id, test_id, result_id, zipEntryName) {
    let testInfo = "  <table class='styled-table'>\n";

    testInfo += "    <tr>\n";
    testInfo += "      <td><b>Test</b></td>"
        + "<td>"
        + "<a href='https://app.testim.io/#/project/" + project_id + "/branch/master/test/" + test_id + "' target='_blank'>" + (resultData !== null ? resultData.TestName : test_id) + "</a>"
        + "</td>\n";
    testInfo += "    </tr>\n";

    if (resultData !== null) {
        testInfo += "    <tr>\n";
        testInfo += "      <td><b>Test Result</b></td>"
            + "<td>"
            + (resultData?.TestStatus === "PASSED" ? "<b style='color:green;'>PASSED</b>" : "<b style='color:red;'>FAILED</b>")
            + "</td>\n";
        testInfo += "    <tr>\n";

        if (!resultData?.TestStatus) {

            testInfo += "    <tr>\n";
            testInfo += "      <td><b>Failure Reason</b> " + resultData?._stepInternalData.errorType + "</td>"
                + "<td>"
                + "<b style='color:red;'>" + resultData?._stepInternalData.failureReason + "</b>";
            +"</td>\n";
            testInfo += "    <tr>\n";

        }
    }

    testInfo += "    <tr>\n";
    testInfo += "      <td><b>ResultID</b></td>"
        + "<td>"
        + "<a href='https://app.testim.io/#/project/" + project_id + "/branch/master/test/" + test_id + "?result-id=" + result_id + "' target='_blank'>" + result_id + "</a>"
        + "</td>\n";
    testInfo += "    </tr>\n";

    /**
     * Generate Hear and Test Info Section
     */
    let parts = zipEntryName.split('-');
    let year = parts[1];
    let month = parts[2];
    let day = parts[3].split('T')[0];
    let time = parts[3].split('T')[1];

    testInfo += "    </tr>\n";
    testInfo += "      <td><b>Date Run</b></td><td>" + year + '-' + month + '-' + day + ' @ ' + time + "</td>\n";
    testInfo += "    </tr>\n";

    testInfo += "  </table>\n";

    return testInfo;
}
function htmlReportStepDetailsCreate(zipEntries, project_id, test_id, result_id, filename, filePath) {

    let html = "<table class='styled-table'>\n";

    html += "   <thead>\n";

    html += "      <th style='width:100px'>";
    html += "           <u><b>Step Number</b></u>";
    html += "       </th>";

    html += "       <th style='width:70px'>";
    html += "           <u><b>Step ID</b></u>";
    html += "       </th>";

    html += "       <th>";
    html += "           <u><b>Step In Time</b></u>";
    html += "       </th>";

    html += "       <th style='width:100px'>";
    html += "           <u><b>Step Name</b></u>";
    html += "       </th>";

    html += "       <th>";
    html += "       </th>\n";

    if (resultData !== null) {
        html += "       <th>";
        html += "       </th>\n";
    }
    if (resultData !== null) {
        html += "       <th>Page URL";
        html += "       </th>\n";
    }

    html += "       <th>";
    html += "           <u><b>Step ScreenShot</b></u>";
    html += "       </th>\n";

    html += "    </thead>\n";

    console.log("STEP COUNTS: zipEntries: ", zipEntries.length, "resultData?._steps", resultData?._steps.length);

    let step_number = -1;
    zipEntries.forEach(function (zipEntry) {

        let step_parts = zipEntry.name.split('-');
        let step_name = step_parts.slice(4, step_parts.length - 1).join("-");

        //screenshot-2021-09-03T18_46_09.914Z-ash-AfterStep-qbkIi7ERrBtFckg8.jpg
        if (!step_name.replace(' ', '').includes('BeforeTest')
            && !step_name.replace(' ', '').includes('BeforeStep')
            && !step_name.replace(' ', '').includes('AfterStep')
            && !step_name.replace(' ', '').includes('AfterTest')) {

            step_number = step_number + 1;
            if (step_number === 0)
                return;

            console.log("  JSON STEP (" + resultData?._steps[step_number - 1]?.stepNumber + ") NAME: ", resultData?._steps[step_number - 1]?.name + "\t\t JPG STEP (" + step_number + ") NAME: " + step_name);

            html += "    <tr>\n";

            html += "      <td style='text-align: center;'>";
            html += "           <b>" + step_number + "</b>";
            html += "      </td>";

            // https://app.testim.io/#/project/5gMpbf9SMiJr9lmwyIAs/branch/master/test/7bsJ4ofsxoa34mOz/step/3Aw8SDV9dXO3UIKm/viewer/screenshots?result-id=TKlI9dXgCYGFteF5&path=3Aw8SDV9dXO3UIKm
            let step_id = zipEntry.name.split('-')[zipEntry.name.split('-').length - 1].replace(".jpg", "");
            html += "      <td>";
            html += "           "
                //+ "<a target='_blank' href='https://app.testim.io/#/project/" + project_id + "/branch/master/test/" + test_id + "/step/" + step_id + "/viewer/screenshots?result-id=" + result_id + "&path=" + step_id + "'>"               
                + "<a target='_blank' href='https://app.testim.io/#/project/" + project_id + "/branch/master/test/" + test_id + "/step/" + step_id + "?result-id=" + result_id + "&path=" + step_id + "'>"
                + step_id
                + "</a>";
            html += "      </td>";

            // screenshot-2021-08-28T02_07_45.125Z-Begin Transaction-pY38QUkv1Muht6h5
            let step_time = zipEntry.name.split('-')[3].split('T')[1];
            html += "      <td>";
            html += "           <b>" + step_time + "</b>";
            html += "      </td>";

            html += "      <td nowrap='nowrap'>";
            html += "           <b>" + zipEntry.name.split('-')[zipEntry.name.split('-').length - 2].replace(".jpg", "") + "</b>";
            html += "      </td>";

            if (resultData !== null) {
                html += "<td>";
                html += (resultData?._steps[step_number - 1]?.status === "PASSED" ? "<b style='color:green;'>PASSED</b>" : "<b style='color:red;'>FAILED</b>");
                html += "</td>\n";
            }

            //    html += "<td>"
            //    html += "<b>" + resultData?._steps[step_number-1]?.endTime  + " => " + new Date(resultData?._steps[step_number-1]?.endTime).toUTCString() + "</b>";
            //    html += "</td>\n";
            if (resultData !== null) {
                html += "<td>";
                html += "<b>" + resultData?._steps[step_number - 1]?.name + "</b>";
                html += "</td>\n";
            }

            let image_src = "./" + filename.replace('.zip', '') + "/" + zipEntry.name;
            if (embed_images) {
                let mime = 'image/png';
                let encoding = 'base64';
                let data = fs.readFileSync(filePath + "/" + filename.replace('.zip', '') + "/" + zipEntry.name).toString(encoding);
                image_src = 'data:' + mime + ';' + encoding + ',' + data;
            }

            html += "      <td>";
            html += "           <a href='" + resultData?._steps[step_number - 1]?.url + "'/>";
            html += "      </td>\n";

            html += "      <td>";
            html += "           <img class='screenshot' src='" + image_src + "'/>";
            html += "      </td>\n";

            html += "    </tr>\n";

        }

    });

    console.log("STEP COUNTS: zipEntries(filtered): ", step_number, "resultData?._steps", resultData?._steps.length);

    html += "  </table>\n";

    return html;

}
function htmlReportCreate(resultIdOrUrl, accessTokenURL, filePath) {

    console.log("------------------------");

    /* Process input URLs for TestID, ProjectID, ResultID and AccessToken
    */
    let project_regex = /\/project\/(?<projectId>.*)\/branch/;
    let project_id = resultIdOrUrl.match(project_regex)?.groups.projectId;
    console.log(" project_id:  ", project_id);

    let test_regex = /\/test\/(?<testId>.*)\?/;
    let test_id = resultIdOrUrl.match(test_regex)?.groups.testId;
    console.log(" test_id:     ", test_id);

    let result_regex = /result-id=(?<resultId>.*)[&]?$/;
    let result_id = resultIdOrUrl.match(result_regex)?.groups.resultId.split('&')[0];
    console.log(" result_id:   ", result_id);

    let accesstoken_regex = /access_token=(?<accessToken>.*)[&]?$/;
    let accessToken = accessTokenURL.match(accesstoken_regex)?.groups.accessToken.split('&')[0];
    console.log(" accessToken: ", accessToken);

    if (typeof project_id === 'undefined')
        throw new Error("project_id is undefined");

    if (typeof result_id === 'undefined')
        throw new Error("result_id is undefined");

    if (typeof accessToken === 'undefined')
        throw new Error("accessToken is undefined");

    let screenshotsUrl = "https://services.testim.io/result/" + result_id + "/screenshots" + "?access_token=" + accessToken + "&projectId=" + project_id;
    let filename = "reportfile_" + result_id + ".zip";
    console.log("filename:    ", filename);
    console.log("------------------------");

    function CancelError() {
        console.error('Abort!');
    }

    /**
      * Downloads file from remote HTTP[S] host and puts its contents to the
      * specified location.
      */
    async function download(url, filePath) {

        const proto = !url.charAt(4).localeCompare('s') ? https : http;

        return new Promise((resolve, reject) => {

            const file = fs.createWriteStream(filePath);
            let fileInfo = null;

            const request = proto.get(url, response => {

                if (response.statusCode !== 200) {
                    console.log("\n\tACCESS_TOKEN Probably has Expired.  Update accessTokenURL and try again.\n\n");
                    reject(new Error(`Failed to get '${ url }' (${ response.statusCode })`));
                    return;
                }

                fileInfo = {
                    mime: response.headers['content-type'],
                    size: parseInt(response.headers['content-length'], 10),
                };

                response.pipe(file);

            })

            // The destination stream is ended by the time it's called
            file.on('finish', () => resolve(fileInfo));

            request.on('error', err => {
                fs.unlink(filePath, () => reject(err));
            });

            file.on('error', err => {
                fs.unlink(filePath, () => reject(err));
            });

            request.end();
        })
            .catch((e) => {
                console.error(e);
                fs.unlinkSync(filePath);
                throw new CancelError();
            });
    }

    console.log("FIRST download() ", screenshotsUrl, " as ", filePath + filename);
    download(screenshotsUrl, filePath + filename) /* FIRST download */

        .then(() => /* THEN  */ {
            console.log("THEN THIS ");

        })

        .then(() => /* THEN  */ {
            console.log("THEN THAT ");

        })

        .then(() => /* THEN extract */ {
            console.log("THEN extract ", filePath + filename + " to ", filePath + filename.replace('.zip', ''));

            // reading archives
            let zip = new AdmZip(filePath + filename);

            // extracts the specified file to the specified location
            zip.extractAllTo(filePath + filename.replace('.zip', ''));

            fs.unlinkSync(filePath + filename);

            let zipEntries = zip.getEntries(); // an array of ZipEntry records   

            return (zipEntries);

        })
        .then((zipEntries) => /* THEN generate html report */ {

            console.log("THEN generate html report");

            let html = "<html>\n";

            html += " <head>\n";

            let style = htmlReportStyleGet();
            html += style;

            html += " </head>\n";

            html += " <body>\n";

            let testInfo = htmlReportTestInfoHeaderCreate(project_id, test_id, result_id, zipEntries[0].name);
            html += testInfo;

            html += htmlReportStepDetailsCreate(zipEntries, project_id, test_id, result_id, filename, filePath);

            html += " </body>\n";
            html += "</html>";

            //console.log(html);

            return (html);

        })
        .then((html) => /* THEN write generated html to file */ {

            let html_file = filePath + filename.replace('.zip', '.html');
            console.log("THEN write generated html to file", html_file);

            fs.writeFile(html_file, html, function (err) {
                if (err) return console.log(err);
            });

            return (html);

        })
        .then((html) => /* THEN Create PDF file */ {

            if (generate_pdf === true) {

                return new Promise((resolve, reject) => {

                    let html_file = filePath + filename.replace('.zip', '.html');
                    let pdf_filepath = filePath + filename.replace('.zip', '.pdf');

                    console.log("THEN Create PDF", pdf_filepath);

                    // Example of options with args //
                    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
                    let options = { format: 'A4' };
                    let file = { content: html };
                    file = { url: html_file };

                    console.log("  CREATING PDFfile ", pdf_filepath);

                    HtmlToPdf.generatePdf(file, options).then(pdfBuffer => {
                        fs.writeFile(pdf_filepath, pdfBuffer, function (err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            console.log("  PDF file ", pdf_filepath, "Created.");
                            resolve();
                        });
                    });

                });

            }

        })
        .then(() => /* AND Bob's your uncle */ {

            console.log("AND Bob's your uncle");
            console.log("================================================");

        })
        .catch((e) => {
            console.error(e);
        });

}

let result_urls = [];
if (typeof resultIdOrUrl !== 'object')
    result_urls.push(resultIdOrUrl);
else
    result_urls = resultIdOrUrl;

/* Figure out what we are dealing with (process parameters)
 */
if (typeof resultIdOrUrl === 'undefined' || resultIdOrUrl === null) {
    throw new Error("Parameter 'resultIdOrUrl' is undefined.  Please set resultIdOrUrl parameter and try again");
}
if (resultIdOrUrl.includes('?result-id=')) {
    // TODO
}
if (resultIdOrUrl.includes('/runs/tests')) {
    // TODO
}

result_urls.forEach((result_url) => {
    if (result_url !== null && result_url != "")
        htmlReportCreate(result_url, accessTokenURL, file_path);
});

