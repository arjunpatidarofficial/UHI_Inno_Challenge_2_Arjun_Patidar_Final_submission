import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CometChat } from '@cometchat-pro/chat';
import { COMETCHAT_CONSTANTS } from './consts';
import reducer from './store/reducer';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducer, compose(applyMiddleware(thunk)));

var appID = COMETCHAT_CONSTANTS.APP_ID;
var region = COMETCHAT_CONSTANTS.REGION;

var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();
CometChat.init(appID, appSetting).then(
  () => {
    if (CometChat.setSource) {
      CometChat.setSource('ui-kit', 'web', 'reactjs');
    }
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  },
  (error) => {
    console.log('Initialization failed with error:', error);
  }
);
serviceWorker.unregister();
