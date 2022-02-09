export const validCharacters = (str = "") => {
    if (!str || str.length <= 5) return false
    if (str.search(' ') >= 0) return false;

    const specialChars = /[`^$&()\'\"\[\]{};:\\|,.<>\/]/;
    return !specialChars.test(str);
}