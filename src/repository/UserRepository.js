const loginType = require('../database/utils/loginType.json')
const MSSqlUsers = require('../database/users/MSSqlUsers')
const FirebaseUser = require('../database/users/FirebaseUser')
const MultiMedia = require('../database/media/MultiMedia')

module.exports = class UserRepository {
    mssqlUsers = new MSSqlUsers()
    firebaseUsers = new FirebaseUser()
    media = new MultiMedia()

    userResolve(user) {
        return {
            ...user,
            logins: user.logins.map((login) => {
                return login.login
            })
        }
    }
    
     login({
        email,
        password,
        loginId
    }) {
        return new Promise((resolve, reject) => {
            const login = (id) => {
                this.mssqlUsers.login({
                        loginId: id
                    })
                    .then((user) => {
                        resolve(this.userResolve(user))
                    }).catch((e) => {
                        reject(e)
                    })
            }
            if (loginId) {
                login(loginId)
            } else {
                this.firebaseUsers.loginWithEmailPass({
                        email,
                        password
                    })
                    .then((userIdFromFirebase) => {
                        login(userIdFromFirebase)
                    }).catch((e) => {
                        reject(e)
                    })
            }
        })
    }

    register({
        email,
        password,
        firstName,
        lastName,
        birthday,
        gender,
        loginId,
        loginType,
        avatar
    }) {
        return new Promise((resolve, reject) => {
            const createUser = (uid, type) => {
                return this.mssqlUsers.createUser({
                    firstName,
                    lastName,
                    birthday,
                    gender,
                    uid,
                    type
                }).then((user) => {
                    if (avatar) {
                        avatar.filename = user.userId
                        this.media.saveAvatar(avatar).then(() => {
                            resolve(user)
                        }).catch((e) => {
                            console.log(e)
                        })
                    }
                    resolve(user)
                }).catch((e) => {
                    reject(e)
                })
            }
            if ((!firstName || !lastName || !birthday || !gender) || (((loginId && loginType) && (email && password)))) {
                reject(400)
            } else if (loginId && loginType) {
                createUser(loginId, loginType).catch((e) => {
                    reject(e)
                })
            } else if (email && password) {
                this.firebaseUsers.register({
                    email,
                    password
                }).then((uid) => {
                    return createUser(uid, loginType.emailPass)
                        .catch((e) => {
                            this.mssqlUsers.deleteUser()
                                .then((uid) => {
                                    reject(e)
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        })
                }).catch((e) => {
                    reject(e)
                })
            } else {
                reject(400)
            }
        })
    }

    addToken({
        userId,
        loginId,
        type
    }) {
        return new Promise((resolve, reject) => {
            this.mssqlUsers.addToken({
                userId,
                loginId,
                type
            }).then((user) => {
                resolve(user)
            }).catch((e) => {
                reject(e)
            })
        })
    }

    changePassword(user) {
        return new Promise((resolve, reject) => {
            this.mssqlUsers.login(user).then((userByDatabase) => {
                const loginId = userByDatabase.logins.filter((e) => {
                    return e.login === loginType.emailPass
                }).map((e) => {
                    return e.loginId
                })[0]
                this.firebaseUsers.changePassword({
                    ...user,
                    loginId
                }).then(() => {
                    resolve(this.userResolve(userByDatabase))
                }).catch((e) => {
                    reject(e)
                })
            })
        })
    }

    forgotPassword(email) {
        return this.firebaseUsers.forgotPassword(email)
    }

    editProfile(user) {
        return new Promise((resolve, reject) => {
            //{userId, avatar, firstName, lastName, birthday, gender}
            const editUser = (params) => {
                return this.mssqlUsers.editUser({
                    ...params,
                    avatar: params.avatar ? params.avatar : null
                }).then((user) => {
                    resolve(user)
                }).catch((e) => {
                    reject(e)
                })
            }

            if (user.filename) {

            }
        })
    }
}