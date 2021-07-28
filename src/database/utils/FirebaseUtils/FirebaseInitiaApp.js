const firebase = require('firebase')
const configure = require('./firebaseconfigure.json')
firebase.initializeApp({
    ...configure
})
module.exports = firebase