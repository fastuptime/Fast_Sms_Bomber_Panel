const user = new Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' }, // user, admin, vip
    created_at: { type: String, default: () => moment().format('DD/MM/YYYY HH:mm:ss') },
    key: { type: String, default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) },
    logs: []
});

module.exports = mongoose.model('user', user);