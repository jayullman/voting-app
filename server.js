const express = require('express');
const path = require('path');


const app = express();

// connect to mongoose database
const connectToDb = require('./controllers/connectToDb');
connectToDb();

const port = process.env.PORT || 3000;

// set up static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server', 'static')));

// set up app and passport
const configureApp = require('./controllers/configureApp');
configureApp(app);


const passport = require('passport');










const apiRoutes = require('./server/routes/apiRoutes');
app.use(apiRoutes);

app.get('/', (req, res) => {
  console.log('test');
  res.sendFile('index.html');
});

app.listen(port, () => {
  console.log(`App is listening on port: ${ port }`);
});
