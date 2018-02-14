const path = require('path');

const mimeTypes = {
        html: 'text/html',
        js: 'text/javascript',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        ico: 'image/icon',
        txt: 'text/plain',
        json: 'application/json',
        xml: 'text/xml',
        pdf: 'application/pdf',
        default: 'application/octet-stream'
};

const lookup = (pathName) => {
    let ext = path.extname(pathName);
    ext = ext.split('.').pop();
    return mimeTypes[ext] || mimeTypes['txt'];
}

module.exports = {
    lookup
};