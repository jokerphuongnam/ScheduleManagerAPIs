import firebase from 'firebase'
import configure from './firebaseconfigure.json'

firebase.initializeApp({
    ...configure
})

export default firebase