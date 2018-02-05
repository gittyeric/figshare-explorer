import * as React from 'react';
// import * as Redux from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import './bootstrap.css';
import './app.css';
import '../search/search.css';
import { SearchBar, SearchResults } from '../search/search-ui';

const HomePage = () => {

  return (
    <div>
      <div className="main_search">
        <SearchBar />
      </div>
    </div>);
};

const About = () => (
  <div>
    <h2>About</h2>
    So far, just a simple project that uses Figshare APIs and a recommendation engine to help with research visibility.
  </div>
);

const Header = () => (
  <header>
    <div className="navbar navbar-default">
      <div className="navbar-header">
        <ul className="nav navbar-nav">
          <li className="active"><Link to="/">Paper Finder</Link></li>
          <li className="active"><Link to="/about">About</Link></li>
        </ul>

      </div>
    </div>
  </header>
);

const App = () => (
  <Router>
    <div>

      <Header />

      <Route path="/" exact={true} component={HomePage} />
      <Route path="/about" exact={true} component={About} />
      <Route path="/search" component={SearchResults} />

    </div>
  </Router>
);

export default App;