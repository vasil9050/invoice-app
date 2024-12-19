require('./config/db')
const express = require('express');
const port = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', require('./routes/authRoute'));
app.use('/api/v1/page', require('./routes/pageRoutes'));

app.listen(port, () => {
  console.log('running at port', port);
});
