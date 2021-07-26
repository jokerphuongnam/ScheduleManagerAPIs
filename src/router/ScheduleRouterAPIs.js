const Express = require('express')
const ScheduleRepository = require('../repository/ScheduleRepository') 

const router = Express.Router()
const repository = new ScheduleRepository()

router.get('/scheduleinfo/:scheduleId', (req, res) => {
    repository.getScheduleInfo(req.params.scheduleId).then((scheduleInfo)=>{
        res.json(scheduleInfo)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

router.get('/schedules/:userId', (req, res) =>{
    repository.getSchedules({...req.params, ...req.query}).then((schedules)=>{
        res.json(schedules)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

router.delete('/delete/:scheduleId', (req, res) =>{
    repository.deleteSchedule(req.params.scheduleId).then((scheduleInfo)=>{
        res.json(scheduleInfo)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

router.post('/createtask', (req, res) =>{
    // {detail,scheduleId,userId}
    repository.createTask(req.body).then((scheduleInfo)=>{
        res.json(scheduleInfo)
    }).catch((e)=>{
        res.sendStatus(e)
    })
})

module.exports = router