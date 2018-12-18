import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/Components/Main';
import {Provider} from "react-redux";
import store from "./js/store"
import "./css/main.css"
import "./public/raven.jpg"
import "./public/raven.webm"

let HTML = 
    <Provider store={store}>
        <App/>
    </Provider>
;

ReactDOM.render(HTML, document.getElementById('root'));

