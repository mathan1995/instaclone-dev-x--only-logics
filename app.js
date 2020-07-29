const express = require('express');
//az2glFVU4HQPPG2U
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;

const { MONGOURI } = require('./keys');

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('connected to mongo Yeah !!');
});
mongoose.connection.on('error', (err) => {
  console.log('error connecting ! ', err);
});

app.listen(PORT, () => {
  console.log('Server is running successfully !! at Port ' + PORT);
});

require('./models/user');
require('./models/posts');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/posts'));
app.use(require('./routes/user'));

/*
Middleware is something or a bunchof code which takes the incomming request and it modifies it before reaches to routed
user -> get request 

in this way this middleware is call first and then the other call backs are fired

*/
