const router = require('express').Router();

router.get('/login', (req, res) => {
    if (req.cookies.key && req.cookies.user) return res.redirect('/panel?error=true&message=Zaten Giris Yapilmis');
    res.render('login', { config: config });
});

router.post('/login', async (req, res) => {
    let {
        mail,
        pass
    } = req.body;
    if (!mail || !pass) return res.redirect('/auth/login?error=true&message=Lütfen Tüm Alanları Doldurunuz');
    let user = await userModel.findOne({ email: mail });
    if (!user) return res.redirect('/auth/login?error=true&message=Giriş Bilgileri Yanlış');
    if (user.password != pass) return res.redirect('/auth/login?error=true&message=Giriş Bilgileri Yanlış');

    res.cookie('key', user.key, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    res.redirect('/panel');
});

module.exports = router;