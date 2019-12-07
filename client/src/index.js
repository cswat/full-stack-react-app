// Entry point into the application which renders the main App component

import React from 'react';
import ReactDOM from 'react-dom';

// CSS files
import './styles/global.css';
import './styles/index.css';

//Provider component
import { Provider } from './Context';

// App component
import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
