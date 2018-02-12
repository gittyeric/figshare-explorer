import * as React from 'react';
// import * as Redux from 'react-redux';
import {
  Route,
  Link,
  BrowserRouter
} from 'react-router-dom';
import './bootstrap.css';
import './app.css';
import '../search/search.css';
import { SearchResults, asSearchProps } from '../search/search-ui';
import { RouteComponentProps } from 'react-router';
import SearchService from 'src/services/search/search';
import ArticleService from 'src/services/article/article';
import SuggestService from 'src/services/suggest/suggest';
import { ArticleView, asArticleProps } from 'src/services/article/article-ui';
import { Homepage } from 'src/services/app/home';
import { About } from 'src/services/app/about';

// Constants
const FIGSHARE_API = 'https://api.figshare.com/v2';
const FREQL_API = 'https://papersearch.org';

// Services
const Search = new SearchService(FIGSHARE_API);
const Articles = new ArticleService(FIGSHARE_API);
const Suggestions = new SuggestService(FREQL_API);

// Bind components to services

// tslint:disable-next-line:no-any
const SearchProps = (props: RouteComponentProps<any>) => 
  asSearchProps(props, Search);
// tslint:disable-next-line:no-any
const ArticleProps = (props: RouteComponentProps<any>) => 
  asArticleProps(props, Suggestions, Articles);

// Components

const Header = () => (
  <header>
    <div className="navbar navbar-default">
      <div className="navbar-header">
        <ul className="nav navbar-nav">
          <li className="active"><Link to="/">Paper Search</Link></li>
          <li className="active"><Link to="/about">About</Link></li>
        </ul>
      </div>
    </div>
  </header>
);

const App = () => (
  <BrowserRouter>
    <div>

      <Header />

      <Route path="/" exact={true} render={(props) => (<Homepage {...SearchProps(props)} />)} />
      <Route path="/about" exact={true} component={About} />
      <Route path="/search/:query" render={(props) => (<SearchResults {...SearchProps(props)} />)} />
      <Route path="/article/:id" render={(props) => (<ArticleView {...ArticleProps(props)} />)} />

    </div>
  </BrowserRouter>
);

export default App;