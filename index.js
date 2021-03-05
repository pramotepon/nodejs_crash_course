const http = require('http');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

function getPage(page){
    const filePath = path.join(__dirname, page);
    return fs.readFileSync(filePath);
}

function handleFiles(req, res){
    // เช็คนามสกุลไฟล์
    const fileType = path.extname(req.url) || '.html';

    if(fileType == '.html'){
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        if(req.url === '/'){
            res.write(getPage('index.html'));
        }else{
            res.write(getPage(`${req.url}.html`));
        }
    }else if(fileType == '.css') {
        res.setHeader('Content-type', 'text/css');
        res.writeHead(200);
        res.write(getPage(req.url));
        
    } else {
        res.writeHead(404);
    }
    res.end();
}
function getData(url){
    let data;
    if( url == '/apis/users'){
        data = [{ name: 'Pramote' }, { name: 'John' }];
    }else if(url == '/apis/posts'){
        data = [{
            title: 'A',
            publishedDate: moment().startOf('day').fromNow()
        },{
            title: 'B',
            publishedDate: moment().set('month', 1).startOf('day').fromNow()
        }]
    }
    return data;
}

function handleAPIs(req, res){
    // เก็บ return ไว้ในตัวแปร data
    let data = getData(req.url);
    // ถ้ามีค่าส่งมาให้ response
    if(data){
        // set content type
        res.setHeader('Content-Type', 'application/json');
        // แปลงข้อมูลเป็น json data
        res.write(JSON.stringify(data));
    }else{
        // ถ้าไม่มีค่าส่งมาให้ response 404
        res.writeHead(404);
    }
    res.end();
}

http.createServer((req, res) => {
    // ถ้า req url แรกข้นต้นด้วย apis
    if(req.url.startsWith('/apis/')){
        // ให้เรียกใช้ handleAPIs
        handleAPIs(req, res);
    }else{
        // ให้เรียกใช้ handleFiles
        handleFiles(req, res);
    }
}).listen(3000);