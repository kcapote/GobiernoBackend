const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

//import of controllers
const categoryController = require('./controllers/categoryController');
const ruleController = require('./controllers/ruleController');
const ruleHistController = require('./controllers/ruleHistController');
const manualController = require('./controllers/manualController');
const manualHistController = require('./controllers/manualHistController');
const userController = require('./controllers/userController');
const noticeController = require('./controllers/noticeController');
const securityController = require('./controllers/securityController');
const statsController = require('./controllers/statsController');

//Connect mongoose to our database
mongoose.connect(config.database);

//Declaring Port
const port = 3000;

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send("Invalid page");
})


//Routing all HTTP requests to all controllers
app.use('/category', categoryController);
app.use('/rule', ruleController);
app.use('/ruleHist', ruleHistController);
app.use('/manual', manualController);
app.use('/manualHist', manualHistController);
app.use('/user', userController);
app.use('/notice', noticeController);
app.use('/security', securityController);
app.use('/stats', statsController);


//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});