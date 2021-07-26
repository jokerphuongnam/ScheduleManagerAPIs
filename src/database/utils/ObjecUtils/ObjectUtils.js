function removeBlankProperties() {
    for (let propName in this) {
        if (!this[propName]) {
            delete this[propName]
        }
    }
    return this
}

function exportFromBodyForUser(){
    return this.body? {
        ...this.body,
        birthday: Number(this.body.birthday),
        avatar: this.file,
        gender: this.body.gender.toLowerCase() == 'true' ? true : false
    }: this
}

module.exports = {
    removeBlankProperties,
    exportFromBodyForUser
}