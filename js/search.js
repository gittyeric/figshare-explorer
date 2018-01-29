var Search = function () {

	var FIGSHARE_API = "https://api.figshare.com/v2";

	var catToName = {};
	for(var cat in CATEGORIES){
		catToName[cat.id] = cat.title;
	}

	return {

		catToName: function(catId){
			return catToName[catId] || "(Unknown Category)";
		},

		searchArticles: function (query, page, pageSize) {
			return $.ajax({
				url: FIGSHARE_API + "/articles/search",
				method: "post",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify({
					"search_for": query,
					"page": page,
					"page_size": pageSize
				})
			});
		},

		getArticle: function (articleId) {
			return $.ajax({
				url: FIGSHARE_API + "/articles/" + articleId,
				mathod: "get"
			});
		},

		getArticleSuggestedItems: function (articleId, itemType, recLimit) {
			return $.ajax({
				url: FREQL_API + "/query/for/" + itemType,
				method: "get",
				data: {id: articleId, limit: recLimit}
			});
		}

	};
}();