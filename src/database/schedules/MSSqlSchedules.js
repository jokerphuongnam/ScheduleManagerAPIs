const msSqlUtils = require('../utils/MSSQLUtils/MSSQLUtils')
const QueryUtils = require('../utils/MSSQLUtils/QueryUtils')
const ScheduleType = require('./ScheduleType.json')
const {
    dest
} = require('../media/MediaDest.json')
const fs = require('fs')
const {
    removeBlankProperties
} = require('../utils/ObjecUtils/ObjectUtils')

Object.prototype.removeBlankProperties = removeBlankProperties

module.exports = MsSqlSchedules = () => {
    function getArrayFromScheduleInfo(scheduleInfo, type) {
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

    function buildSchedule(scheduleInfo) {
        let schedule = getArrayFromScheduleInfo(scheduleInfo, ScheduleType.schedule)[0]
        if (!schedule) {
            return null
        }
        schedule = {
            scheduleId: schedule.id,
            ...schedule
        }
        delete schedule.id
        return schedule ? {
            ...schedule,
            tasks: getArrayFromScheduleInfo(scheduleInfo, ScheduleType.task).map((e) => {
                e = {
                    taskId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            members: getArrayFromScheduleInfo(scheduleInfo, ScheduleType.member).map((e) => {
                e = {
                    memberId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            images: getArrayFromScheduleInfo(scheduleInfo, ScheduleType.image).map((e) => {
                e = {
                    imageId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            audios: getArrayFromScheduleInfo(scheduleInfo, ScheduleType.audio).map((e) => {
                e = {
                    audioId: e.id,
                    ...e
                }
                delete e.id
                return e
            }),
            videos: getArrayFromScheduleInfo(scheduleInfo, ScheduleType.video).map((e) => {
                e = {
                    videoId: e.id,
                    ...e
                }
                delete e.id
                return e
            })
        } : null
    }

    return new class {
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
                    const schedule = buildSchedule(scheduleInfo)
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

        deleteSchedule(scheduleId) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.deleteSchedule(scheduleId)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        createTask(task) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.createTask(task)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        deleteTask(task) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.deleteTask(task)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        editTask(task) {
            return new Promise((resolve, reject) => {
                console.log(QueryUtils.editTask(task))
                msSqlUtils.execute(QueryUtils.editTask(task)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        addMember(memberInfo) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.addMember(memberInfo)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        leaveGroup(member) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.leaveGroup(member)).then((scheduleInfo) => {
                    const schedule = buildSchedule(scheduleInfo)
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

        addMedia(multimedia) {
            return new Promise(async (resolve, reject) => {
                let schedule = null
                for (const media of multimedia) {
                    try {
                        schedule = await msSqlUtils.execute(QueryUtils.createMedia(media))
                    } catch (e) {
                        reject(409)
                        return
                    }
                }
                schedule = buildSchedule(schedule)
                if (schedule) {
                    resolve(schedule)
                } else {
                    reject(404)
                }
            })
        }

        deleteMedia(mediaId) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.deleteMedia(mediaId)).then((mediaInfo) => {
                    fs.unlinkSync(`${dest}${mediaInfo[0].mediaName}`)
                    resolve(mediaInfo[0])
                }).catch((e) => {
                    reject(409)
                })
            })
        }
    }()
}