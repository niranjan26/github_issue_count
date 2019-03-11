### GITHUB repository open issues

#### How to setup:
	* install node
	* clone the github repository to your local system
	* open terminal and traverse to the repo path
	* run the command : npm install

#### How to run:
	* open terminal and traverse to the repo path
	* run the command : npm start

#### How the code works:
	* I have created the app first then set up the view engine and view path to render views(UI).
	* After getting the url from the homepage I am modifying it to transform it into the desired github api path.
	* ex : "https://api.github.com/repos/user_name/repository_name" 
				-- this will return the info on the repository.
	     "https://api.github.com/repos/user_name/repository_name/issues?=state:open+page=page_number&per_page=100" 
		 		-- this will return the issues according to the pagenumber and the issues per page.
	* At first I am requesting to get the number of open issues and then from it calculating number of 
		pages required to fetch. 
	* After getting the number of pages I am calling recursively to the function handling requests per 
		page so as to get the complete count before the final response.  
	* After completing the requests and calculating the counts the method will redirect to the corresponding 
		view and render the response.

#### Future Improvements:
	* UI could be improved a lot.
	* Could use a DB to store the most frequently used github links so as not to enter the url again and again.
	* Could use webhooks so that the UI would be loaded without waiting and the counts could be 
		rendered whenever the requests are completed by the server.
	* Could improve the data displayed - such as including issue urls,creator as well as categorizing them 
		based on creator userid 

#### App live url path:
