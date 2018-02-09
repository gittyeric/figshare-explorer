import { FormEvent, MouseEvent, ChangeEvent } from 'react';
import * as React from 'react';
import { Search } from './search';
import Pagination from '../pagination/pagination-ui';
import { RouteComponentProps, match, Route } from 'react-router';
import { Result, SearchState, Article, File, Author, Category } from 'src/services/search/actions';
import { History } from 'history';

const formatPublishedDate = (date: string) => {
    return date.substring(0, date.indexOf('T'));
};

const fileToView = (file: File) => {
    return (<a href={file.download_url}>{file.name}</a>);
};

const filesToViews = (files: File[]) => {
    return files.map((file) => fileToView(file));
};

const authorToView = (author: Author) => {
    const authorUrl = '/search/' + encodeURI(':author: ' + author.full_name);
    return <a href={authorUrl}>{author.full_name}</a>;
};

const authorsToViews = (authors: Author[]) => {
    return authors.map((author) => authorToView(author));
};

const categoryToView = (cat: Category) => {
    const catUrl = '/search/' + encodeURI(':category: ' + cat.title);
    return <a href={catUrl}>{cat.title}</a>;
};

const categoriesToViews = (cats: Category[]) => {
    return cats.map((cat) => categoryToView(cat));
};

const tagToView = (tag: string) => {
    const tagUrl = '/search/' + encodeURI(':tag: ' + tag);
    return <a href={tagUrl}>{tag}</a>;
};

const tagsToViews = (tags: string[]) => {
    return tags.map((tag) => tagToView(tag));
};

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
        Search.listen(state => this.forceUpdate());

        const articleId = this.match.params.id;
        Search.getArticle(articleId);
    }

    render() {
        const state = Search.getState();
        const articleMaybe = state.curArticle;

        if (state.isArticleError) {
            return <h2>There was an error getting this paper, try checking your internet connection</h2>;
        }
        if (state.isFetchingArticle || !articleMaybe) {
            return <h2>Loading Article...</h2>;
        }

        const article = articleMaybe as Article;
        const filesHtml = filesToViews(article.files);
        const authorHtml = authorsToViews(article.authors);
        const categoryHtml = categoriesToViews(article.categories);
        const tagHtml = tagsToViews(article.tags);
        const pubDate = formatPublishedDate(article.published_date);

        return (
            <div>
                <div id="article" className="clear">
                    <div id="summary">
                        <h1 id="title">{article.title}</h1>
                        <p className="published">Published {pubDate}</p>
                        <div className="description" dangerouslySetInnerHTML={{ __html: article.description }} />

                        <div id="this_paper">
                            <div>
                                <h2>Authors</h2>
                                <p className="authors">{authorHtml}</p>
                            </div>
                            <div>
                                <h2>Tags</h2>
                                <p className="tags">{tagHtml}</p>
                            </div>
                            <div>
                                <h2>Categories</h2>
                                <p className="cats">{categoryHtml}</p>
                            </div>
                            <div>
                                <h2>Files</h2>
                                <p className="files">{filesHtml}</p>
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

type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => boolean;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => boolean;

// tslint:disable-next-line:no-any
export class SearchBar extends React.Component<RouteComponentProps<any>> {

    private history: History;
    private searchChanged: ChangeHandler;
    private formSubmitted: SubmitHandler;

    // tslint:disable-next-line:no-any
    constructor(params: RouteComponentProps<any>) {
        super(params);
        this.history = params.history;

        this.searchChanged = (event: ChangeEvent<HTMLInputElement>) => {
            Search.setQuery(event.currentTarget.value);
            this.forceUpdate();
            return true;
        };

        this.formSubmitted = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const encodedQuery = encodeURI(Search.getState().query);
            this.history.push('/search/' + encodedQuery);
            Search.find();
            return false;
        };
    }

    render() {
        const query = Search.getState().query;

        const inputProps = {
            className: 'search',
            type: 'text',
            placeholder: 'Find Research'
        };

        return (
            <form className="clear" onSubmit={this.formSubmitted}>
                <input {...inputProps} onChange={this.searchChanged} value={query} />
                <button type="submit">Search</button>
            </form>
        );
    }

}

class SearchPagination extends Pagination<Result> {

    constructor(props: {}) {
        super(Search, props);
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
    const published = formatPublishedDate(result.published_date);

    return (
        <li>
            <h2><a onClick={articleClicked(result.id, history)}>{title}</a></h2>
            <p>Published {published}</p>
        </li>
    );
};

const resultsToViews = (state: SearchState, history: History) => {
    var results = state.results ? (state.results as Result[]) : [];
    return results.map((result) => resultToView(result, history));
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
        Search.setQuery(this.match.params.query);
        Search.find();
    }

    componentDidMount() {
        Search.listen(state => {
            this.forceUpdate();
        });
    }

    render() {
        const state = Search.getState();

        if (state.isQueryError) {
            return <h2>There was an error searching, try checking your internet connection</h2>;
        }
        if (state.isQuerying) {
            return <h2>Searching...</h2>;
        }
        if (!state.results || state.results.length === 0) {
            return <h2>No results</h2>;
        }

        const resultViews = resultsToViews(state, this.history);

        return (
            <div id="search">
                <div className="inline">
                    <Route component={SearchBar} />
                </div>
                <ol className="search_result">
                    {resultViews}
                </ol>
                <SearchPagination />
            </div>
        );
    }

}
