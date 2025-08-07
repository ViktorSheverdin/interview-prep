/**
 * @callback func
 * @param {number} wait
 * @return {Function}
 */
function throttle(func, wait) {
  let isThr = false;

  return function (...args) {
    if (!isThr) {
      func.apply(this, args);
      isThr = true;

      setTimeout(() => {
        isThr = false;
      }, wait);
    }
  };
}

function logMessage(message) {
  console.log(`${message} at ${new Date().toISOString()}`);
}

// Create a throttled version of the function with a 2-second interval
const throttledLogMessage = throttle(logMessage, 2000);

// Simulate rapid function calls
throttledLogMessage('Call 1');
setTimeout(() => throttledLogMessage('Call 2'), 500);
setTimeout(() => throttledLogMessage('Call 3'), 1000);
setTimeout(() => throttledLogMessage('Call 4'), 1500);
setTimeout(() => throttledLogMessage('Call 5'), 2500);
setTimeout(() => throttledLogMessage('Call 6'), 3000);
