import * as React from 'react';
import { SearchProps, SearchBar, asSearchProps } from 'src/services/search/search-ui';
import SearchService from 'src/services/search/search';
import { Route } from 'react-router';

// tslint:disable-next-line:no-any
export class Homepage extends React.Component<SearchProps> {

  private search: SearchService;

  constructor(params: SearchProps) {
    super(params);
    this.search = params.search;
  }

  render() {
    return (
      <div className="home">
        <h1>Search For Research Whitepapers</h1>
        <div className="main_search">
          <Route render={(props) => (<SearchBar {...asSearchProps(props, this.search)} /> )} />
      </div>
      </div>);
  }

}