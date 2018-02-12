import { NamedReducer, NamedAction } from '../../state';
import { Page } from '../pagination/pagination-ui';

export const storeName = 'search';

export interface SearchState extends Page<Result> {
    page: number;
    pageSize: number;
    isQuerying: boolean;
    isQueryError: boolean;
    queryMatchesResults: boolean;
    query: string;
    results?: Array<Result>;
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

export interface Result {
    id: string;
    title: string;
    description: string;
    categories: Category[];
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

const queryChangedReducer = (s: SearchState, a: QueryChangedAction) => {
    return { ...s, query: a.query, queryMatchesResults: false };
};

const queryLoadingReducer = (s: SearchState, a: QueryLoadingAction) => {
    return { ...s, isQuerying: true, queryMatchesResults: true, page: a.page, query: a.query };
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
       default:
            throw new Error('Unknown ArticleAction: ' + a.type);
    }
};