var Search = function(){
    
    var FIGSHARE_API = "https://api.figshare.com/v2";
    var FREQL_API = "https://";

    return {
        //Item types
        TAG : "tag",
        CATEGORY : "cat",
        GROUP: "group",
        
        searchArticles : function(query, page, pageSize){
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

        getArticle: function(articleId){
            return $.ajax({
                url: FIGSHARE_API + "/articles/" + articleId,
                mathod: "get"
            });
        },
        
        getArticleSuggestedItems: function(articleId, itemType, recLimit){
            return $.ajax({
                url: FREQL_API + "/query/for/" + itemType,
                method: "get",
                data: {id: articleId, limit: recLimit}
            });
        }

    };
}();

var Formats = function(){
    return {
        
    };
}();