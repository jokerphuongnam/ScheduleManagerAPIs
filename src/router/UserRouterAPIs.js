import Express from 'express'
import multer from 'multer'
import UserRepository from '../repository/UserRepository'

const router = Express.Router()
const repository = new UserRepository()

const upload = multer({
    storage: multer.memoryStorage()
}).single('avatar')

router.get('/login', (req, res) => {
    repository.login(req.query).then((user) => {
            res.json(user)
        })
        .catch((e) => {
            res.sendStatus(e)
        })
})

router.post('/register', upload, (req, res) => {
    res.json(req.file.fieldname)
    // repository.register(req.body).then((user) => {
    //         res.json(user)
    //     })
    //     .catch((e) => {
    //         res.sendStatus(e)
    //     })
})

router.put('/addtoken', (req, res) => {
    repository.addToken(req.body).then((user) => {
        res.json(user)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.put('/changepassword', (req, res) => {
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
export default router;