import * as $ from 'jquery';
import {
    ItemType, SuggestState, SuggestAction, ItemTypeState, storeName,
    reducer, SuggestionsLoading, SuggestionTypeDone, Suggestions,
    SuggestionTypeFail
} from 'src/services/suggest/actions';
import { StatefulService } from 'src/services/stateful-service';

const initTypeState: ItemTypeState = {
    isLoading: false,
    isError: false
};

const initState: SuggestState = {
    authors: initTypeState,
    categories: initTypeState,
    groups: initTypeState,
    papers: initTypeState,
    tags: initTypeState
};

export default class SuggestService extends StatefulService<SuggestState, SuggestAction> {

    private apiPrefix: string;

    constructor(apiPrefix: string) {
        super(storeName, reducer, initState);
        this.apiPrefix = apiPrefix;
    }

    loadArticleSuggestions(articleId: string) {
        this.dispatch(SuggestionsLoading(articleId));

        this.dispatchAfterPending(ItemType.PAPER,
                                  this.suggestArticlesByAll(articleId, 10));
        this.dispatchAfterPending(ItemType.AUTHOR,
                                  this.suggestItemsForArticle(articleId, ItemType.AUTHOR, 10));
        this.dispatchAfterPending(ItemType.CATEGORY,
                                  this.suggestItemsForArticle(articleId, ItemType.CATEGORY, 10));
        this.dispatchAfterPending(ItemType.TAG,
                                  this.suggestItemsForArticle(articleId, ItemType.TAG, 10));
    }

    private dispatchAfterPending(itemType: ItemType, request: JQueryXHR) {
        request.then((result) => {
            this.dispatch(SuggestionTypeDone(itemType, result as Suggestions));
        }).fail((error) => {
            this.dispatch(SuggestionTypeFail(itemType));
        });
    }

    private suggestArticlesByAll(articleId: string, limit: number) {
        return $.ajax({
            url: this.apiPrefix + '/query/by/' + ItemType.ALL,
            method: 'get',
            data: { id: articleId, limit: limit }
        });
    }

    private suggestItemsForArticle(articleId: string, itemType: ItemType, limit: number) {
        return $.ajax({
            url: this.apiPrefix + '/query/for/' + itemType,
            method: 'get',
            data: { id: articleId, limit: limit }
        });
    }

}