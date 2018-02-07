import { NamedReducer, NamedAction } from '../../state';
import { Page } from '../pagination/pagination-ui';

export const storeName = 'search';

export interface SearchState extends Page<Result> {
    page: number;
    pageSize: number;
    isQuerying: boolean;
    isQueryError: boolean;
    query?: string;
    results?: Array<Result>;

    isFetchingArticle: boolean;
    isArticleError: boolean;
    curArticleId?: string;
    curArticle?: Article;
}

export interface Article {
    id: string;
    title: string;
    description: string;
    categories: string[];
    tags: string[];
    authors: Author[];
    files: File[];
    published_date: string;
    figshare_url: string;
}

export interface Author {
    full_name: string;
}

export interface File {
    download_url: string;
    name: string;
}

export interface Result {
    id: string;
    title: string;
    description: string;
    categories: string[];
    tags: string[];
    authors: Author[];
    files: File[];
    published_date: string;
}

enum ActionType {
    QueryChanged = 'QueryChanged',
    QueryLoading = 'QueryLoading',
    QueryDone = 'QueryDone',
    QueryFail = 'QueryFail',
    SetPage = 'SetPage',

    ArticleLoading = 'ArticleLoading',
    ArticleFail = 'ArticleFail',
    ArticleDone = 'ArticleDone',
}

export interface SearchAction extends NamedAction {
    type: ActionType;
    storeName: string;
}

interface QueryLoadingAction extends SearchAction {
    query: string;
    page: number;
}

export const QueryLoading = (query: string, page: number): QueryLoadingAction => {
    return {
        type: ActionType.QueryLoading,
        storeName: storeName,
        query: query,
        page: page
    };
};

interface QueryChangedAction extends SearchAction {
    query: string;
}

export const QueryChanged = (query: string): QueryChangedAction => {
    return {
        type: ActionType.QueryChanged,
        storeName: storeName,
        query: query
    };
};

interface QueryFailAction extends SearchAction {}

export const QueryFail = (): QueryFailAction => {
    return {
        type: ActionType.QueryFail,
        storeName: storeName
    };
};

interface QueryDoneAction extends SearchAction {
    results: Result[];
}

export const QueryDone = (results: Result[]): QueryDoneAction => {
    return {
        type: ActionType.QueryDone,
        storeName: storeName,
        results: results
    };
};

interface PaginationAction extends SearchAction {
    page: number;
}

export const Paginated = (page: number): PaginationAction => {
    return {
        type: ActionType.SetPage,
        storeName: storeName,
        page: page
    };
};

interface ArticleLoadingAction extends SearchAction {
    id: string;
}

export const ArticleLoading = (id: string): ArticleLoadingAction => {
    return {
        type: ActionType.ArticleLoading,
        storeName: storeName,
        id: id
    };
};

interface ArticleFailAction extends SearchAction {}

export const ArticleFail = (): ArticleFailAction => {
    return {
        type: ActionType.ArticleFail,
        storeName: storeName
    };
};

interface ArticleDoneAction extends SearchAction {
    article: Article;
}

export const ArticleDone = (article: Article): ArticleDoneAction => {
    return {
        type: ActionType.ArticleDone,
        storeName: storeName,
        article: article
    };
};

const queryChangedReducer = (s: SearchState, a: QueryChangedAction) => {
    return { ...s, query: a.query };
};

const queryLoadingReducer = (s: SearchState, a: QueryLoadingAction) => {
    return { ...s, isQuerying: true, page: a.page, query: a.query };
};

const queryDoneReducer = (s: SearchState, a: QueryDoneAction) => {
    return { ...s, isQuerying: false, isQueryError: false, results: a.results };
};

const queryFailReducer = (s: SearchState) => {
    return { ...s, isQuerying: false, isQueryError: true, results: undefined };
};

const paginationReducer = (s: SearchState, a: PaginationAction) => {
    return { ...s, page: a.page };
};

const articleLoadingReducer = (s: SearchState, a: ArticleLoadingAction) => {
    return { ...s, isFetchingArticle: true, articleId: a.id };
};

const articleDoneReducer = (s: SearchState, a: ArticleDoneAction) => {
    return { ...s, isFetchingArticle: false, isArticleError: false, curArticle: a.article };
};

const articleFailReducer = (s: SearchState) => {
    return { ...s, isFetchingArticle: false, isArticleError: true, article: undefined };
};

export const reducer: NamedReducer<SearchState> = (s: SearchState, a: NamedAction): SearchState => {
    switch (a.type) {
        case ActionType.QueryChanged:
            return queryChangedReducer(s, a as QueryChangedAction);
        case ActionType.QueryLoading:
            return queryLoadingReducer(s, a as QueryLoadingAction);
        case ActionType.QueryDone:
            return queryDoneReducer(s, a as QueryDoneAction);
        case ActionType.QueryFail:
            return queryFailReducer(s);
        case ActionType.SetPage:
            return paginationReducer(s, a as PaginationAction);
        case ActionType.ArticleLoading:
            return articleLoadingReducer(s, a as ArticleLoadingAction);
        case ActionType.ArticleDone:
            return articleDoneReducer(s, a as ArticleDoneAction);
        case ActionType.ArticleFail:
            return articleFailReducer(s);
        default:
            throw new Error('Unknown SearchAction: ' + a.type);
    }
};