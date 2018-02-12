import { NamedReducer, NamedAction } from '../../state';

export const storeName = 'suggest';

export enum ItemType {
    ALL = 'all',
    PAPER = 'papers',
    TAG = 'tags',
    CATEGORY = 'cats',
    GROUP = 'groups',
    AUTHOR = 'authors',
    REFERENCE = 'refs',
}

export interface Suggestions {
    scores: LinkedScore[];
}

export interface Score {
    id: string;
    score: number;
}

export interface LinkedScore extends Score {
    name: string;
    link: string;
}

export interface ItemTypeState {
    isLoading: boolean;
    isError: boolean;
    suggested?: Suggestions;
}

export interface SuggestState {
    articleId?: string;
    papers: ItemTypeState;
    tags: ItemTypeState;
    categories: ItemTypeState;
    authors: ItemTypeState;
    groups: ItemTypeState;
}

enum ActionType {

    SuggestionsLoading = 'SuggestionsLoading',
    SuggestionTypeDone = 'SuggestionTypeDone',
    SuggestionTypeFail = 'SuggestionTypeFail',

}

export interface SuggestAction extends NamedAction {
    type: ActionType;
    storeName: string;
}

interface SuggestionsLoadingAction extends SuggestAction {
    articleId: string;
}

export const SuggestionsLoading = (articleId: string): SuggestionsLoadingAction => {
    return {
        type: ActionType.SuggestionsLoading,
        storeName: storeName,
        articleId: articleId
    };
};

interface SuggestionTypeFailAction extends SuggestAction {
    itemType: ItemType;
}

export const SuggestionTypeFail = (itemType: ItemType): SuggestionTypeFailAction => {
    return {
        type: ActionType.SuggestionTypeFail,
        storeName: storeName,
        itemType: itemType
    };
};

interface SuggestionTypeDoneAction extends SuggestAction {
    itemType: ItemType;
    results: Suggestions;
}

export const SuggestionTypeDone = <I extends ItemType>
    (itemType: I, results: Suggestions): SuggestionTypeDoneAction => {
    return {
        type: ActionType.SuggestionTypeDone,
        storeName: storeName,
        results: results,
        itemType: itemType
    };
};

const getSuggestionTypeState = <I extends ItemType>
    (state: SuggestState, itemType: I): ItemTypeState => {
    switch (itemType) {
        case ItemType.AUTHOR:
            return { ...state.authors };
        case ItemType.CATEGORY:
            return { ...state.categories };
        case ItemType.GROUP:
            return { ...state.groups };
        case ItemType.PAPER:
            return { ...state.papers };
        case ItemType.TAG:
            return { ...state.tags };
        default:
            throw new Error('Unknown ItemType: ' + itemType);
    }
};

const setSuggestionTypeState = <I extends ItemType>
    (state: SuggestState, itemType: I, itemState: ItemTypeState): void => {
    switch (itemType) {
        case ItemType.AUTHOR:
            state.authors = itemState; break;
        case ItemType.CATEGORY:
            state.categories = itemState; break;
        case ItemType.GROUP:
            state.groups = itemState; break;
        case ItemType.PAPER:
            state.papers = itemState; break;
        case ItemType.TAG:
            state.tags = itemState; break;
        default:
            throw new Error('Unknown ItemType: ' + itemType);
    }
};

const suggestionsLoadingReducer = (s: SuggestState, a: SuggestionsLoadingAction) => {
    var newState = { ... s };
    newState.articleId = a.articleId;
    newState.authors.isLoading = true;
    newState.categories.isLoading = true;
    newState.groups.isLoading = true;
    newState.papers.isLoading = true;
    newState.tags.isLoading = true;
    return newState;
};

const suggestionTypeDoneReducer = (s: SuggestState, a: SuggestionTypeDoneAction) => {
    var newState = { ... s };
    var itemState = getSuggestionTypeState(newState, a.itemType);
    itemState.isError = false;
    itemState.isLoading = false;
    itemState.suggested = a.results;
    setSuggestionTypeState(newState, a.itemType, itemState);
    return newState;
};

const suggestionTypeFailReducer = (s: SuggestState, a: SuggestionTypeFailAction) => {
    var newState = { ... s };
    var itemState = getSuggestionTypeState(newState, a.itemType);
    itemState.isError = true;
    itemState.isLoading = false;
    itemState.suggested = undefined;
    setSuggestionTypeState(newState, a.itemType, itemState);
    return newState;
};

export const reducer: NamedReducer<SuggestState> = (s: SuggestState, a: NamedAction): SuggestState => {
    switch (a.type) {
        case ActionType.SuggestionsLoading:
            return suggestionsLoadingReducer(s, a as SuggestionsLoadingAction);
        case ActionType.SuggestionTypeDone:
            return suggestionTypeDoneReducer(s, a as SuggestionTypeDoneAction);
        case ActionType.SuggestionTypeFail:
            return suggestionTypeFailReducer(s, a as SuggestionTypeFailAction);
        default:
            throw new Error('Unknown SuggestAction: ' + a.type);
    }
};