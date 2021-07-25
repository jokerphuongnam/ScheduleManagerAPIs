import msSqlUtils from '../utils/MSSQLUtils/MSSQLUtils'
import QueryUtils from '../utils/MSSQLUtils/QueryUtils'
import ScheduleType from './ScheduleType.json'
import {
    removeBlankProperties
} from '../utils/ObjecUtils/ObjectUtils'

Object.prototype.removeBlankProperties = removeBlankProperties

export default class msSqlSchedules {
    getArrayFromScheduleInfo(scheduleInfo, type) {
        const tasks = []
        for (const info of scheduleInfo) {
            if (info.type === type) {
                tasks.push({
                    ...info,
                    type: undefined
                }.removeBlankProperties())
            }
        }
        return tasks
    }

    buildSchedule(scheduleInfo) {
        let schedule = this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.schedule)[0]
        schedule = {
            scheduleId: schedule.id,
            ...schedule
        }
        delete schedule.id
        return schedule ? {
            ...schedule,
            tasks: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.task).map((e)=>{
                e = {
                    taskId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            members: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.member).map((e)=>{
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            })
        } : null
    }

    getSchedules(scheduleQuery){
        return new Promise((resolve, reject)=>{
            msSqlUtils.execute(QueryUtils.getSchedules(scheduleQuery)).then((schedules)=>{
                resolve(schedules)
            }).catch((e)=>{
                console.log(e)
                reject(409)
            })
        })
    }

    getScheduleInfo(scheduleId) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.getScheduleInfo(scheduleId)).then((scheduleInfo) => {
                const schedule = this.buildSchedule(scheduleInfo)
                if(schedule){
                    resolve(schedule)
                }else{
                    reject(404)
                }
            }).catch((e)=>{
                reject(409)
            })
        })
    }
}