import { FormEvent, MouseEvent, ChangeEvent } from 'react';
import * as React from 'react';
import Pagination from '../pagination/pagination-ui';
import { RouteComponentProps, match, Route } from 'react-router';
import { Result, SearchState } from 'src/services/search/actions';
import { History } from 'history';
import SearchService from 'src/services/search/search';
import { Unsubscribe } from 'redux';

export const formatPublishedDate = (date: string) => {
    return date.substring(0, date.indexOf('T'));
};

// tslint:disable-next-line:no-any
export interface SearchProps extends RouteComponentProps<any> {
    search: SearchService;
}

// tslint:disable-next-line:no-any
export function asSearchProps(p: RouteComponentProps<any>, Search: SearchService): SearchProps {
    return { ...p, search: Search };
}

const updateUrl = (history: History, state: SearchState) => {
    const encodedQuery = encodeURI(state.query);
    history.push('/search/' + state.page + '/' + encodedQuery);
};

type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => boolean;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => boolean;
// tslint:disable-next-line:no-any
export class SearchBar extends React.Component<SearchProps> {

    private service: SearchService;
    private history: History;
    private searchChanged: ChangeHandler;
    private formSubmitted: SubmitHandler;

    // tslint:disable-next-line:no-any
    constructor(params: SearchProps) {
        super(params);
        this.service = params.search;
        this.history = params.history;

        this.searchChanged = (event: ChangeEvent<HTMLInputElement>) => {
            this.service.setQuery(event.currentTarget.value);
            this.forceUpdate();
            return true;
        };

        this.formSubmitted = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            updateUrl(this.history, this.service.getState());
            return false;
        };
    }

    render() {
        const query = this.service.getState().query;

        const inputProps = {
            className: 'search form-control',
            type: 'text',
            placeholder: 'Find Research'
        };

        return (
            <div className="form-group">
                <form className="clear input-group" onSubmit={this.formSubmitted}>
                    <input {...inputProps} onChange={this.searchChanged} value={query} type="text" />
                    <span className="input-group-btn">
                        <button className="btn btn-primary" type="submit">Search</button>
                    </span>
                </form>
            </div>
        );
    }

}

class SearchPagination extends Pagination<Result> {

    constructor(props: SearchProps) {
        super(props.search, props);
    }

}

function articleClicked(id: string, history: History) {
    return function (e: MouseEvent<HTMLAnchorElement>) {
        history.push('/article/' + id);
    };
}

const resultToView = (result: Result, history: History) => {
    const title = result.title;
    const published = formatPublishedDate(result.published_date);

    return (
        <li>
            <h2><a onClick={articleClicked(result.id, history)} dangerouslySetInnerHTML={{ __html: title }} /></h2>
            <p>Published {published}</p>
        </li>
    );
};

const resultsToViews = (state: SearchState, history: History) => {
    var results = state.results ? (state.results as Result[]) : [];
    return results.map((result) => resultToView(result, history));
};

// tslint:disable-next-line:no-any
export class SearchResults extends React.Component<SearchProps> {

    private service: SearchService;
    private history: History;
    // tslint:disable-next-line:no-any
    private match: match<any>;
    private unlisten: Unsubscribe;

    // tslint:disable-next-line:no-any
    constructor(params: SearchProps) {
        super(params);
        this.service = params.search;
        this.history = params.history;
        this.match = params.match;
    }

    componentWillMount() {
        this.service.setQuery(this.match.params.query);
        this.service.paginate(Number(this.match.params.page));
        
        const instance = this;
        this.unlisten = this.service.listen(state => {
            updateUrl(instance.history, instance.service.getState());
            instance.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const state = this.service.getState();

        if (state.isQueryError) {
            return (
                <div className="page">
                    <h2>There was an error searching, try checking your internet connection</h2>
                </div>);
        }
        if (state.isQuerying) {
            return (
                <div className="page">
                    <h2>Searching...</h2>
                </div>);
        }
        if (!state.results || state.results.length === 0) {
            return (
                <div className="page">
                    <h2>No results</h2>
                </div>);
        }

        const resultViews = resultsToViews(state, this.history);

        return (
            <div id="search" className="page">
                <div className="inline">
                    <Route render={(props) => (<SearchBar {...this.props} />)} />
                </div>
                <ol className="search_result">
                    {resultViews}
                </ol>
                <SearchPagination {...this.props} />
            </div>
        );
    }

}
