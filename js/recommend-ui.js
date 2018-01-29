var RecommendUI = function () {

	var params = SearchUI.parseUrlParams();
	var articleId = params["id"];

	function updateExploreArticles(count){
		Recommend.recommendArticles(
				articleId, Recommend.ALL, 20)
				.done(function (articles) {
					var articlesHtml = "";
					for(var a in articles){
						var article = articles[a];
						articlesHtml += "<a href='article.html?id=" + article.id + "'>" + article.title + "</a>, ";
					}
					articlesHtml = articlesHtml.substring(0, articlesHtml.length-2);
					
					$("#similar_papers .papers").html(articlesHtml);
				});
	}

	function updateExploreTags(count){
		Recommend.
	}
	
	function updateExploreCategories(){
		
	}

	if (articleId) {
		$(document).ready(function () {
			

		});
	}


}()