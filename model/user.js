const mongoose = require('mongoose')

const User = mongoose.model('User', {
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    data: {
        nama: {
            type: String,
        },
        nu: {
            type: String,
        },
        periode: {
            type: String,
        },
        phone: {
            type: String,
        },
        alamat: {
            type: String,
        },
        ttl: {
            type: String,
        },
        ranting: {
            type: String,
        },
        pendidikan: {
            type: String,
        },
        pendidikanSkrng: {
            type: String,
        },
        kader: {
            type: String,
        },
        pelatihan: {
            type: String,
        },
    },
})

module.exports = User