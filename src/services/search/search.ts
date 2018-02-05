import * as $ from 'jquery';
import { StatefulService } from '../stateful-service';
import {
    SearchState, storeName, SearchAction, reducer, Result,
    QueryDone, QueryFail, Article, ArticleFail,
    ArticleDone, QueryLoading, ArticleLoading
} from './actions';
import { Pagable } from '../pagination/pagination-ui';

const FIGSHARE_API = 'https://api.figshare.com/v2';

const initState: SearchState = {
    page: 1,
    pageSize: 50,
    isQuerying: false,
    isQueryError: false,
    isArticleError: false,
    isFetchingArticle: false,
};

class SearchService extends StatefulService<SearchState, SearchAction>
    implements Pagable<Result> {

    constructor() {
        super(storeName, reducer, initState);
    }

    getPage = () => this.getState();

    paginate = (page: number) => 
        this.find(this.getState().query as string, page)

    find = (query: string, page: number = 1) => {
        const state = this.getState();

        const pendingAjax = $.ajax({
            url: FIGSHARE_API + '/articles/search',
            method: 'post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                'search_for': query,
                'page': page,
                'page_size': state.pageSize
            })
        });

        this.dispatch(QueryLoading(query, page));

        const promisedResult = new Promise<SearchState>((resolve, reject) => {
            pendingAjax.done(
                (results) => {
                    const asResults = results as Result[];
                    this.dispatch(QueryDone(asResults));
                    resolve(this.getState());
                })
                .fail((e) => {
                    this.dispatch(QueryFail());
                    reject();
                });
        });

        return promisedResult;
    }

    getArticle = (articleId: string) => {
        const pendingAjax = $.ajax({
            url: FIGSHARE_API + '/articles/' + articleId,
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
                .fail(() => {
                    this.dispatch(ArticleFail());
                    reject();
                });
        });

        return promisedResult;
    }

}

export const Search = new SearchService();