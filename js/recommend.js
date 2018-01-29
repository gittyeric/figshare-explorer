var Recommend = function () {

	var FREQL_API = "https://papersearch.org";

	function recommend(articleId, url, count) {
		return $.ajax({
			url: url,
			method: "post",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({
				"limit": count,
				"id": articleId
			})
		});
	}

	return {
		//Item types to get recs for or base article recs on
		ALL: "all",
		TAG: "tags",
		CATEGORY: "cats",
		GROUP: "groups",
		REFERENCE: "refs",

		recommendArticles: function (articleId, recBasedOn, count) {
			var url = FREQL_API + "/by_" + recBasedOn;
			return recommend(articleId, url, count);
		},

		recommendItemType: function (articleId, itemType, count) {
			var url = FREQL_API + "/for_" + itemType;
			return recommend(articleId, url, count);
		}

	};
}();