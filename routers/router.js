module.exports = function () {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.set('views', './views');
    
    global.checkAuth = async (req, res, next) => {
        if (!req.cookies.key || !req.cookies.user) return res.redirect('/auth/login?error=true&message=Lütfen Giriş Yapınız');
        const user = await userModel.findOne({ _id: req.cookies.user });
        if (!user) return res.redirect('/auth/login?error=true&message=Lütfen Giriş Yapınız');
        if (user.key != req.cookies.key) return res.redirect('/auth/login?error=true&message=Lütfen Giriş Yapınız');
        res.locals.user = user;
        res.locals.logs = user.logs.reverse();
        next();
    }

    global.adminAuth = async (req, res, next) => {
        const user = await userModel.findOne({ _id: req.cookies.user });
        if (!user) return res.redirect('/auth/login?error=true&message=Lütfen Giriş Yapınız');
        if(user.role == "admin") {
            next();
        } else {
            res.redirect('/panel?error=true&message=Yetkiniz Yok');
        }
    }
    
    app.use('/assets', express.static('assets'));
    app.use('/api', require('./api.js'));
    app.use('/auth', require('./auth.js'));
    app.use('/panel', require('./panel.js'));
    app.use('/admin', require('./admin.js'));
    app.get('/', (req, res) => {
        res.render('index', { config: config });
    });

    app.get('/discord', (req, res) => {
        res.redirect(config.discord);
    });
}
