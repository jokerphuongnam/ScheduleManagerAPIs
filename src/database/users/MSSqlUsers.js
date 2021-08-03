const msSqlUtils = require('../utils/MSSQLUtils/MSSQLUtils')
const QueryUtils = require('../utils/MSSQLUtils/QueryUtils')
const fs = require('fs')
const {
    dest
} = require('../media/MediaDest.json')
const {
    removeBlankProperties
} = require('../utils/ObjecUtils/ObjectUtils')

// Object.prototype.removeBlankProperties = removeBlankProperties
Object.defineProperty(Object.prototype, 'removeBlankProperties', {
    value: removeBlankProperties,
    writable: true,
    configurable: true
})

module.exports = MSSqlUsers = () => {
    function getUserAndLogins(values) {
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

    return new class {
        login(user) {
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.login(user)).then((value) => {
                    user = value
                    if (user) {
                        user = getUserAndLogins(value)
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
                        user = getUserAndLogins(value)
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
                    let user = value
                    if (user) {
                        user = getUserAndLogins(value)
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
                msSqlUtils.execute(QueryUtils.editUser(user)).then((value) => {
                    user = value
                    if (user) {
                        user = getUserAndLogins(value)
                        if (user.oldAvatar) {
                            fs.unlinkSync(`${dest}${user.oldAvatar}`)
                        }
                        delete user.oldAvatar
                        resolve(user)
                    } else {
                        reject(404)
                    }
                }).catch((e) => {
                    reject(409)
                })
            })
        }

        search(searchInfo){
            return new Promise((resolve, reject) => {
                msSqlUtils.execute(QueryUtils.search(searchInfo)).then((value) => {
                    resolve(value)
                }).catch((e) => {
                    console.log(e)
                    reject(409)
                })
            })
        }

        deleteSearch(searchInfo){
            return new Promise((resolve, reject)=>{
                msSqlUtils.execute(QueryUtils.deleteSearch(searchInfo)).then( ()=> {
                    resolve(200)
                }).catch((e) => {
                    reject(409)
                })
            })
        }
    }()
}