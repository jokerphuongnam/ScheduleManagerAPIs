const firebase = require('firebase')
const configure = require('./firebaseconfigure.json')
const temp = firebase.initializeApp({
    ...configure
})
module.exports = temp