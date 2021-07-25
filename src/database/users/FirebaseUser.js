import firebase from '../utils/FirebaseUtils/FirebaseInitiaApp'
import admin from '../utils/FirebaseUtils/FirebaseAdminInitiaApp'

export default class FirebaseUser {
    auth = firebase.auth()
    adminAuth = admin.auth()

    get currentUser() {
        return this.auth.currentUser
    }

    loginWithEmailPass({
        email,
        password,
    }) {
        return new Promise((resolve, reject) => {
            this.auth.signInWithEmailAndPassword(email, password).then(() => {
                resolve(this.currentUser.uid)
            }).catch((e) => {
                reject(404)
            }).finally(()=>{
                return this.auth.signOut()
            })
        })
    }

    register({
        email,
        password
    }) {
        return new Promise((resolve, reject) => {
            this.auth.createUserWithEmailAndPassword(email, password).then(() => {
                resolve(this.currentUser.uid)
            }).catch((e) => {
                reject(409)
            }).finally(()=>{
                return this.auth.signOut()
            })
        })
    }

    changePassword({
        loginId,
        oldPassword,
        newPassword
    }) {
        return new Promise((resolve, reject) => {
            this.adminAuth.getUser(loginId).then((userRecord) => {
                return this.auth.signInWithEmailAndPassword(userRecord.email, oldPassword).then(() => {
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
            }).finally(()=>{
                return this.auth.signOut()
            })
        })
    }

    forgotPassword(email) {
        return new Promise((resolve, reject) => {
            this.auth.sendPasswordResetEmail(email).then(() => {
                resolve(200)
            }).catch(() => {
                reject(404)
            })
        })
    }

    deleteUser() {
        return new Promise((resolve, reject) => {
            const {
                uid
            } = {
                ...this.currentUser.uid
            }
            this.currentUser.delete().then(() => {
                    resolve(uid)
                })
                .catch(() => {
                    reject(404)
                })
        })
    }

    logout() {
        return this.auth.signOut()
    }
}