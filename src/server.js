import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

//create app
const app = express();

//setting app views path
app.set('views',path.join(__dirname,'views'));

//setting app view engine and body parser
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res) => res.render('index'));
app.listen('3000','localhost',() => console.log('Server running at http://localhost:3000'));
