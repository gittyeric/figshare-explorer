var SearchUI = function () {

	var PAGE_SIZE = 50;

	function parseUrlParams() {
		return parseQueryStr(window.location.search);
	}

	function parseQueryStr(queryString) {
		var query = {};
		var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split('=');
			query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
		}
		return query;
	}

	function updatePagination(query, curPage, results) {
		var firstVisible = Math.max(1, curPage - 2);
		var isNextPage = results.length == PAGE_SIZE;

		if (!isNextPage) {
			$("#next").remove();
		}
		if (curPage == 1) {
			$("#prev").remove();
		}

		$("#prev a").attr("href", "search.html?query=" + query + "&page=" + (curPage - 1));
		$("#search .pagination li.num").each(function (i, el) {
			$(el).find("a")
				.attr("href", "search.html?query=" + query + "&page=" + (firstVisible + i))
				.text(firstVisible + i);
			if ((i + firstVisible) == curPage) {
				$(el).addClass("active");
			}
			if ((i + firstVisible) > curPage && !isNextPage) {
				$(el).remove();
			}
		});
		$("#next a").attr("href", "search.html?query=" + query + "&page=" + (curPage + 1));
	}

	function updateArticleTitle(result) {
		$("#title").text(result.title);
		$(".actions .view").attr("href", result.url_public_html);
	}

	function updateDescription(result) {
		var description = result.description;
		if (description.indexOf("<p>") === 0) {
			description = description.substring(3, description.length - 4);
		}
		$("#summary .description").html(description);
	}

	function updateCategories(result) {
		var catTxt = "";
		for (var i in result["categories"]) {
			var cat = result["categories"][i];
			catTxt += "<a href='search.html?query=:category:%20" + encodeURI(cat.title) + "'>" + cat["title"] + "</a> ";
		}
		$("#this_paper .cats").html(catTxt);
	}

	function updateTags(result) {
		var tagTxt = "";
		for (var i in result["tags"]) {
			var tag = result["tags"][i];
			tagTxt += "<a href='search.html?query=:tag:%20" +
				encodeURI(tag) + "'>" + tag + "</a> ";
		}
		$("#this_paper .tags").html(tagTxt);
	}

	function updateAuthors(result) {
		var authorTxt = "";
		for (var i in result["authors"]) {
			var author = result["authors"][i];
			authorTxt += "<a href='search.html?query=:author:%20" + author["full_name"] + "'>" + author["full_name"] + "</a> ";
		}
		$("#this_paper .authors").html(authorTxt);
	}

	function updateFiles(result) {
		var fileTxt = "";
		for (var i in result["files"]) {
			var file = result.files[i];
			fileTxt += "<a href='" + file["download_url"] + "'>" + file["name"] + "</a> ";
		}
		$("#this_paper .files").html(fileTxt);
	}

	$(document).ready(function () {
		var params = parseUrlParams();
		var query = params["query"];
		var page = (params["page"] ? params.page : 1) - 0;

		if (query) {

			Search.searchArticles(query, page, PAGE_SIZE)
				.done(function (results) {
					$("#title").text('Results for "' + query + '"');
					var $results = $(".search_results").html("");

					for (var i in results) {
						var result = results[i];
						$results.append("<li>" +
							"<h2><a href='article.html?id=" + result.id + "'>" + result.title + "</a></h2>" +
							"<p>Published: " + result.published_date + "</p>" +
							"</li>");
					}

					updatePagination(query, page, results);
				})
				.fail(function (err) {
					alert("There was an error searching, please check your internet connection.");
				});

		} else if (params["id"]) {

			Search.getArticle(params["id"])
				.done(function (result) {
					updateArticleTitle(result);
					updateDescription(result);
					updateCategories(result);
					updateTags(result);
					updateAuthors(result);
					updateFiles(result);
				})
				.fail(function (err) {
					alert("There was an error searching, please check your internet connection.");
				});

		}
	});

	//Public methods
	return {
		parseUrlParams: parseUrlParams
	};
}();