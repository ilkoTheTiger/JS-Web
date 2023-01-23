const express = require('express');

const config = require('./config');
// require('./config/viewEngine')(app); Short way
const setupViewEngine = require('./config/viewEngine');

const app = express();
setupViewEngine(app);

app.use(express.static('src/public'))

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}`));