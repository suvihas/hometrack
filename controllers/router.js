var action = require('../action');

module.exports = function(app) {
  app.post('/filterData', action.filter()); 
};