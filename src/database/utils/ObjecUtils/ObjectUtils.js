function removeBlankProperties() {
    for (let propName in this) {
        if (this[propName] === undefined || this[propName] === null || this[propName] == undefined || this[propName] == null) {
            delete this[propName]
        }
    }
    return this
}

function exportFromBodyForUser() {
    const gender = this.body.gender
    const birthday = Number(this.body.birthday)
    return this.body ? {
        ...this.body,
        birthday: Number.isNaN(birthday) ? undefined : birthday,
        avatar: this.file,
        gender: gender ? typeof gender === 'string' ? gender.toLowerCase() == 'true' ? true : false : typeof gender === 'boolean' ? gender : undefined : undefined
    } : this
}

function clearQuery() {
    const index = this.indexOf(',')
    return this.slice(0, index) + this.slice(index + 1)
}

function convertEmtpyStringToNull() {
    if (this.trim() == '') {
        return null
    }
    return this
}

module.exports = {
    removeBlankProperties,
    exportFromBodyForUser,
    clearQuery,
    convertEmtpyStringToNull
}