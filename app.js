const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { get } = require('mongoose')

require('./utils/db')
const User = require('./model/user')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layouts/main-layout',
        title: 'Pelajar NU Wates',
        message: 'Password salah! Coba lagi!',
        messageClass: 'alert-danger',
        user: ''
    })
})

app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    const getUser = User.findOne({ email: email })
    .then(getUser => {
        if (getUser) {
            if (password === getUser.password) {
                token = jwt.sign({ email: getUser.email }, 'fradotech20012021.01082000.20052003', { expiresIn: '60m' })

                res.cookie('token', token)
                res.cookie('user', getUser)

                res.redirect('/')

            } else {
                res.render('login', {
                    layout: 'layouts/main-layout',
                    title: 'Pelajar NU Wates',
                    message: 'Password salah! Coba lagi!',
                    messageClass: 'alert-danger',
                    user: getUser
                })
            }
        } else {
            res.render('login', {
                layout: 'layouts/main-layout',
                title: 'Pelajar NU Wates',
                message: 'Email salah! Coba lagi!',
                messageClass: 'alert-danger',
                user: getUser
            })
        }
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        layout: 'layouts/main-layout',
        title: 'Pelajar NU Wates',
        message: '',
        messageClass: 'alert-success',
        user: null
    })
})

app.post('/register', (req, res) => {
    let makesta = ''
    let lakmud = ''
    let lakud = ''

    if(req.body.makesta){
        makesta = req.body.makesta + ' ' + req.body.makestaTahun + ', '
    }
    if(req.body.lakmud){
        lakmud = req.body.lakmud + ' ' + req.body.lakmudTahun + ', '
    }
    if(req.body.lakud){
        lakud = req.body.lakud + ' ' + req.body.lakudTahun + ', '
    }

    let user = new User({
        email: req.body.email,
        password: req.body.password,
        data: {
            nama: req.body.nama,
            nu: req.body.nu,
            periode: req.body.periode,
            phone: req.body.phone,
            alamat: req.body.alamat,
            ttl: req.body.tempatLahir + ', ' + req.body.tanggalLahir,
            ranting: req.body.ranting,
            pendidikan: req.body.pendidikan,
            pendidikanSkrng: req.body.pendidikanSkrng,
            kader: makesta + lakmud + lakud,
            pelatihan: req.body.pelatihan,
        }
    })

    user.save()
        .then(user => {
            res.render('login', {
                layout: 'layouts/main-layout',
                title: 'Pelajar NU Wates',
                message: 'Pendaftaran berhasil! Silakan login!',
                messageClass: 'alert-success',
                user: null
            })
        })
        .catch(err => {
            res.json({
                status: 'Gagal Daftar'
            })
        })
})

//User

app.use( async (req, res, next) => {
    const token = await req.cookies['token']
    req.user = await req.cookies['user']
    if (req.user) {
        next()
    } else {
        res.render('login', {
            layout: 'layouts/main-layout',
            title: 'Pelajar NU Wates',
            message: 'Anda perlu login dahulu!',
            messageClass: 'alert-danger',
            user: null
        })
    }
})

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
        title: 'Pelajar NU Wates',
        message: '',
        messageClass: '',
        user: req.user,
    })
})

app.get('/profile', (req, res) => {
    const getUser = User.findOne({ _id: req.user._id })
    .then(getUser => {
        res.render('profile', {
            layout: 'layouts/main-layout',
            title: 'Pelajar NU Wates',
            user: getUser
        })
    })
})

app.get('/edit-profile', (req, res) => {
    const user = User.findOne({ _id: req.user._id })
    .then(user => {
        res.render('edit-profile', {
            layout: 'layouts/main-layout',
            title: 'Pelajar NU Wates',
            user
        })    
    })
})

app.post('/edit-profile', (req, res) => {
    let makesta = ''
    let lakmud = ''
    let lakud = ''

    if(req.body.makesta){
        makesta = req.body.makesta + ' ' + req.body.makestaTahun + ', '
    }
    if(req.body.lakmud){
        lakmud = req.body.lakmud + ' ' + req.body.lakmudTahun + ', '
    }
    if(req.body.lakud){
        lakud = req.body.lakud + ' ' + req.body.lakudTahun
    }

    const user = {
        email: req.user.email,
        password: req.user.password,
        data: {
            nama: req.body.nama,
            nu: req.body.nu,
            alamat: req.body.alamat,
            periode: req.body.periode,
            phone: req.body.phone,
            ttl: req.body.ttl,
            ranting: req.body.ranting,
            pendidikan: req.body.pendidikan,
            pendidikanSkrng: req.body.pendidikanSkrng,
            kader: makesta + lakmud + lakud,
            pelatihan: req.body.pelatihan,
        }
    }

    User.findOneAndUpdate({ _id: req.user._id }, user, { new: true }, async (err, doc) => {
        if(!err) {
            res.redirect('/')
        }
        else {
            console.log(err)
        }
    })
})

app.get('/logout', (req, res) => {
    cookie = req.cookies
    for (let prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue
        }
        res.cookie(prop, '', { expires: new Date(0) })
    }
    res.redirect('/')
})

app.listen(port)