export default class QueryUtils {
    static login({
        loginId,
        userId
    }) {
        return `
            EXEC	[dbo].[sp_login]
            @${loginId?'LOGIN_ID':'USER_ID'} = ${loginId?'N':''}'${loginId?loginId:userId}'
        `
    }

    static createUser({
        firstName,
        lastName,
        birthday,
        gender,
        loginId,
        type
    }) {
        return `
            EXEC	[dbo].[sp_create_user]
            @FIRST_NAME = N'${firstName}',
            @LAST_NAME = N'${lastName}',
            @BIRTHDAY = ${birthday},
            @GENDER = ${gender},
            @LOGIN_ID = N'${loginId}',
            @TYPE = N'${type}'
        `
    }

    static createSchedule({
        title,
        description,
        scheduleTime,
        userId
    }) {
        return `
            EXEC	[dbo].[sp_create_schedule]
            @TITLE = N'${title}',
            @DESCRIPTION = N'${description}',
            @SCHEDULE_TIME = ${scheduleTime},
            @USER_ID = '${userId}'
        `
    }

    static addToken({
        userId,
        loginId,
        type
    }) {
        return `
            EXEC	[dbo].[sp_add_token]
            @USER_ID = '${userId}',
            @LOGIN_ID = N'${loginId}',
            @LOGIN_TYPE = N'${type}'
        `
    }

    static getSchedules({userId, startTime, endTime}) {
        return `
            EXEC	[dbo].[sp_get_schedules]
            @USER_ID = '${userId}',
            @START_TIME = ${startTime ? startTime : 'NULL'},
            @END_TIME = ${endTime ? endTime : 'NULL'}
        `
    }

    static getScheduleInfo(scheduleId) {
        return `
            EXEC	[dbo].[sp_get_schedule_info]
            @SCHEDULE_ID = '${scheduleId}'
        `
    }
}