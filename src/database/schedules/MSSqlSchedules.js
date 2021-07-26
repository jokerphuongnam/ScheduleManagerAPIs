const msSqlUtils = require('../utils/MSSQLUtils/MSSQLUtils')
const QueryUtils = require('../utils/MSSQLUtils/QueryUtils')
const ScheduleType = require('./ScheduleType.json')
const {
    removeBlankProperties
} = require('../utils/ObjecUtils/ObjectUtils')

Object.prototype.removeBlankProperties = removeBlankProperties

module.exports = class msSqlSchedules {
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
        if(!schedule){
            return null
        }
        schedule = {
            scheduleId: schedule.id,
            ...schedule
        }
        delete schedule.id
        return schedule ? {
            ...schedule,
            tasks: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.task).map((e) => {
                e = {
                    taskId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            members: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.member).map((e) => {
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            images: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.image).map((e) => {
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            audios: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.audio).map((e) => {
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            videos: this.getArrayFromScheduleInfo(scheduleInfo, ScheduleType.video).map((e) => {
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            })
        } : null
    }

    getSchedules(scheduleQuery) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.getSchedules(scheduleQuery)).then((schedules) => {
                resolve(schedules)
            }).catch((e) => {
                console.log(e)
                reject(409)
            })
        })
    }

    getScheduleInfo(scheduleId) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.getScheduleInfo(scheduleId)).then((scheduleInfo) => {
                const schedule = this.buildSchedule(scheduleInfo)
                if (schedule) {
                    resolve(schedule)
                } else {
                    reject(404)
                }
            }).catch((e) => {
                console.log(e)
                reject(409)
            })
        })
    }

    deleteSchedule(scheduleId){
        return new Promise((resolve, reject)=>{
            msSqlUtils.execute(QueryUtils.deleteSchedule(scheduleId)).then((scheduleInfo)=>{
                const schedule = this.buildSchedule(scheduleInfo)
                if (schedule) {
                    resolve(schedule)
                } else {
                    reject(404)
                }
            }).catch((e) => {
                reject(409)
            })
        })
    }

    createTask(task){
        return new Promise((resolve, reject)=>{
            msSqlUtils.execute(QueryUtils.createTask(task)).then((scheduleInfo)=>{
                const schedule = this.buildSchedule(scheduleInfo)
                if (schedule) {
                    resolve(schedule)
                } else {
                    reject(404)
                }
            }).catch((e) => {
                reject(409)
            })
        })
    }
}