const LoginType = require('../database/utils/loginType.json')
const MSSqlUsers = require('../database/users/MSSqlUsers')
const FirebaseUser = require('../database/users/FirebaseUser')
const MultiMedia = require('../database/media/MultiMedia')

module.exports = UserRepository = () => {
    const mssqlUsers = MSSqlUsers()
    const firebaseUsers = FirebaseUser()
    const media = MultiMedia()

    function userResolve(user) {
        return {
            ...user,
            logins: user.logins.map((login) => {
                return login.login
            })
        }
    }

    return new class {
        login({
            email,
            password,
            loginId
        }) {
            return new Promise((resolve, reject) => {
                const login = (id) => {
                    mssqlUsers.login({
                            loginId: id
                        })
                        .then((user) => {
                            resolve(userResolve(user))
                        }).catch((e) => {
                            reject(e)
                        })
                }
                if (loginId) {
                    login(loginId)
                } else {
                    firebaseUsers.loginWithEmailPass({
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
                    return mssqlUsers.createUser({
                        firstName,
                        lastName,
                        birthday,
                        gender,
                        loginId: uid,
                        type
                    }).then((user) => {
                        resolve(userResolve(user))
                    })
                }

                if ((!firstName || !lastName || !birthday || !gender) || (((loginId && loginType) && (email && password)))) {
                    reject(400)
                } else if (loginId && loginType) {
                    createUser(loginId, loginType).catch((e) => {
                        reject(e)
                    })
                } else if (email && password) {
                    firebaseUsers.register({
                        email,
                        password
                    }).then((uid) => {
                        return createUser(uid, LoginType.emailPass)
                            .catch((e) => {
                                console.log(e)
                                firebaseUsers.deleteUser()
                                    .then(() => {
                                        reject(e)
                                    })
                                    .catch((err) => {
                                        reject(e)
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
            email,
            password,
            loginId,
            loginType
        }) {
            return new Promise((resolve, reject) => {
                const add = (tokenId, type) => mssqlUsers.addToken({
                    userId,
                    loginId: tokenId,
                    type
                }).then((user) => {
                    resolve(userResolve(user))
                })

                if (loginId && loginType) {
                    add(loginId, loginType).catch((e) => {
                        reject(e)
                    })
                } else if (email && password) {
                    firebaseUsers.register({
                        email,
                        password
                    }).then((uid) => {
                        return add(uid, LoginType.emailPass)
                            .catch((e) => {
                                console.log(e)
                                return firebaseUsers.deleteUser()
                                    .then(() => {
                                        reject(e)
                                    })
                                    .catch((err) => {
                                        reject(e)
                                    })
                            })
                    }).catch((e) => {
                        reject(e)
                    })
                }
            })
        }

        changePassword(user) {
            return new Promise((resolve, reject) => {
                mssqlUsers.login(user).then((userByDatabase) => {
                    const loginId = userByDatabase.logins.filter((e) => {
                        return e.login === LoginType.emailPass
                    }).map((e) => {
                        return e.loginId
                    })[0]
                    firebaseUsers.changePassword({
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
            return firebaseUsers.forgotPassword(email)
        }

        editProfile({
            userId,
            avatar,
            firstName,
            lastName,
            birthday,
            gender,
            avatarFile
        }) {
            return new Promise((resolve, reject) => {
                //{userId, avatar, firstName, lastName, birthday, gender}
                const editUser = (params) => mssqlUsers.editUser({
                    ...params
                }).then((user) => {
                    resolve(userResolve(user))
                })

                if (!userId) {
                    reject(400)
                    return
                }
                if (!avatarFile && !avatar) {
                    editUser({
                        userId,
                        avatar: null,
                        firstName,
                        lastName,
                        birthday,
                        gender
                    }).catch((e) => {
                        reject(e)
                    })
                } else if (avatarFile) {
                    editUser({
                        userId,
                        avatar: 'avatar',
                        firstName,
                        lastName,
                        birthday,
                        gender
                    }).catch((e) => {
                        reject(e)
                    })
                } else {
                    editUser({
                        userId,
                        avatar: undefined,
                        firstName,
                        lastName,
                        birthday,
                        gender
                    }).catch((e) => {
                        reject(e)
                    })
                }
            })
        }
    }()
}