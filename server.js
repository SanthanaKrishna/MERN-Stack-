const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

//Init Middleware
//app.use(bodyParser.urlencoded({ extended: false })); 
//using express.json() instead of bodyParser
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

/**
 * Define Routes
 */
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

/**
 * process.env.PORT
 * looking for enviroment called port to use roku
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => {
  console.log(`Server started on port ${PORT}`);
});
