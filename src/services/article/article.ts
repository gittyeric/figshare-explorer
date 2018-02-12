import { ArticleState, ArticleAction, 
    ArticleLoading, ArticleDone, ArticleFail, 
    Article, 
    storeName,
    reducer } from 'src/services/article/actions';
import { StatefulService } from 'src/services/stateful-service';
import * as $ from 'jquery';

const initState: ArticleState = {
    isArticleError: false,
    isFetchingArticle: false,
};

export default class ArticleService extends StatefulService<ArticleState, ArticleAction> {

    private apiPrefix: string;

    constructor(apiPrefix: string) {
        super(storeName, reducer, initState);
        this.apiPrefix = apiPrefix;
    }

    getArticle = (articleId: string) => {
        const pendingAjax = $.ajax({
            url: this.apiPrefix + '/articles/' + articleId,
            method: 'get'
        });

        this.dispatch(ArticleLoading(articleId));

        const promisedResult = new Promise<Article>((resolve, reject) => {
            pendingAjax.done(
                (article) => {
                    const asArticle = article as Article;
                    this.dispatch(ArticleDone(asArticle));
                    resolve(asArticle);
                })
                .fail((e) => {
                    this.dispatch(ArticleFail());
                    reject(e);
                });
        });

        return promisedResult;
    }

}