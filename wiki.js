$(document).ready(function() {
	$("button").on("click", createRan);
	$("input").on("keydown", function(event){
		if(event.key == "Enter") {
			var searchVal = $("input").val();
			$("input").val("");
			$(".wikiResult").remove();
			$("#searchRow").css("margin-top", "28px");
			search(searchVal);
		}
	});
});

function search(searchVal) {
	searchVal = searchVal.replace(" ", "%20");
	$.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+ searchVal +"&utf8=&format=json&origin=*", function(data){
		if(data.query.search.length > 0) { //kiedy są wyniki
			// data.query.search[0].pageid
			var idArr = [];
			for(var i = 0; i < 8; i++) {
				idArr.push(data.query.search[i].pageid)
			}
			idArr.forEach(function(id) {
				$.getJSON("https://en.wikipedia.org/w/api.php?action=query&pageids=" + id + "&origin=*&format=json&prop=extracts&exintro=&explaintext=", function (data) {
					var title = data.query.pages[id].title;
					var info = data.query.pages[id].extract;
					info = formatInfo(info);
					if(info == "") {
						info = "Click to explore!";
					}
					$(".container").append("<div class='row justify-content-center'><div class='col-lg-8 wikiResult'><a target='_blank' href='"+ urlFromTitle(title) +"'></a><h3>"+ title +"</h3><p>"+ info +"</p></div></div>");
				});
			});
		} else {
			//kiedy nie ma wynikow
		}
	});
}

function createRan() {
	if ($('.wikiResult').length > 0) {
		$(".wikiResult").remove();	
	}
	$("#searchRow").css("margin-top", "25%");
	inCreateRan();
}

function inCreateRan() {
	$.getJSON("https://www.mediawiki.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&origin=*&format=json", function(data) {
		var id = data.query.random[0].id;
		$.getJSON("https://en.wikipedia.org/w/api.php?action=query&pageids=" + id + "&origin=*&format=json&prop=extracts&exintro=&explaintext=", function (data) {
			var title = data.query.pages[id].title;
			var info = data.query.pages[id].extract;
			info = formatInfo(info);
			if(info == "") {
				info = "Click to explore!";
			}
			if(title === undefined) { // zapobiega sytuacji kiedy cos sie nieudalo z wikipedia API
				console.log(":(");
				inCreateRan();
			} else {
				$(".container").append("<div class='row justify-content-center'><div class='col-lg-8 wikiResult'><a target='_blank' href='"+ urlFromTitle(title) +"'></a><h3>"+ title +"</h3><p>"+ info +"</p></div></div>");
			}
		});
	});
}

function formatInfo(info) {
	var lSpace;
	if(info !== undefined) {
		info = info.substr(0,280);
		if(info.length === 280) {
			for(var i = 279; i > 0; i--) {
				if(info[i] === " ") {
					lSpace = i;
					break;
				}
			}
			info = info.substr(0, lSpace) + "...";
		}
	}
	
	return info;
}

function urlFromTitle(title) {
	var arrWords = title.split(" ");
	var urlAdd = "https://en.wikipedia.org/wiki/";
	for(var i = 0; i < arrWords.length; i++) {
		urlAdd = urlAdd + arrWords[i] + "_";
	}
	return urlAdd.substr(0, urlAdd.length - 1);
}