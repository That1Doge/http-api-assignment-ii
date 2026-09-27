const http = require('http');
const url = require('url');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000; 

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getUsers': jsonHandler.getUsersMeta,
        notFound: jsonHandler.notFoundMeta,
    },
    POST: {
        '/addUser': jsonHandler.addUser,
    },
};


const parseBody = (request,response,handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();

        try {
            request.body = JSON.parse(bodyString);
        } catch (e) {
            request.body = {};
        }

        handler(request,response);
    });
};

const onRequest = (request,response) => {
    const parsedUrl = url.parse(request.url);
    const { pathname } = parsedUrl;
    const method = request.method.toUpperCase();

    if(method === 'POST') {
        const handler = urlStruct.POST[pathname];

        if(handler) {
            return parseBody(request,response,handler);
        }

        return parseBody(request,response,jsonHandler.notFound);
    }

    if(method === 'HEAD') {
        const handler = urlStruct.HEAD[pathname] || urlStruct.HEAD.notFound;
        return handler(request,response);
    }

    const handler = urlStruct.GET[pathname] || urlStruct.GET.notFound;
    return handler(request,response);
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});