import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import request from 'request';

let utility = require('./utility');
let msgo=[];
let count24=0;
let count7=0;
let countOld=0;

//create app
const app = express();

//setting app views path
app.set('views',path.join(__dirname,'views'));

//setting app view engine and body parser
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res) => res.render('index',{msg:""}));

app.post('/',(req,res) => {
	console.log(req.body);
	let url=req.body.url.replace('github.com','api.github.com/repos');
	var options = {
	    url: url,
	    method: 'GET',
	    headers: {'user-agent': 'node.js'}
	};
	request(options,function(err,response,body){
		//console.log(body);
		let openCount,loop;
		body = JSON.parse(body);
		if(body.has_issues){
			console.log(body.open_issues_count);
			openCount=body.open_issues_count;
			loop=Math.ceil(openCount/30);
		}
		msgo.push({'url':req.body.url,'total':count24+count7+countOld,'count24':count24,'count7':count7,'countOld':countOld});
		for (var i=1;i<=loop;i++){
			url = url+'/issues?q=state:open&page='+i;
			//console.log(url);
			var options = {
		    	url: url,
		    	method: 'GET',
		    	headers: {'user-agent': 'node.js'}
			};
			count24=0;
			count7=0;
			countOld=0;
			request(options,function(err,response,body){
				body = JSON.parse(body);
				//console.log(body[0]);
				for (var j in body){
					//console.log(body[i].url);
					//console.log(utility.timeDiff(body[i].created_at));
					let time = utility.timeDiff(body[j].created_at);
					//console.log(time+" "+body[j].state);
					if(("pull_request" in body[j])==false && time<=24){
						count24++;
					}else if(("pull_request" in body[j])==false && time<=168){
						count7++;
					}else if(("pull_request" in body[j])==false && time>168){
						countOld++;
					}
				}
				msgo[0]["count24"]=msgo[0]["count24"]+count24;
				msgo[0]["count7"]=msgo[0]["count7"]+count7;
				msgo[0]["countOld"]=msgo[0]["countOld"]+countOld;
				console.log(i+" "+count24+" "+count7+" "+countOld);
			});
			//console.log(count24+" "+count7+" "+countOld);
		}
		//msgo.push({'url':req.body.url,'total':count24+count7+countOld,'count24':count24,'count7':count7,'countOld':countOld});
		console.log(msgo);
		res.render('index',{msg:msgo});
	});
});

app.listen('3000','localhost',() => console.log('Server running at http://localhost:3000'));
