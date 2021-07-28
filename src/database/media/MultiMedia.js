module.exports = MultiMedia = () => {
    return new class {
        saveImage(iamge) {
            return new Promise((resolve, reject) => {
                resolve({})
            })
        }

        changeImage(oldImage, newImage) {
            return new Promise((resolve, reject) => {
                resolve({})
            })
        }

        deleteImage(imageName) {
            return new Promise((resolve, reject) => {
                resolve({})
            })
        }
    }()
}