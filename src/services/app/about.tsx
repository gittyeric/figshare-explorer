import * as React from 'react';

const FREQL_GIT = 'https://github.com/gittyeric/freql-recommendation-engine';

export const About = () => (
  <div className="page">
    <h2>About</h2>
    <p>So far, this is mostly a demo site for 
      the <a href={FREQL_GIT} target="_blank">FREQL Recommendation Engine</a> and 
      also uses awesome <a href="https://docs.figshare.com" target="_blank">Figshare APIs</a> to 
      help with research discovery.</p>
  </div>
);