const router = require('express').Router();

router.get('/', adminAuth, async (req, res) => {
    res.render('admin', {
        config: config,
        users: await userModel.find({}).sort({ created_at: -1 })
    });
});

router.get('/role/:role/:id', adminAuth, async (req, res) => {
    let {
        role,
        id
    } = req.params;

    let roles = ["user", "vip", "admin"];
    if (!role || !id) return res.redirect('/admin?error=true&message=Hata Oluştu');
    if (!roles.includes(role)) return res.redirect('/admin?error=true&message=Hata Oluştu');
    if(id.length != 24) return res.redirect('/admin?error=true&message=Hata Oluştu');
    await userModel.updateOne({ _id: id }, { $set: { role: role } });
    res.redirect('/admin?success=true&message=Yetki Değiştirildi');
});

router.get('/spamlogs/:id', adminAuth, async (req, res) => {
    let {
        id
    } = req.params;
    if (!id && id != 24) return res.redirect('/admin?error=true&message=Hata Oluştu');
    const user = await userModel.findOne({ _id: id });
    if (!user) return res.redirect('/admin?error=true&message=Kullanıcı Bulunamadı');
    res.json(user.logs.reverse());
});

router.get('/delete/:id', adminAuth, async (req, res) => {
    let {
        id
    } = req.params;
    if (!id && id != 24) return res.redirect('/admin?error=true&message=Hata Oluştu');
    const user = await userModel.findOne({ _id: id });
    if (!user) return res.redirect('/admin?error=true&message=Kullanıcı Bulunamadı');
    await userModel.deleteOne({ _id: id });
    res.redirect('/admin?success=true&message=Kullanıcı Silindi');
});

router.post('/adduser', adminAuth, async (req, res) => {
    let {
        name,
        email,
        password
    } = req.body;
    if (!name || !email || !password) return res.redirect('/admin?error=true&message=Hata Oluştu');
    if (password.length < 6) return res.redirect('/admin?error=true&message=Şifre 6 Karakterden Az Olamaz');
    const userCheck = await userModel.findOne({ email: email });
    if (userCheck) return res.redirect('/admin?error=true&message=Kullanıcı Zaten Var');

    new userModel({
        name: name,
        email: email,
        password: password,
    }).save();
    res.redirect('/admin?success=true&message=Kullanıcı Eklendi');
});

module.exports = router;