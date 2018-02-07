import { ReactElement, MouseEvent } from 'react';
import * as React from 'react';

export interface Page<RESULT> {
    page: number;
    pageSize: number;
    results?: Array<RESULT>;
}

export interface Pagable<RESULT> {
    getPage: () => Page<RESULT>;
    paginate: (page: number) => Promise<Page<RESULT>>;
}

export default class Pagination<RESULT> extends React.Component {

    pagable: Pagable<RESULT>;

    constructor(pagable: Pagable<RESULT>) {
        super({});
        this.pagable = pagable;
    }

    pageClicked(newPage: number) {
        return (e: MouseEvent<HTMLAnchorElement>) => {
            const promisedPage = this.pagable.paginate(newPage);
            promisedPage.then((page) => {
                this.render();
            });
            return false;
        };
    }

    render() {
        const page = this.pagable.getPage();
        const firstVisible = Math.max(1, page.page - 2);
        const isNextPage =
            page.results && page.results.length === page.pageSize;

        const nextBtn = isNextPage ?
            <li id="next"><a onClick={this.pageClicked(page.page + 1)}>»</a></li> : null;
        const prevBtn = page.page > 1 ?
            <li id="prev"><a onClick={this.pageClicked(page.page - 1)}>«</a></li> : null;

        const generatePageElements = () => {
            const pageElements: ReactElement<HTMLLIElement>[] = [];
            for (var i: number = 0; i < 5; i++) {
                // const active = (i + firstVisible) === page.page ? 'active' : '';
                const iPage = firstVisible + i;

                pageElements.push(
                    <li className="num {active}">
                        <a onClick={this.pageClicked(iPage)}>{iPage}</a>
                    </li>);
            }

            return pageElements;
        };

        return (
            <ul className="pagination">
                {prevBtn}
                {generatePageElements()}
                {nextBtn}
            </ul>
        );
    }
}

/*export default function createPagination<PAGE>(pagable: Pagable<PAGE>): Pagination<PAGE> {
    return new Pagination(pagable);
}*/