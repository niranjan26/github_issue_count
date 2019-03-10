module.exports = {
	timeDiff :	function(time){
		let now = new Date().getTime();
		let createdTime = new Date(time).getTime(); 
		//console.log(now);
		//console.log(createdTime);
		let diff =  now - createdTime;
		//console.log(diff);
		diff = diff / (1000 * 60 * 60);
		//console.log(diff);
		return diff;
	}
};
