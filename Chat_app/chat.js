
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const loginRoutes = require('./Route.js/login');
const messageRoutes = require('./Route.js/messages');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login', loginRoutes);
app.use('/messages', messageRoutes);

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/* const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
    const url = req.url;
    const method = req.method;

    if (url === "/") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html>');
        res.write('<head><title> My First Page</title></head>');
        res.write('<body><form action="/message" method ="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
        fs.readFile('message.txt', 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            res.write('<h2>Messages:</h2>');
            res.write('<pre>' + data + '</pre>');
            
            res.write('</body>');
            res.write('</html>');
            res.end();
        });
    }

    if (url === "/message" && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            fs.appendFile('message.txt', message + '\n', (err) => {
                if (err) {
                    throw err;
                }

                console.log('Message written to file');
                res.writeHead(302, { 'Location': '/' });
                res.end();
            });
        });
    }
}).listen(4000);
 */

