global.express = require('express');
global.app = express();
global.colors = require('colors');
global.fastBomber = require('./modules/sms.js');
global.mongoose = require('mongoose');
global.moment = require('moment');
global.Schema = mongoose.Schema;
global.bodyParser = require('body-parser');
global.config = require('./config.js');
global.cron = require('node-cron');
global.cookieParser = require('cookie-parser');
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', () => {
    console.log(`MongoDB Connected`.green);
});

global.userModel = require('./models/user.js');
global.limitModel = require('./models/limit.js');

cron.schedule('0 0 * * *', async () => {
    await limitModel.deleteMany({});
    console.log(`Limitler Sifirlandi`.green);
});

require('./routers/router.js')(this);

(async () => {
    const umail = 'fastuptime@gmail.com';
    const check = await userModel.findOne({ email: umail });
    if (check) return;
    new userModel({
        name: 'Admin',
        email: umail,
        role: 'admin',
        password: 'admin',
    }).save();
})();

app.listen(80, () => {
    console.log(`Fast SMS Bomber Started`.green);
});