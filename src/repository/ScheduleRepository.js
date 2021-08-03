const MSSqlSchedules = require('../database/schedules/MSSqlSchedules')

module.exports = ScheduleRepository = () => {
    const msSqlSchedules = MSSqlSchedules()

    return new class {
        createSchedule(scheduleInfo) {
            return msSqlSchedules.createSchedule(scheduleInfo)
        }

        editSchedule(scheduleInfo) {
            return msSqlSchedules.editSchedule(scheduleInfo)
        }

        getSchedules(scheduleQuery) {
            return msSqlSchedules.getSchedules(scheduleQuery)
        }

        getScheduleInfo(scheduleId) {
            return msSqlSchedules.getScheduleInfo(scheduleId)
        }

        deleteSchedule(scheduleId) {
            return msSqlSchedules.deleteSchedule(scheduleId)
        }

        createTask(task) {
            return msSqlSchedules.createTask(task)
        }

        editTask(task) {
            return msSqlSchedules.editTask(task)
        }

        deleteTask(taskId) {
            return msSqlSchedules.deleteTask(taskId)
        }

        addMember(memberInfo) {
            return msSqlSchedules.addMember(memberInfo)
        }

        leaveGroup(member) {
            return msSqlSchedules.leaveGroup(member)
        }

        addMedia(multimedia) {
            return msSqlSchedules.addMedia(multimedia)
        }

        deleteMedia(mediaId) {
            return msSqlSchedules.deleteMedia(mediaId)
        }

        deleteMultimedia(multimediaId) {
            return new Promise(async (resolve, reject) => {
                const multimedia = []
                for (const mediaId of multimediaId) {
                    try {
                        const mediaInfo = await msSqlSchedules.deleteMedia(mediaId)
                        multimedia.push(mediaInfo)
                    } catch (e) {
                        reject({
                            multimedia,
                            e
                        })
                    }
                }
                resolve(multimedia)
            })
        }
    }()
}