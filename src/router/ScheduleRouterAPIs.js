const Express = require('express')
const multer = require('multer')
const path = require('path')
const MediaDest = require('../database/media/MediaDest.json')
const fs = require('fs')
const {
    convertEmtpyStringToNull
} = require('../database/utils/ObjecUtils/ObjectUtils')
const ScheduleRepository = require('../repository/ScheduleRepository')

String.prototype.convertEmtpyStringToNull = convertEmtpyStringToNull

const router = Express.Router()
const repository = ScheduleRepository()

const dest = MediaDest.multimedia

const upload = multer({
    dest
})

// const upload = multer({
//     storage: multer.memoryStorage()
// })

router.get('/scheduleinfo/:scheduleId', (req, res) => {
    repository.getScheduleInfo(req.params.scheduleId).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.get('/schedules/:userId', (req, res) => {
    repository.getSchedules({
        ...req.params,
        ...req.query
    }).then((schedules) => {
        res.json(schedules)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.delete('/delete/:scheduleId', (req, res) => {
    repository.deleteSchedule(req.params.scheduleId).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.post('/task/createtask',
    (req, res, next) => {
        const {
            detail,
            scheduleId,
            userId
        } = req.body
        if (!detail || !scheduleId || !userId) {
            res.sendStatus(400)
        } else {
            next()
        }
    }, (req, res) => {
        // {detail,scheduleId,userId}
        repository.createTask(req.body).then((scheduleInfo) => {
            res.json(scheduleInfo)
        }).catch((e) => {
            res.sendStatus(e)
        })
    })

router.put('/task/edittask', (req, res, next) => {
    const {
        taskId,
        detail,
        finishBy
    } = req.body
    if (!taskId) {
        res.sendStatus(400)
    } else if (!detail && finishBy == undefined) {
        res.sendStatus(400)
    } else {
        next()
    }
}, (req, res) => {
    // { taskId, detail, finishBy }
    const body = req.body
    repository.editTask({
        ...body,
        finishBy: body.finishBy.convertEmtpyStringToNull()
    }).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})


router.delete('/task/deletetask/:taskId', (req, res) => {
    repository.deleteTask(req.params.taskId).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.post('/member/addmember',
    (req, res, next) => {
        const {
            userIdBeAdded,
            scheduleId,
            userIdAdd
        } = req.body
        if (!userIdBeAdded || !scheduleId || !userIdAdd) {
            res.sendStatus(400)
        } else {
            next()
        }
    },
    (req, res) => {
        // { userIdBeAdded, scheduleId, userIdAdd }
        repository.addMember(req.body).then((scheduleInfo) => {
            res.json(scheduleInfo)
        }).catch((e) => {
            res.sendStatus(e)
        })
    })

router.delete('/:scheduleId/member/leavegroup/:userId', (req, res) => {
    repository.leaveGroup(req.params).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.post('/media/addmultimedia', upload.array('multimedia'), (req, res, next) => {
    const {
        scheduleId,
        userId
    } = req.body
    if (!scheduleId || !userId || !req.files) {
        if (req.files) {
            const media = req.files.map((file) => {
                return {
                    mediaName: file.path.split('\\').pop(),
                    mediaType: file.mimetype.split('/').shift(),
                    path: file.path,
                    scheduleId: req.body.scheduleId,
                    userId: req.body.userId
                }
            })
            console.log(media)
            req.files.forEach((file) => {
                fs.unlinkSync("./" + file.path)
            })
        }
        res.sendStatus(400)
    } else {
        next()
    }
}, (req, res) => {
    // { files, scheduleId, userId }
    const media = req.files.map((file) => {
        return {
            mediaName: file.path.split('\\').pop(),
            mediaType: file.mimetype.split('/').shift(),
            path: file.path
        }
    })
    repository.addMedia(req.files.map((file) => {
        return {
            mediaName: file.path.split('\\').pop(),
            mediaType: file.mimetype.split('/'),
            path: file.path,
            scheduleId: req.body.scheduleId,
            userId: req.body.userId
        }
    })).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.delete('/media/deletemedia/:mediaId', (req, res) => {
    repository.deleteMedia(req.params.mediaId).then((media) => {
        res.json(media)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

module.exports = router