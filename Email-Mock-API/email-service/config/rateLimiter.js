let requests = 0;
const LIMIT = 2;

const interval = setInterval(() => {
  requests = 0;
}, 60000);

module.exports = {
  allow: () => {
    if (requests >= LIMIT) return false;
    requests++;
    return true;
  },
  clear: () => clearInterval(interval) 
};