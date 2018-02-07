import { KeyboardEvent, FormEvent, MouseEvent } from 'react';
import * as React from 'react';
import { Search } from './search';
import Pagination from '../pagination/pagination-ui';
import { RouteComponentProps, match } from 'react-router';
import { Result, SearchState, Article } from 'src/services/search/actions';
import { History } from 'history';

// tslint:disable-next-line:no-any
export class ArticleView extends React.Component<RouteComponentProps<any>> {

    // private history: History;
    // tslint:disable-next-line:no-any
    private match: match<any>;

    // tslint:disable-next-line:no-any
    constructor(params: RouteComponentProps<any>) {
        super(params);
        // this.history = params.history;
        this.match = params.match;
    }

    componentDidMount() {
        const articleId = this.match.params.id;
        const promisedArticle = Search.getArticle(articleId);

        // tslint:disable-next-line:no-shadowed-variable
        promisedArticle.catch(e => {
            alert('There was an error searching, try checking your internet connection');
        });

        promisedArticle.then(found => {
            this.forceUpdate();
        });
    }

    render() {
        const articleMaybe = Search.getState().curArticle;

        if ( !articleMaybe ) {
            return <div />;
        }

        const article = articleMaybe as Article;

        return (
            <div>
            <div id="article" className="clear">
                <div id="summary">
                    <h1 id="title">{article.title}</h1>
                    <p className="description">{article.description}</p>
                    <p className="published">{article.published_date}</p>

                    <div id="this_paper">
                        <div>
                            <h2>Files</h2>
                            <p className="files">a</p>
                        </div>
                        <div>
                            <h2>Authors</h2>
                            <p className="authors">a</p>
                        </div>
                        <div>
                            <h2>Tags</h2>
                            <p className="tags">a</p>
                        </div>
                        <div>
                            <h2>Categories</h2>
                            <p className="cats">a</p>
                        </div>
                    </div>
                    <div id="similar_papers">
                        <h2>Explore Similar</h2>
                        <div>
                            <h3>Papers</h3>
                            <p className="papers">a</p>
                        </div>
                        <div>
                            <h3>Tags</h3>
                            <p className="tags">a</p>
                        </div>
                        <div>
                            <h3>Categories</h3>
                            <p className="cats">a</p>
                        </div>
                        <div>
                            <h3>Authors</h3>
                            <p className="authors">a</p>
                        </div>
                    </div>
                    <div className="clear" />
                </div>
            </div>

            <div className="actions">
                <a className="view btn btn-primary btn-lg" href={article.figshare_url}>View Article</a>
            </div>
        </div>
        );
    }

}

class SearchPagination extends Pagination<Result> {

    constructor() {
        super(Search);
    }

}

function articleClicked(id: string, history: History) {
    return function (e: MouseEvent<HTMLAnchorElement>) {
        const promisedArticle = Search.getArticle(id);
        promisedArticle.then(function () {
            history.push('/article/' + id);
        });
    };
}

const resultToView = (result: Result, history: History) => {
    const title = result.title;
    const published = result.published_date;

    return (
        <li>
            <h2><a onClick={articleClicked(result.id, history)}>{title}</a></h2>
            <p>Published: {published}</p>
        </li>
    );
};

const resultsToViews = (state: SearchState, history: History) => {
    var results = state.results ? (state.results as Result[]) : [];
    const views = results.map((result) => resultToView(result, history));
    return views;
};

// tslint:disable-next-line:no-any
export class SearchResults extends React.Component<RouteComponentProps<any>> {

    private history: History;
    // tslint:disable-next-line:no-any
    private match: match<any>;

    // tslint:disable-next-line:no-any
    constructor(params: RouteComponentProps<any>) {
        super(params);
        this.history = params.history;
        this.match = params.match;
    }

    componentDidMount() {
        Search.setQuery(this.match.params.query);
        const promisedResults = Search.find();

        // tslint:disable-next-line:no-shadowed-variable
        promisedResults.catch(e => {
            alert('There was an error searching, try checking your internet connection');
        });

        promisedResults.then(found => {
            this.forceUpdate();
        });
    }

    render() {
        const state = Search.getState();
        const title = state.query;
        const resultViews = resultsToViews(state, this.history);

        return (
            <div id="search">
                <h1 id="title">{title}</h1>
                <ol className="search_result">
                    {resultViews}
                </ol>
                <SearchPagination />
            </div>
        );
    }

}

// tslint:disable-next-line:no-any
export class SearchBar extends React.Component<RouteComponentProps<any>> {

    private history: History;

    // tslint:disable-next-line:no-any
    constructor(params: RouteComponentProps<any>) {
        super(params);
        this.history = params.history;
    }

    onSearchChange(event: KeyboardEvent<HTMLInputElement> | undefined) {
        const e = event as KeyboardEvent<HTMLInputElement>;
        Search.setQuery(e.currentTarget.value);
    }

    onFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const encodedQuery = encodeURI(Search.getState().query as string);
        this.history.push('/search/' + encodedQuery);
        return false;
    }

    render() {
        const inputProps = {
            className: 'search',
            type: 'text',
            placeholder: 'Find Research'
        };

        return (
            <form className="clear" onSubmit={this.onFormSubmit}>
                <input {...inputProps} onKeyDown={this.onSearchChange} />
                <button type="submit">Search</button>
            </form>
        );
    }

}
