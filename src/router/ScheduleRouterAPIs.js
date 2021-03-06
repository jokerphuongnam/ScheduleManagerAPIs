const Express = require('express')
const multer = require('multer')
const {
    dest
} = require('../database/media/MediaDest.json')
const fs = require('fs')
const {
    convertEmtpyStringToNull
} = require('../database/utils/ObjecUtils/ObjectUtils')
const ScheduleRepository = require('../repository/ScheduleRepository')
const path = require('path')

String.prototype.convertEmtpyStringToNull = convertEmtpyStringToNull

const router = Express.Router()
const repository = ScheduleRepository()

const upload = multer({
    dest
})

router.post('/createschedule', (req, res, next) => {
    const {
        title,
        description,
        color,
        scheduleTime,
        userId
    } = req.body
    if (!title || !description || !color || !scheduleTime || !userId) {
        res.sendStatus(400)
    } else {
        req.body.scheduleInfo = {
            title,
            color,
            description,
            scheduleTime,
            userId
        }
        next()
    }
}, (req, res) => {
    // { title, description, scheduleTime, userId }
    repository.createSchedule(req.body.scheduleInfo).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.put('/editSchedule', (req, res, next) => {
    const {
        scheduleId,
        title,
        color,
        description,
        scheduleTime
    } = req.body
    if (!scheduleId) {
        res.sendStatus(400)
    } else {
        req.body.scheduleInfo = {
            scheduleId,
            title,
            color,
            description,
            scheduleTime
        }
        next()
    }
}, (req, res) => {
    // { scheduleId, title, color, description, scheduleTime }
    repository.editSchedule(req.body.scheduleInfo).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

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
        finishBy: body.finishBy === undefined ? undefined : body.finishBy.convertEmtpyStringToNull()
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
            req.files.forEach((file) => {
                fs.unlinkSync("./" + file.path)
            })
        }
        res.sendStatus(400)
    } else {
        req.body.mediaInfo = req.files.map((file) => {
            return {
                mediaUrl: path.basename(file.path),
                mediaName: file.originalname,
                mediaType: file.mimetype.split('/').shift(),
                mimetype: file.mimetype,
                path: file.path,
                scheduleId: req.body.scheduleId,
                userId: req.body.userId
            }
        })
        next()
    }
}, (req, res) => {
    // { files, scheduleId, userId }
    repository.addMedia(req.body.mediaInfo).then((scheduleInfo) => {
        res.json(scheduleInfo)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.delete('/media/deletemedia/:mediaId', (req, res) => {
    repository.deleteMedia(req.params.mediaId).then((media) => {
        res.json(media)
    }).catch((e) => {
        res.sendStatus(e)
    })
})

router.delete('/media/deletemultimedia', (req, res, next) => {
    if (req.body.multimediaId) {
        try {
            req.body.multimediaId = JSON.parse(req.body.multimediaId)
            next()
        } catch (e) {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }

}, async (req, res) => {
    const {
        multimediaId
    } = req.body
    repository.deleteMultimedia(multimediaId).then((multimedia) => {
        res.json(multimedia)
    }).catch((e) => {
        res.json(e.multimedia).status(e.status)
    })
})

module.exports = router