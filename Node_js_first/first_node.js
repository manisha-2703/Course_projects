const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./Routes/admin.js');
const shopRoutes = require('./Routes/shop.js');
const contactRoutes= require('./Routes/contactus.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'views', 'public')));

app.use(adminRoutes);
app.use(shopRoutes);
app.use(contactRoutes);
 /* '/shop',  '/admin',*/

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'Views','404.html'));
}); 
app.listen(3000);
