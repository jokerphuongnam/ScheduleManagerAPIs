const LoginType = require('../database/utils/loginType.json')
const MSSqlUsers = require('../database/users/MSSqlUsers')
const FirebaseUser = require('../database/users/FirebaseUser')

module.exports = UserRepository = () => {
    const mssqlUsers = MSSqlUsers()
    const firebaseUsers = FirebaseUser()

    function userResolve(user) {
        return {
            ...user,
            logins: user.logins.map((login) => {
                return login.login
            })
        }
    }

    return new class {
        getLoginIdByEmail(email) {
            return firebaseUsers.getLoginIdByEmail(email)
        }

        login({
            email,
            password,
            loginId,
            userId
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
                } else if (userId) {
                    mssqlUsers.login({
                        userId
                    })
                    .then((user) => {
                        resolve(userResolve(user))
                    }).catch((e) => {
                        reject(e)
                    })
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
                        type,
                        avatar
                    }).then((user) => {
                        resolve(userResolve(user))
                    })
                }

                if (loginId && loginType) {
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
                        resolve(userResolve(userByDatabase))
                    }).catch((e) => {
                        reject(e)
                    })
                })
            })
        }

        forgotPassword(email) {
            return firebaseUsers.forgotPassword(email)
        }

        editProfile(userInfo) {
            return new Promise((resolve, reject) => {
                mssqlUsers.editUser(userInfo).then((userByDatabase) => {
                    resolve(userResolve(userByDatabase))
                }).catch((e) => {
                    reject(e)
                })
            })
        }

        search(searchInfo){
            return mssqlUsers.search(searchInfo)
        }

        deleteSearch(searchInfo){
            return mssqlUsers.deleteSearch(searchInfo)
        }
    }()
}