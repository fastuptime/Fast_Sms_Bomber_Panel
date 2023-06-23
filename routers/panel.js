const router = require('express').Router();

router.get('/', checkAuth, async (req, res) => {
    res.render('panel', { config: config });
});

module.exports = router;