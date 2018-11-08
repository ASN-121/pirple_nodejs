
/*
 *  Dependencies
 *  http: for http server creation
 *  url : for request query parsing
 */
const http = require('http');
const url = require('url');

/*
 * Configuration
 * NODE_ENV = dev: For staging (port 3000)
 * NODE_ENV = prod: For production (port 4000)
 */
let config = {};
config.dev = {
    'envName' : 'staging',
    'port' : 3000,
};
config.prod = {
    'envName' : 'prod',
    'port' : 4000,
};
let currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';
let selectedConfig = config.hasOwnProperty(currentEnv) ? config[currentEnv] : config.dev;

/* Server creation and requests handling
 * we do not parse body/data in the request
 * as we only respond to a GET /hello requests
 */
const server = http.createServer( (req,res)=> {
    let method = req.method.toUpperCase();
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');

    let handler = handlers.notFound; // default to the 'not found' handler
    if(router.hasOwnProperty(path) && (router[path].supportedMethods.includes(method)) )
    {
        handler = router[path].handler;
    }

    handler((statusCode = 200, msg = {}) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        let responseMsg = JSON.stringify(msg);
        res.end(responseMsg);
        console.log(`A '${method}' request to '${path}' was triggered by '${req.connection.remoteAddress}' and the status code '${statusCode}' was returned.`)
    });
});

server.listen(selectedConfig.port, () => {
    console.log(`Listening on ${selectedConfig.port}!`);
});


/*
 *  Handlers
 *  hello: Return welcoming message
 *  notFound: Return not found message
 */

let handlers = {
    hello: (callback) => {
        let currentDate = Date().toLocaleString();
        callback(200, {msg: `Welcome, we are on ${currentDate}.`});
    },
    notFound: (callback) => {
        callback(404, {msg: 'Not Found!'});
    }
}

// Router
let router = {
    'hello' : {
        supportedMethods: ['GET'],
        handler: handlers.hello,
    }
};
