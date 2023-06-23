const router = require('express').Router();
const axios = require('axios');

router.get('/v1', async (req, res) => {
    let {
        no,
        key,
        amount
    } = req.query;
    if (!no || !key || !amount) return res.json({ error: true, message: 'Lütfen Tüm Alanları Doldurunuz api?no=5551234567&key=XXXXX&amount=10' });
    const user = await userModel.findOne({ key: key });
    if(!user) return res.json({ error: true, message: 'Kullanici Bulunamadi' });
    if (no.length != 10) return res.json({ error: true, message: 'Telefon Numarasi 10 Haneli Olmalidir. Ex: 5401234521' });
    if (isNaN(amount)) return res.json({ error: true, message: 'Lütfen Bir Rakam Giriniz' });
    if (amount.length == 0) return res.json({ error: true, message: 'Miktar Giriniz' });
    
    let userLimit = await limitModel.findOne({ userID: user._id });
    if (!userLimit) {
        const newLimit = new limitModel({
            userID: user._id,
            count: 1,
        });
        await newLimit.save();
        userLimit = await limitModel.findOne({ userID: user._id });
    } 
    if (userLimit.count >= config.limits[user.role]) return res.json({ error: true, message: 'Günlük Limitiniz Dolmustur' });
    await limitModel.updateOne({ userID: user._id }, { $inc: { count: 1 } });
    user.logs.push({
        no: no,
        amount: amount * 11,
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });
    await user.save();

    fastBomber(no, amount);
    res.json({ error: false, message: 'SMS Gonderiliyor...' });
});

router.post('/send', checkAuth, async (req, res) => {
    const user = await userModel.findOne({ _id: req.cookies.user });
    let {
        number,
        amount
    } = req.body;
    if (!number || !amount) return res.json({ status: false, message: 'Lütfen Tüm Alanları Doldurunuz' });
    if (number.length != 10) return res.json({ status: false, message: 'Telefon Numarasi 10 Haneli Olmalidir. Ex: 5401234521' });

    let userLimit = await limitModel.findOne({ userID: user._id });
    if (!userLimit) {
        const newLimit = new limitModel({
            userID: user._id,
            count: 1,
        });
        await newLimit.save();
        userLimit = await limitModel.findOne({ userID: user._id });
    } 
    if (userLimit.count >= config.limits[user.role]) return res.json({ status: false, message: 'Günlük Limitiniz Dolmustur' });
    await limitModel.updateOne({ userID: user._id }, { $inc: { count: 1 } });
    user.logs.push({
        no: number,
        amount: amount * 11,
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    await user.save();

    fastBomber(number, amount);
    /*
    
    Config'deki API Sunucularını kullanmak için

    let servers = config.apiServers;
    let server = servers[Math.floor(Math.random() * servers.length)];
    let url = server + `?no=${number}&key=SERVER_API_KEY&amount=${amount}`;
    axios.get(url).then((response) => {
        if (response.data.error) return res.json({ status: false, message: response.data.message });
        res.json({ status: true, message: 'SMS Gonderiliyor...' });
    }).catch((err) => {
        res.json({ status: false, message: 'API Sunucuları Hata Veriyor' });
    });

    */
    res.json({ status: true, message: 'SMS Gonderiliyor...' });
});

module.exports = router;