import msSqlUtils from '../utils/MSSQLUtils/MSSQLUtils'
import QueryUtils from '../utils/MSSQLUtils/QueryUtils'
import {
    removeBlankProperties
} from '../utils/ObjecUtils/ObjectUtils'

// Object.prototype.removeBlankProperties = removeBlankProperties
Object.defineProperty(Object.prototype, 'removeBlankProperties', {
    value: removeBlankProperties,
    writable: true,
    configurable: true
})

export default class MSSqlUsers {

    getUserAndLogins(values) {
        let user = {
            ...values[0],
            logins: []
        }
        for (let index = 1; index < values.length; index++) {
            const {
                login,
                loginId
            } = values[index]
            if (login || loginId) {
                user.logins.push({
                    login,
                    loginId
                })
            } else {
                return user.removeBlankProperties()
            }
        }
        return user.removeBlankProperties()
    }

    login(user) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.login(user)).then((value) => {
                let user = value
                if (user) {
                    user = this.getUserAndLogins(value)
                    resolve(user)
                } else {
                    reject(404)
                }
            }).catch((e) => {
                reject(409)
            })
        })
    }

    createUser(user) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.createUser(user)).then((value) => {
                let user = value[0]
                if (user) {
                    user = this.getUserAndLogins(value)
                    resolve(user)
                } else {
                    reject(409)
                }
            }).catch((e) => {
                reject(409)
            })
        })
    }

    addToken(login) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.addToken(login)).then((value) => {
                let user = value[0]
                if (user) {
                    user = this.getUserAndLogins(value)
                    resolve(user)
                } else {
                    reject(409)
                }
            }).catch((e) => {
                reject(409)
            })
        })
    }
}