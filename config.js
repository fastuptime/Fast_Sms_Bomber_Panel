module.exports = {
    mongodb: "mongodb://127.0.0.1:27017/smsbomber",
    port: 80,
    discord: "https://discord.gg/65exWz2dQ6",
    apiServers: [ // API Servers - API Sunucuları (BİR API SUNUCUSU GÜNLÜK BIN SMS DEN FAZLA GÖNDEREMEZ RATE LİMİT YER BU SEBEPTEN DOLAYI BIRDEN FAZLA API SUNUCUSU EKLEYEBİLİRSİNİZ)
        // API SUNUCUSU SATIN ALMAK İÇİN: https://fastuptime.com/discord (API SUNUCUSU SATIN ALMAK İÇİN: https://fastuptime.com/discord)
        'http://localhost:80/v1',
    ],
    limits: { // Limits Daily - Günlük Limitler
        user: 20,
        vip: 50,
        admin: 200,
    },
};