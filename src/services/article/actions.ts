import { NamedReducer, NamedAction } from '../../state';

export const storeName = 'article';

export interface ArticleState {
    isFetchingArticle: boolean;
    isArticleError: boolean;
    curArticleId?: string;
    curArticle?: Article;
}

export interface Article {
    id: string;
    title: string;
    description: string;
    categories: Category[];
    tags: string[];
    authors: Author[];
    files: File[];
    published_date: string;
    figshare_url: string;
}

export interface Author {
    id: string;
    full_name: string;
}

export interface File {
    download_url: string;
    name: string;
}

export interface Category {
    id: string;
    title: string;
}

enum ActionType {
    ArticleLoading = 'ArticleLoading',
    ArticleFail = 'ArticleFail',
    ArticleDone = 'ArticleDone',
}

export interface ArticleAction extends NamedAction {
    type: ActionType;
    storeName: string;
}

interface ArticleLoadingAction extends ArticleAction {
    id: string;
}

export const ArticleLoading = (id: string): ArticleLoadingAction => {
    return {
        type: ActionType.ArticleLoading,
        storeName: storeName,
        id: id
    };
};

interface ArticleFailAction extends ArticleAction {}

export const ArticleFail = (): ArticleFailAction => {
    return {
        type: ActionType.ArticleFail,
        storeName: storeName
    };
};

interface ArticleDoneAction extends ArticleAction {
    article: Article;
}

export const ArticleDone = (article: Article): ArticleDoneAction => {
    return {
        type: ActionType.ArticleDone,
        storeName: storeName,
        article: article
    };
};

const articleLoadingReducer = (s: ArticleState, a: ArticleLoadingAction) => {
    return { ...s, isFetchingArticle: true, articleId: a.id };
};

const articleDoneReducer = (s: ArticleState, a: ArticleDoneAction) => {
    return { ...s, isFetchingArticle: false, isArticleError: false, curArticle: a.article };
};

const articleFailReducer = (s: ArticleState) => {
    return { ...s, isFetchingArticle: false, isArticleError: true, article: undefined };
};

export const reducer: NamedReducer<ArticleState> = (s: ArticleState, a: NamedAction): ArticleState => {
    switch (a.type) {
        case ActionType.ArticleLoading:
            return articleLoadingReducer(s, a as ArticleLoadingAction);
        case ActionType.ArticleDone:
            return articleDoneReducer(s, a as ArticleDoneAction);
        case ActionType.ArticleFail:
            return articleFailReducer(s);
        default:
            throw new Error('Unknown ArticleAction: ' + a.type);
    }
};