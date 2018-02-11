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
import { SearchBar, SearchResults, ArticleView } from '../search/search-ui';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-any
const HomePage: React.SFC<RouteComponentProps<any>> = () => {

  return (
    <div className="home">
      <h1>Search For Research Whitepapers</h1>
      <div className="main_search">
        <Route component={SearchBar} />
      </div>
    </div>);
};

const FREQL_GIT = 'https://github.com/gittyeric/freql-recommendation-engine';
const About = () => (
  <div className="page">
    <h2>About</h2>
    <p>So far, this is mostly a demo site for 
      the <a href={FREQL_GIT} target="_blank">FREQL Recommendation Engine</a> and 
      also uses awesome <a href="https://docs.figshare.com" target="_blank">Figshare APIs</a> to 
      help with research discovery.</p>
  </div>
);

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

      <Route path="/" exact={true} component={HomePage} />
      <Route path="/about" exact={true} component={About} />
      <Route path="/search/:query" component={SearchResults} />
      <Route path="/article/:id" component={ArticleView} />

    </div>
  </BrowserRouter>
);

export default App;