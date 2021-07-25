import admin from 'firebase-admin'
import configure from './firebaseconfigure.json'
import serviceAccount from './private-key.json'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...configure
})

export default admin