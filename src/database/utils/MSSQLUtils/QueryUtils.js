const {
    clearQuery
} = require("../ObjecUtils/ObjectUtils")

String.prototype.clearQuery = clearQuery

module.exports = class QueryUtils {
    static login({
        loginId,
        userId
    }) {
        return `
            EXEC	dbo.sp_login
            @${loginId?'LOGIN_ID':'USER_ID'} = ${loginId?'N':''}'${loginId?loginId:userId}'
        `
    }

    static createUser({
        firstName,
        lastName,
        birthday,
        gender,
        loginId,
        type,
        avatar
    }) {
        return `
            EXEC	dbo.sp_create_user
            @FIRST_NAME = N'${firstName}',
            @LAST_NAME = N'${lastName}',
            @BIRTHDAY = ${birthday},
            @GENDER = ${gender},
            @LOGIN_ID = N'${loginId}',
            @TYPE = N'${type}',
            @AVATAR = ${avatar ? `N'${avatar}'` : 'NULL'}
        `
    }

    static editUser({
        userId,
        avatar,
        firstName,
        lastName,
        birthday,
        gender
    }) {
        return `
            UPDATE dbo.users
            SET 
                ${(()=>{
                    const modified = `
                        ${avatar === null ? 'avatar = NULL': avatar === undefined ? '': `avatar = N'${avatar}'`}${firstName? `,
                        first_name = N'${firstName}'`: ''}${lastName? `,
                        last_name = N'${lastName}'`: ''}${birthday? `,
                        birthday = ${birthday}`: ''}${!(gender === null || gender === undefined)? `,
                        gender = ${gender === true ? 1 : 0}`: ''}
                    `
                    return avatar !== undefined ? modified : modified.clearQuery()
                })()}
            WHERE user_id = '${userId}'
        `
    }

    static addToken({
        userId,
        loginId,
        type
    }) {
        return `
            EXEC	dbo.sp_add_token
            @USER_ID = '${userId}',
            @LOGIN_ID = N'${loginId}',
            @LOGIN_TYPE = N'${type}'
        `
    }

    static getSchedules({
        userId,
        startTime,
        endTime
    }) {
        return `
            EXEC	dbo.sp_get_schedules
            @USER_ID = '${userId}',
            @START_TIME = ${startTime ? startTime : 'NULL'},
            @END_TIME = ${endTime ? endTime : 'NULL'}
        `
    }

    static getScheduleInfo(scheduleId) {
        return `
            EXEC	dbo.sp_get_schedule_info
            @SCHEDULE_ID = '${scheduleId}'
        `
    }

    static createSchedule({
        title,
        description,
        scheduleTime,
        userId
    }) {
        return `
            EXEC	dbo.sp_create_schedule
            @TITLE = N'${title}',
            @DESCRIPTION = N'${description}',
            @SCHEDULE_TIME = ${scheduleTime},
            @USER_ID = '${userId}'
        `
    }

    static deleteSchedule(scheduleId) {
        return `
            DELETE FROM
                dbo.schedules
            WHERE
                dbo.schedules.schedule_id = '${scheduleId}'
        `
    }

    static createTask({
        detail,
        scheduleId,
        userId
    }) {
        return `
            INSERT INTO dbo.tasks(
                detail,
                schedule_id,
                create_by
            ) VALUES (
                N'${detail}',
                '${scheduleId}',
                '${userId}'
            )
        `
    }

    static editTask({
        taskId,
        detail,
        finishBy
    }) {
        return `
            UPDATE dbo.tasks
                SET
                    ${(() =>{
                        const modified = `
                            ${detail ?`detail = N'${detail}'`: ''}${finishBy === undefined? '': `,
                            finish_at = ${finishBy ?'dbo.currentTimeMilliseconds()' :'NULL'}`}${finishBy === undefined? '': `,
                            finish_by = ${finishBy ? `'${finishBy}'` :'NULL'}`}
                        `
                        return detail ? modified : modified.clearQuery()
                    })()}
            WHERE
                task_id = '${taskId}'
        `
    }

    static deleteTask(taskId) {
        return `
            DELETE FROM
                dbo.tasks
            WHERE
                dbo.tasks.task_id = '${taskId}'
        `
    }

    static addMember({
        userIdBeAdded,
        scheduleId,
        userIdAdd
    }) {
        return `
            INSERT INTO dbo.members(
                user_id,
                schedule_id,
                add_by_or_founder
            ) VALUES (
                '${userIdBeAdded}',
                '${scheduleId}',
                '${userIdAdd}'
            )
        `
    }

    static leaveGroup({
        userId,
        scheduleId
    }) {
        return `
            DELETE FROM
                dbo.members
            WHERE
                dbo.members.user_id = '${userId}' AND
                dbo.members.schedule_id = '${scheduleId}'
        `
    }

    static createMedia({
        mediaType,
        mediaName,
        scheduleId,
        userId
    }) {
        return `
            EXEC	dbo.sp_add_media
            @MEDIA_TYPE = N'${mediaType}',
            @MEDIA_NAME = N'${mediaName}',
            @SCHEDULE_ID = '${scheduleId}',
            @ID_USER = '${userId}'
        `
    }

    static deleteMedia(mediaId) {
        return `
            EXEC	dbo.sp_delete_media
            @MEDIA_ID = '${mediaId}'
        `
    }

    static search({
        searchWord,
        userId
    }) {
        return `
            EXEC	dbo.sp_search
            @SEARCH_WORD = N'${searchWord}',
            @USER_ID = '${userId}'
        `
    }

    static deleteSearch({
        searchId,
        userId
    }) {

        return `
            DELETE FROM dbo.search_histories
            WHERE
                dbo.search_histories.${searchId ? 'search_id' : 'user_id'} = '${searchId ? searchId : userId}'
        `
    }
}