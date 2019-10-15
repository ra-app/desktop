/* eslint-disable no-empty */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

'use strict';

/* eslint strict: ["error", "global"] */
async function parallel(num, arr, func) {
  const thread = (item) => {
    if (!item) return;
    return func(item) // eslint-disable-line consistent-return, more/no-then
      .catch(err => {
        console.error('Error in parallel, should be handled in func!', err);
        return true;
      })
      .then(() => { // eslint-disable-line consistent-return
        if (arr.length) return thread(arr.shift());
      });
  }
  const promises = []; // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; ++i) promises.push(thread(arr.shift()));
  await Promise.all(promises);
}