/**
 * Created by toma on 23.09.16..
 */
'use strict';

const Oodler = require('../models/oodler')

function create(request, response) {

  var oodler = new Oodler({
    firstName: request.payload.firstName,
    lastName: request.payload.lastName,
    email: request.payload.email,
    office: request.payload.office
  });

  oodler
    .save()
    .then((result) => {
      response(result).code(201);
    })
    .catch((err) => {
      response(err.message).code(500);
    });
}

let routes = [{
  method: 'POST',
  path: '/oodler',
  handler: create
}];

module.exports = function (server) {
  server.route(routes);
};