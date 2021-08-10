const admin = require('firebase-admin')
const configure = require('./firebaseconfigure.json')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
    ...configure,
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin