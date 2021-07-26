const msSqlUtils = require('../utils/MSSQLUtils/MSSQLUtils')
const QueryUtils = require('../utils/MSSQLUtils/QueryUtils')
const {
    removeBlankProperties
} = require('../utils/ObjecUtils/ObjectUtils')

// Object.prototype.removeBlankProperties = removeBlankProperties
Object.defineProperty(Object.prototype, 'removeBlankProperties', {
    value: removeBlankProperties,
    writable: true,
    configurable: true
})

module.exports = class MSSqlUsers {

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
                user = value
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
                user = value
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
                user = value
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

    editUser(user) {
        return new Promise((resolve, reject) => {
            msSqlUtils.execute(QueryUtils.editUser(user)).then((user) => {
                user = value
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