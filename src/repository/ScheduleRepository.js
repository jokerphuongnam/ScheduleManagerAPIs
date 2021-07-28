const MSSqlSchedules = require('../database/schedules/MSSqlSchedules')

module.exports = ScheduleRepository = () => {
    const msSqlSchedules = MSSqlSchedules()

    return new class {
        getSchedules(scheduleQuery){
            return msSqlSchedules.getSchedules(scheduleQuery)
        }
    
        getScheduleInfo(scheduleId){
            return msSqlSchedules.getScheduleInfo(scheduleId)
        }
    
        deleteSchedule(scheduleId){
            return msSqlSchedules.deleteSchedule(scheduleId)
        }
    
        createTask(task){
            return msSqlSchedules.createTask(task)
        }

        editTask(task){
            return msSqlSchedules.editTask(task)
        }

        deleteTask(taskId){
            return msSqlSchedules.deleteTask(taskId)
        }

        addMember(memberInfo){
            return msSqlSchedules.addMember(memberInfo)
        }

        leaveGroup(member){
            return msSqlSchedules.leaveGroup(member)
        }

        addMedia(multimedia){
            return msSqlSchedules.addMedia(multimedia)
        }

        deleteMedia(media){
            return msSqlSchedules.deleteMedia(media)
        }
    }()
}