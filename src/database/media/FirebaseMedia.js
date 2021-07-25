import admin from '../utils/FirebaseUtils/FirebaseAdminInitiaApp'

export default class FirebaseMedia {
    storage = admin.storage()
    
    get ref() {
        return storage.ref()
    }

    saveAvatar(avatar) {
        return new Promise((resolve, reject) => {
            const blob = this.bucket.file(avatar.filename)
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: avatar.mimetype
                }
            })
            blobWriter.on('finish', () => {
                resolve(200)
            })
            blobWriter.on('error', () => {
                reject(409)
            })
            blobWriter.end(avatar.buffer)
        })
    }

    getAvatar(uid){
        return new Promise((resolve, reject)=>{

        })
    }
}