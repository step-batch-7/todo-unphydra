/* eslint-disable no-unused-vars */
const get = function(url, callback) {
  const req = new XMLHttpRequest();
  req.onload = () => {
    callback(req);
  };
  req.open('GET', url);
  req.responseType = 'json';
  req.send();
};

const post = function(url, data, callback) {
  const req = new XMLHttpRequest();
  req.onload = () => {
    callback(req);
  };
  req.open('POST', url);
  req.responseType = 'json';
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(data);
};
