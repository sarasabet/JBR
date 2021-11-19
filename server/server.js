const PORT = 3001;
const express = require('express');
const morgan = require ('morgan');
const cors = require('cors');
const dogsController = require('./controllers/dogs-controller')

const app = express();

app.use(cors()) // CORS middleware useage
app.use(morgan('dev'));

app.use(cors({
  origins: 'http://localhost:3000/',
  optionsSuccessStatus: 200 
}));

app.use('/dogs', dogsController)
// app.use('/', homePage)

app.listen(PORT , console.log(`Server isslistening on port ${PORT}`))
