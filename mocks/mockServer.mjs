#!/usr/bin/env node

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

import axios from 'axios';
import chalk from 'chalk';

// Before enabling the `FETCH_LIVE_DATA` or `FETCH_AND_SAVE_LIVE_DATA` options,
// make sure to set the `ACCESS_KEY` and `SECRET_KEY`.
// These keys are required for authenticating the requests to the server.
//
// When `FETCH_LIVE_DATA` is `true`,
// the code will make live requests to the server and retrieve the actual data.
// For non-GET methods, it will return an empty response with a 200 status code.
//
// When `FETCH_AND_SAVE_LIVE_DATA` is `true`,
// the code not only fetches live data but also saves it to a file for future use.
// The data is stored in a directory structure based on the URL path,
// and the file name includes the request method and query parameters (if any).
// The response data, status code, and headers are written to the file in JSON format.
//
// When `FETCH_LIVE_DATA` and `FETCH_AND_SAVE_LIVE_DATA` is `false` (default value),
// the code will read mocked content from files.
// The file path is constructed using the URL path, method, and query parameters (if any).
// If the file exists, its content is returned as the response.
// Otherwise, an empty response with a 400 status code is returned.

const ACCESS_KEY = ''; // default value <empty string>
const SECRET_KEY = ''; // default value <empty string>

const LIVE_SERVER_HOST = 'https://gamma.coinfinacle.com'; // default value <https://gamma.coinfinacle.com>

const FETCH_LIVE_DATA = false; // default value <false>
const FETCH_AND_SAVE_LIVE_DATA = false; // default value <false>

// =========================== Please do not alter the below configuration ===========================

const HEADER = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, PATCH, OPTIONS, HEAD',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '3600',
    'Content-Type': 'application/json; charset=utf-8',
};

const MOCK_DIR = 'mocks';
const MOCK_SERVER_HOST = 'http://localhost';
const MOCK_SERVER_PORT = 9000;

process.on('SIGINT', () => {
    console.info(chalk.yellowBright.italic('\nDon\'t dare to touch the sacred configuration! Stay out of trouble, and may the tech-gods bless you with glitch-free days ahead!'));
    process.exit();
});

// Get mocked content from file
const getMockedContent = (method, url) => {
    const [urlPath, query] = url.split('?');
    const fileName = query?.length ? `${method.toUpperCase()}--${query}.mock` : `${method.toUpperCase()}.mock`;
    const filePath = path.join(MOCK_DIR, urlPath, fileName);

    try {
        console.info(chalk.grey(`Reading from file: ${filePath}`));

        return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
    } catch (err) {
        console.error(chalk.yellow(`Reading from file: ${filePath} ${err}`));

        // Return empty response with status 400 if file read fails
        return { data: {}, status: 400, headers: HEADER };
    }
};

// Save mocked content to file
const saveMockedContentToFile = async (method, url, content) => {
    const [urlPath, query] = url.split('?');
    const fileName = query?.length ? `${method.toUpperCase()}--${query}.mock` : `${method.toUpperCase()}.mock`;
    const filePath = path.join(MOCK_DIR, urlPath, fileName);

    const { headers, status, data } = content;

    if (!fs.existsSync(path.dirname(filePath))) {
        // Create directory if it doesn't exist
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        console.info(chalk.blue(`Directory created: ${path.dirname(filePath)}`));
    }

    // Write content to file
    fs.writeFileSync(filePath, JSON.stringify({ status, headers, data }, null, 2), 'utf8');
    console.info(chalk.blue(`Data written to file ${filePath}`));
};

// Make live request to server
const liveRequest = async (method, url) => {
    console.info(chalk.greenBright(`${method}: ${LIVE_SERVER_HOST}${url}`));

    if (method === 'GET') {
        // Perform a GET request to the real server
        return performGetRequest(method, url);
    } else {
        console.warn(chalk.yellowBright(`${method}: ${LIVE_SERVER_HOST}${url}`));

        // Return empty response with status 200 for non-GET methods
        return { data: {}, status: 200, headers: HEADER };
    }
};

// Perform GET request to real server
const performGetRequest = async (method, url) => {
    const nonce = new Date().getTime().toString();
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(nonce + ACCESS_KEY).digest('hex');

    try {
        const response = await axios.get(`${LIVE_SERVER_HOST}${url}`, {
            headers: { 'X-Auth-Apikey': ACCESS_KEY, 'X-Auth-Nonce': nonce, 'X-Auth-Signature': signature },
        });

        const headers = { ...HEADER };

        if (response.headers['total']) {
            headers['Total'] = response.headers['total'];
        }

        // Return the response from the real server
        return { data: response.data, status: response.status, headers };
    } catch (error) {
        console.error(chalk.red(`${method}: ${LIVE_SERVER_HOST}${url}`));

        // Return empty response with error status for failed requests
        return { data: error.response?.data || {}, status: error.response?.status || 500, headers: HEADER };
    }
};

// Create HTTP server
const createServer = () => {
    return http.createServer(async (req, res) => {
        let response;

        if (FETCH_LIVE_DATA && ACCESS_KEY.length && SECRET_KEY.length) {
            // Fetch live data from the server
            response = await liveRequest(req.method, req.url);
        } else if (FETCH_AND_SAVE_LIVE_DATA && ACCESS_KEY.length && SECRET_KEY.length) {
            // Fetch live data and save it to a file
            response = await liveRequest(req.method, req.url);
            await saveMockedContentToFile(req.method, req.url, response);
        } else {
            // Get mocked content from a file
            response = getMockedContent(req.method, req.url);
        }

        // Write the response to the client
        res.writeHead(response.status, response.headers);
        res.end(JSON.stringify(response.data));
    });
};

const server = createServer();

server.listen(MOCK_SERVER_PORT, (error) => {
    if (error) {
        console.error(chalk.red(`Mock server unhandled exception ${error}`));

        return;
    }

    console.info(`Mock server is running at: ${chalk.green(`${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}`)}`);
});
