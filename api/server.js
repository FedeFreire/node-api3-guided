const express = require('express'); // importing a CommonJS module
const morgan = require('morgan'); // third party middleware
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function customMorgan(req, res, next) { //logger middleware
  console.log(`it was a ${req.method} request`);
  next();
}

function shortCircuit(req, res, next) {
  res.json('you shall not pass!');
}

function addFriends(req, res, next) {
  req.friends = ['mary', 'sue', 'bob'];
  next();
}

server.use(express.json());
server.use(morgan('dev'));
server.use(customMorgan);
//server.use(shortCircuit);
server.use(addFriends);


server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API ${req.friends}</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
