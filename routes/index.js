"use strict";

module.exports = function(router, lib, models, controllers) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', {title: 'Storyline'});
  });

  return router;
};
