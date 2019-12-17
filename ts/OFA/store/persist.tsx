const LOCALSTORAGE_ITEM = 'ofa_redux_state';

export function getInitialState() {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_ITEM);
    if (saved) {
      return JSON.parse(saved) || {};
    }
  } catch (err) {
    console.warn('GetInitialState Error:', err);
  }

  return {};
}

export function subscribePersister(storeInstance: any) {
  return storeInstance.subscribe(() => {
    try {
      const state = storeInstance.getState();
      // console.log('STATE UPDATE', JSON.parse(JSON.stringify(state)));
      localStorage.setItem(LOCALSTORAGE_ITEM, JSON.stringify(state));
    } catch (err) {
      console.warn('Error persisting ofaStore:', err);
    }
  });
}
