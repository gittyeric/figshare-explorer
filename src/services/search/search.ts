import * as $ from 'jquery';
import { StatefulService } from '../stateful-service';
import {
    SearchState, storeName, SearchAction, reducer, Result,
    QueryDone, QueryFail, QueryLoading, QueryChanged
} from './actions';
import { Pagable } from '../pagination/pagination-ui';

const initState: SearchState = {
    query: '',
    page: 1,
    pageSize: 50,
    queryMatchesResults: true,
    isQuerying: false,
    isQueryError: false,
};

export default class SearchService extends StatefulService<SearchState, SearchAction>
    implements Pagable<Result> {

    private apiPrefix: string;

    constructor(apiPrefix: string) {
        super(storeName, reducer, initState);
        this.apiPrefix = apiPrefix;
    }

    getPage = () => this.getState();

    paginate = (page: number) => 
        this.find(page)

    setQuery = (query: string) => {
        this.dispatch(QueryChanged(query));
    }
    
    find = (page: number = 1) => {
        const state = this.getState();

        const pendingAjax = $.ajax({
            url: this.apiPrefix + '/articles/search',
            method: 'post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                'search_for': state.query,
                'page': page,
                'page_size': state.pageSize
            })
        });

        this.dispatch(QueryLoading(state.query as string, page));

        const promisedResult = new Promise<SearchState>((resolve, reject) => {
            pendingAjax.done(
                (results) => {
                    const asResults = results as Result[];
                    this.dispatch(QueryDone(asResults));
                    resolve(this.getState());
                })
                .fail((e) => {
                    this.dispatch(QueryFail());
                    reject(e);
                });
        });

        return promisedResult;
    }
    
}
