const page=require('./read.js');
const mime=require('./getFileMine.js');
const path=require('path');
const http=require('http');
const url=require('url');
const fs=require('fs');
function route(req,res){
	switch (req.url) {
		case '/':
				res.writeHead(200,{'Content-Type':'text/html'});
				res.write(page.data);
			break;
		default:
				const pathName = path.join(page.root, path.normalize(req.url));
				routeHandler(pathName, req, res);
			break;
	}
}
function respondFile(pathName, req, res) {		//设置请求的静态资源的请求头
    const readStream = fs.createReadStream(pathName);
    console.log(pathName);
    res.writeHead(200,{'Content-Type': mime.lookup(pathName)});
    readStream.pipe(res);
}


function respondNotFound(req, res) {				//404
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.end(`<h1>Not Found</h1><p>The requested Source ${req.url} was not found on this server.</p>`);
}


function routeHandler(pathName, req, res) {		//路由器
    fs.stat(pathName, (err, stat) => {
        if (!err) {
            const requestedPath = url.parse(req.url).pathname;
				// if (stat.isDirectory()) {
    //             respondRedirect(req, res);
    //             	} else {
                    respondFile(pathName, req, res);
               		 // }
        } else {
            respondNotFound(req, res);
     }
});
}



function respondDirectory(pathName, req, res) {
        const indexPagePath = path.join(pathName, this.indexPage);
        if (fs.existsSync(indexPagePath)) {
            this.respondFile(indexPagePath, req, res);
        } else {
            fs.readdir(pathName, (err, files) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(err);
                }
                const requestPath = url.parse(req.url).pathname;
                let content = `<h1>Index of ${requestPath}</h1>`;
                files.forEach(file => {
                    let itemLink = path.join(requestPath,file);
                    const stat = fs.statSync(path.join(pathName, file));
                    if (stat && stat.isDirectory()) {
                        itemLink = path.join(itemLink, '/');
                    }                 
                    content += `<p><a href='${itemLink}'>${file}</a></p>`;
                });
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(content);
            });
        }
    }
    module.exports=http.createServer((req,res)=>{
    route(req,res); 
});