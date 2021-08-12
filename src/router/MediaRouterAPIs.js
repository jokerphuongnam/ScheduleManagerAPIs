const Express = require('express')
const path = require('path')
const {
    dest
} = require('../database/media/MediaDest.json')

const router = Express.Router()

router.get('/:name', (req, res) => {
    res.sendFile(`${req.params.name}`, {
        root: path.join(__dirname, `../.${dest}`),
        headers: {
            'Content-Type': 'image/jpeg'
        }
    })
})

module.exports = router