import * as $ from 'jquery';
import { ItemType, SuggestState, SuggestAction, ItemTypeState, storeName, 
    reducer, SuggestionsLoading, SuggestionTypeDone, Suggestions, 
    SuggestionTypeFail } from 'src/services/suggest/actions';
import { StatefulService } from 'src/services/stateful-service';

const FREQL_API = 'https://papersearch.org';

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

const suggestArticlesByAll = (articleId: string, limit: number) => {
    return $.ajax({
        url: FREQL_API + '/query/by/' + ItemType.ALL,
        method: 'get',
        data: { id: articleId, limit: limit }
    });
};

const suggestItemsForArticle = (articleId: string, itemType: ItemType, limit: number) => {
    return $.ajax({
        url: FREQL_API + '/query/for/' + itemType,
        method: 'get',
        data: { id: articleId, limit: limit }
    });
};

export default class SuggestService extends StatefulService<SuggestState, SuggestAction> {

    constructor() {
        super(storeName, reducer, initState);
    }

    loadArticleSuggestions(articleId: string) {
        this.dispatch(SuggestionsLoading(articleId));

        this.dispatchAfterPending(ItemType.PAPER, suggestArticlesByAll(articleId, 10));
        this.dispatchAfterPending(ItemType.AUTHOR, suggestItemsForArticle(articleId, ItemType.AUTHOR, 10));
        this.dispatchAfterPending(ItemType.CATEGORY, suggestItemsForArticle(articleId, ItemType.CATEGORY, 10));
        this.dispatchAfterPending(ItemType.TAG, suggestItemsForArticle(articleId, ItemType.TAG, 10));
    }

    private dispatchAfterPending(itemType: ItemType, request: JQueryXHR) {
        request.then((result) => {
            this.dispatch(SuggestionTypeDone(itemType, result as Suggestions));
        }).fail( (error) => {
            this.dispatch(SuggestionTypeFail(itemType));
        } );
    }

}