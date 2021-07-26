const MSSqlSchedules = require('../database/schedules/MSSqlSchedules')

module.exports = class ScheduleRepository {
    msSqlSchedules = new MSSqlSchedules()

    getSchedules(scheduleQuery){
        return this.msSqlSchedules.getSchedules(scheduleQuery)
    }

    getScheduleInfo(scheduleId){
        return this.msSqlSchedules.getScheduleInfo(scheduleId)
    }

    deleteSchedule(scheduleId){
        return this.msSqlSchedules.deleteSchedule(scheduleId)
    }

    createTask(task){
        return this.msSqlSchedules.createTask(task)
    }
}