import * as React from 'react';
import { RouteComponentProps, match } from 'react-router';
import { Article, Author, File, Category } from 'src/services/article/actions';
import { SuggestBox, SuggestProps } from 'src/services/suggest/suggest-ui';
import { formatPublishedDate } from 'src/services/search/search-ui';
import ArticleService from 'src/services/article/article';
import SuggestService from 'src/services/suggest/suggest';
import { Unsubscribe } from 'redux';

// tslint:disable-next-line:no-any
export interface ArticleViewProps extends SuggestProps {
    article: ArticleService;
}

// tslint:disable-next-line:no-any
export function asArticleProps(p: RouteComponentProps<any>, 
                               suggest: SuggestService, article: ArticleService): 
                               ArticleViewProps {
    return { ...p, suggest: suggest, article: article };
}

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
export class ArticleView extends React.Component<ArticleViewProps> {

    // tslint:disable-next-line:no-any
    private match: match<any>;
    private service: ArticleService;
    private unlisten: Unsubscribe;

    // tslint:disable-next-line:no-any
    constructor(params: ArticleViewProps) {
        super(params);
        this.match = params.match;
        this.service = params.article;
    }

    componentWillMount() {
        const instance = this;
        this.unlisten = this.service.listen(state => instance.forceUpdate());

        const articleId = this.match.params.id;
        this.service.getArticle(articleId);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const state = this.service.getState();
        const articleMaybe = state.curArticle;

        if (state.isArticleError) {
            return (
                <div className="page">
                    <h2>There was an error getting this paper, try checking your internet connection</h2>
                </div>);
        }
        if (state.isFetchingArticle || !articleMaybe) {
            return (
                <div className="page">
                    <h2>Loading Article...</h2>
                </div>);
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
                        <h1 id="title" dangerouslySetInnerHTML={{__html: article.title}} />
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
                        <SuggestBox {...this.props} />
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