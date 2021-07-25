import Express from 'express'
import multer from 'multer'
import ScheduleRepository from '../repository/ScheduleRepository'


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

export default router