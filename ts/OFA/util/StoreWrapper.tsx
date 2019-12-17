import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { storeInstance } from '../store/index';

export function wrapWithReduxStoreOnElem(element: Element, ComponentClass: React.ComponentClass, props: any = {}) {
  const Instance = React.createElement(ComponentClass, props);
  ReactDOM.render(
    <Provider store={storeInstance}>
      {Instance}
    </Provider>,
    element
  );
}
