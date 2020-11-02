module.exports = {

    validatePlate: function(plate) {
        const regexPlate = /^[a-zA-Z]{3}[0-9]{4}$/;
        const regexPlateMerc = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}$/;
        if (regexPlate.test(plate)) {
            return true
        } else if (regexPlateMerc.test(plate)) {
            return true
        } else {
            return false
        }
    }
}