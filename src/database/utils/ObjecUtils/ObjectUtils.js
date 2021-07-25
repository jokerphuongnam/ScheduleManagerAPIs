function removeBlankProperties() {
    for (let propName in this) {
        if (!this[propName]) {
            delete this[propName]
        }
    }
    return this
}

export {
    removeBlankProperties
}