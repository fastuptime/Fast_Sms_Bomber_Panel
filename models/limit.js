const limit = new Schema({
    userID: String,
    count: { type: Number, default: 0 },
});

module.exports = mongoose.model('limit', limit);