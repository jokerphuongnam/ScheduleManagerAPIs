import MSSqlSchedules from "../database/schedules/MSSqlSchedules";

export default class ScheduleRepository {
    msSqlSchedules = new MSSqlSchedules()

    getSchedules(scheduleQuery){
        return this.msSqlSchedules.getSchedules(scheduleQuery)
    }

    getScheduleInfo(scheduleId){
        return this.msSqlSchedules.getScheduleInfo(scheduleId)
    }
}