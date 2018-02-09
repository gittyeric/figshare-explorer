import { NamedReducer, NamedAction } from '../../state';
import { Page } from '../pagination/pagination-ui';
import { exec } from 'child_process';

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

export interface Suggestions<I extends ItemType> {
    scores: Score[];
}

export interface Score {
    id: string;
    score: number;
}

export interface ItemTypeState<I extends ItemType> {
    isLoading: boolean;
    isError: boolean;
    suggested?: Suggestions<I>;
}

export interface SuggestState {
    articleId: string;
    papers: ItemTypeState<ItemType.PAPER>;
    tags: ItemTypeState<ItemType.TAG>;
    categories: ItemTypeState<ItemType.CATEGORY>;
    authors: ItemTypeState<ItemType.AUTHOR>;
    groups: ItemTypeState<ItemType.GROUP>;
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

interface SuggestionTypeDoneAction<I extends ItemType> extends SuggestAction {
    itemType: I;
    results: Suggestions<I>;
}

export const SuggestionTypeDone = <I extends ItemType>
    (itemType: I, results: Suggestions<I>): SuggestionTypeDoneAction<I> => {
    return {
        type: ActionType.SuggestionTypeDone,
        storeName: storeName,
        results: results,
        itemType: itemType
    };
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

const suggestionTypeDoneReducer = <I extends ItemType>(s: SuggestState, a: SuggestionTypeDoneAction<I>) => {
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

const getSuggestionTypeState = <I extends ItemType>
    (state: SuggestState, itemType: I): ItemTypeState<I> => {
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
    (state: SuggestState, itemType: I, itemState: ItemTypeState<I>): void => {
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

export const reducer: NamedReducer<SuggestState> = (s: SuggestState, a: NamedAction): SuggestState => {
    switch (a.type) {
        case ActionType.SuggestionsLoading:
            return suggestionsLoadingReducer(s, a as SuggestionsLoadingAction);
        case ActionType.SuggestionTypeDone:
            return suggestionTypeDoneReducer(s, a as SuggestionTypeDoneAction<ItemType>);
        case ActionType.SuggestionTypeFail:
            return suggestionTypeFailReducer(s, a as SuggestionTypeFailAction);
        default:
            throw new Error('Unknown SuggestAction: ' + a.type);
    }
};