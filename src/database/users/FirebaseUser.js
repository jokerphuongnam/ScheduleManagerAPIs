const firebase = require('../utils/FirebaseUtils/FirebaseInitiaApp')
const admin = require('../utils/FirebaseUtils/FirebaseAdminInitiaApp')

module.exports = FirebaseUser = () => {
    const auth = firebase.auth()
    const adminAuth = admin.auth()

    return new class {
        get currentUser() {
            return auth.currentUser
        }

        signOut() {
            return auth.signOut()
        }

        loginWithEmailPass({
            email,
            password,
        }) {
            return new Promise((resolve, reject) => {
                auth.signInWithEmailAndPassword(email, password).then(() => {
                    resolve(this.currentUser.uid)
                }).catch((e) => {
                    reject(404)
                })
            })
        }
        
        register({
            email,
            password
        }) {
            return new Promise((resolve, reject) => {
                auth.createUserWithEmailAndPassword(email, password).then(() => {
                    resolve(this.currentUser.uid)
                }).catch((e) => {
                    console.log(e)
                    reject(409)
                })
            })
        }

        changePassword({
            loginId,
            oldPassword,
            newPassword
        }) {
            return new Promise((resolve, reject) => {
                adminAuth.getUser(loginId).then((userRecord) => {
                    return auth.signInWithEmailAndPassword(userRecord.email, oldPassword).then(() => {
                        this.currentUser.updatePassword(newPassword).then(() => {
                            resolve(userRecord.uid)
                        }).catch((e) => {
                            console.log(e)
                            reject(400)
                        })
                    })
                }).catch((e) => {
                    console.log(e)
                    reject(404)
                })
            })
        }

        forgotPassword(email) {
            return new Promise((resolve, reject) => {
                auth.sendPasswordResetEmail(email).then(() => {
                    resolve(200)
                }).catch(() => {
                    reject(404)
                })
            })
        }

        deleteUser() {
            return new Promise((resolve, reject) => {
                this.currentUser.delete().then(() => {
                        resolve(uid)
                    })
                    .catch(() => {
                        reject(404)
                    })
            })
        }
    }()
}