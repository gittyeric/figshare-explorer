import { KeyboardEvent, FormEvent } from 'react';
import * as React from 'react';
import { Search } from './search';
import createPagination from '../pagination/pagination-ui';
import { Route } from 'react-router';

export class SearchResults extends React.Component {

    render() {
        const pagination = createPagination(Search);

        return (
                <div id="search">
                    <h1 id="title">asdf</h1>
                    <ol className="search_results">
                        <br />
                    </ol>
                    {pagination}
                </div>
        );
    }
}

export const SearchBar = () => {

    var inputQuery = '';

    const onSearchChange = (event: KeyboardEvent<HTMLInputElement> | undefined) => {
        const e = event as KeyboardEvent<HTMLInputElement>;
        inputQuery = e.currentTarget.value;
    };

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        Search.find(inputQuery);
        e.stopPropagation();

        return false;
    };

    const inputProps = {
        className: 'search',
        type: 'text',
        placeholder: 'Find Research'
    };

    return (
        <Route>
        <form className="clear" onSubmit={onFormSubmit}>
            <input {...inputProps} onKeyDown={onSearchChange} />
            <button type="submit">Search</button>
        </form>
        </Route>
    );

};