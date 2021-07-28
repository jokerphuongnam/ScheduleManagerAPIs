const Express = require('express')
const multer = require('multer')
const UserRepository = require('../repository/UserRepository')
const {
    exportFromBodyForUser
} = require('../database/utils/ObjecUtils/ObjectUtils')

const router = Express.Router()
const repository = UserRepository()

const upload = multer({
    storage: multer.memoryStorage()
}).single('avatar')

router.get('/login', (req, res) => {
    // { email, password, loginId }
    repository.login(req.query).then((user) => {
            res.json(user)
        })
        .catch((e) => {
            res.sendStatus(e)
        })
})

router.post('/register', upload, (req, res) => {
    // { email, password, firstName, lastName, birthday, gender, avatar }
    // { loginId, loginType, firstName, lastName, birthday, gender, avatar }
    req.exportFromBodyForUser = exportFromBodyForUser
    repository.register(req.exportFromBodyForUser()).then((user) => {
            res.json(user)
        })
        .catch((e) => {
            res.sendStatus(e)
        })
})

router.put('/addtoken', (req, res) => {
    // { userId, loginId, loginType }
    // { userId, email, password }
    repository.addToken(req.body).then((user) => {
        res.json(user)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.put('/changepassword', (req, res) => {
    // { loginId, oldPassword, newPassword }
    // { userId, oldPassword, newPassword }
    repository.changePassword(req.body).then((user) => {
        res.json(user)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.put('/forgotpassword', (req, res) => {
    repository.forgotPassword(req.body.email).then(() => {
        res.sendStatus(200)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.put('/editprofile', upload, (req, res) => {
    // { userId, avatar, firstName, lastName, birthday, gender }
    req.exportFromBodyForUser = exportFromBodyForUser
    repository.editProfile({
        ...req.exportFromBodyForUser(),
        avatar: req.body.avatar,
        avatarFile: req.file
    }).then((user) => {
        res.json(user)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

module.exports = router;