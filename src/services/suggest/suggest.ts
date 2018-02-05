import * as $ from 'jquery';

const FREQL_API = 'https://papersearch.org';

export enum ItemType {
    ALL = 'all',
    TAG = 'tags',
    CATEGORY = 'cats',
    GROUP = 'groups',
    REFERENCE = 'refs',
}

export const suggestArticlesBy = (articleId: Number, byItemType: ItemType, limit = 10) => {
    return $.ajax({
        url: FREQL_API + '/query/for/' + byItemType,
        method: 'get',
        data: { id: articleId, limit: limit }
    });
};