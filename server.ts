import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine} from '@angular/ssr';
import express from 'express';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import bootstrap from './src/main.server';
import {QUERYPARAMS, REQUEST, RESPONSE} from "./src/tokens";


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
let queryParams: any = {};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);


  server.get('/api/query-params', (req, res, next) => {
    console.log(queryParams);
    res.send(queryParams);
  });

  server.get('/api/form-submit', (req, res) => {
    console.log(req.query);

    const {name, email} = req.query;
    if (!name || !email) {
      return res.status(400).send('Name and email are required.');
    }

    return res.send(`Form submitted with name: ${name} and email: ${email}`);
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // pre-render hooks
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    queryParams = req.query;
    console.log(queryParams);
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: REQUEST, useValue: req },
          { provide: RESPONSE, useValue: res },
          {
            provide: QUERYPARAMS,
            useValue: queryParams
          }
        ]
      })
      .then((html) => {
        res.send(html);
      })
      .catch((err) => next(err));
  });



  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
