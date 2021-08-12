const Express = require('express')
const multer = require('multer')
const {
    dest
} = require('../database/media/MediaDest.json')
const UserRepository = require('../repository/UserRepository')
const {
    exportFromBodyForUser
} = require('../database/utils/ObjecUtils/ObjectUtils')
const fs = require('fs')

const router = Express.Router()
const repository = UserRepository()

const upload = multer({
    dest
})

router.get('/getuserbyemail/:email', (req, res) => {
    repository.getLoginIdByEmail(req.params.email).then((user) => {
        res.json(user)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.get('/login', (req, res) => {
    // { email, password, loginId, userId }
    repository.login(req.query).then((user) => {
            res.json(user)
        })
        .catch((e) => {
            res.sendStatus(e)
        })
})

router.post('/register', upload.single('avatar'), (req, res, next) => {
    req.exportFromBodyForUser = exportFromBodyForUser
    const {
        email,
        password,
        firstName,
        lastName,
        birthday,
        gender,
        loginId,
        loginType,
        avatar
    } = {
        ...req.exportFromBodyForUser(),
        avatar: req.file ? req.file.path.split('\\').pop() : undefined
    }
    if ((firstName && lastName && birthday && gender) && !((email || password) && (loginId || loginType))) {
        req.body.userInfo = {
            email,
            password,
            firstName,
            lastName,
            birthday,
            gender,
            loginId,
            loginType,
            avatar
        }
        next()
    } else {
        if (avatar) {
            fs.unlinkSync(req.file.path)
        }
        res.sendStatus(400)
    }
}, (req, res) => {
    // { email, password, firstName, lastName, birthday, gender, avatar }
    // { loginId, loginType, firstName, lastName, birthday, gender, avatar }
    repository.register(req.body.userInfo).then((user) => {
            res.json(user)
        })
        .catch((e) => {
            if (req.body.userInfo.avatar) {
                fs.unlinkSync(req.file.path)
            }
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

router.put('/editprofile', upload.single('avatar'), (req, res, next) => {
    req.exportFromBodyForUser = exportFromBodyForUser
    req.body.userInfo = req.exportFromBodyForUser()
    if (!req.body.userInfo.userId) {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        res.sendStatus(400)
    } else {
        next()
    }
}, (req, res) => {
    // { userId, avatar, firstName, lastName, birthday, gender }
    repository.editProfile(req.body.userInfo).then((user) => {
        res.json(user)
    }).catch((e) => {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        res.sendStatus(e)
    })
})

router.post('/search', (req, res, next) => {
    const {
        userId,
        searchWord,
        isInsert
    } = req.body
    if (!userId || !searchWord) {
        res.sendStatus(400)
    } else {
        req.body.searchInfo = {
            userId,
            searchWord,
            isInsert
        }
        next()
    }
}, (req, res) => {
    //{ searchWord, userId, isInsert }
    repository.search(req.body.searchInfo).then((searchWords) => {
        res.json(searchWords)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.delete('/deleteSearch', (req, res, next) => {
    const {
        searchId,
        userId
    } = req.body
    if ((searchId && userId) || (!searchId && !userId)) {
        res.sendStatus(400)
    } else {
        req.body.searchInfo = {
            searchId,
            userId
        }
        next()
    }
}, (req, res) => {
    //{ searchId, userId }
    repository.deleteSearch(req.body.searchInfo).then((success) => {
        res.sendStatus(success)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

module.exports = router;