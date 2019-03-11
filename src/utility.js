import request from 'request';

module.exports = {    //export module used to export methods to other js files using require
	pages : function(options, callback){     //will return the page count of issues
		let loop=0;      //pages
		request(options,function(err,response,body){      //request to get info of a repository.
			let openCount,loop;      
			body = JSON.parse(body);
			if(body.has_issues){       //if no issues then return page count in callback else default value
				openCount=body.open_issues_count;     //total number of open issues of a bug but also has pending pull requests
				loop=Math.ceil(openCount/30);      //each page has 30 issues
				return callback(false,loop);
			}else{
				return callback(false,loop);
			}
		});
	},
	getCount : function(page,loop,options,msgo,callback){      //to get count of issues based on creation date
		options['url']=options['url']+'/issues?q=state:open&page='+page;
		if(page<=loop){       //if current page number is less or equal to total pages
			let count24=0;    //count  of issues created less than a day ago
			let count7=0;      //count of issues created in the last week but older than a day
			let countOld=0;      //count of issues older than a week
			request(options,function(err,response,body){
				body = JSON.parse(body);
				for (var j in body){
					let time = timeDiff(body[j].created_at);
					//remove pull requests from open issues and increments the corresponding count
					if(("pull_request" in body[j])==false && time<=24){      
						count24++;
					}else if(("pull_request" in body[j])==false && time<=168){
						count7++;
					}else if(("pull_request" in body[j])==false && time>168){
						countOld++;
					}
				}
				//updating the count in the main json object
				msgo[0]["count24"]=msgo[0]["count24"]+count24;
				msgo[0]["count7"]=msgo[0]["count7"]+count7;
				msgo[0]["countOld"]=msgo[0]["countOld"]+countOld;
				if(page === loop){
					//returns callback with next as false to indicate no more page requests pending
					return callback(false,msgo,false,page+1);      
				}
				//return next page true and increments page to get the issue count from next page
				return callback(false,msgo,true,page+1);      
			});
		}
	}
};

//function to calculate the time diff in hours of the creation date with the current time
function timeDiff(time){
	let now = new Date().getTime();    //current time
	let createdTime = new Date(time).getTime(); 
	let diff =  now - createdTime;
	diff = diff / (1000 * 60 * 60);
	return diff;
}