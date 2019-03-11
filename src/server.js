import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import request from 'request';

//export module having utility/tool functions to get as well as operate on data from github api requests
let utility = require('./utility');

//created app
const app = express();

//setting app views path
app.set('views',path.join(__dirname,'views'));

//setting app view engine and body parser
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//home-page(get) for the app
app.get('/',(req,res) => res.render('index',{msg:""}));

//to handle the post request of the form data from homepage.
app.post('/',(req,res) => {
	let msgo=[]; 		//to store the issue counts
	let loop; 		//to calculate how many pages are to be requested for issues from the github api
	let url=req.body.url.replace('github.com','api.github.com/repos'); 		//url to get the repo information 
	var options = {
	    url: url,
	    method: 'GET',
	    headers: {'user-agent': 'node.js'}  	//is required to get the data from github api
	};
	msgo.push({'url':req.body.url,'count24':0,'count7':0,'countOld':0}); //initialising msgo
	utility.pages(options,function(err,loop){ 		//will return no. of pages(each page having 30 issues) as callback 
		if(loop===0){
			//if no bugs then render the response
			res.render('index',{msg:msgo}); 
		}
		let x; 		//x will store the callback function definition for callback recursion
		utility.getCount(1,loop,options,msgo,x=function(err,msgo,next,page){ 		//will get count of issues from each page
			if(next){ 		//if there is a next page will go to next page else will render the response result
				utility.getCount(page,loop,options,msgo,x); 	//recursive call
			}else{
				res.render('index',{msg:msgo}); 	//response
			}
		});
	});
});

//setting up app socket
app.listen('3000','localhost',() => console.log('Server running at http://localhost:3000'));
