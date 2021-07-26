const admin = require('firebase-admin')
const configure = require('./firebaseconfigure.json')
const serviceAccount = require('./private-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...configure
})

module.exports = admin