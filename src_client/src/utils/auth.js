export const validCharacters = (str = "") => {
    if (!str || str.length <= 5) return false
    if (str.search(' ') >= 0) return false;

    const specialChars = /[`^$&()\'\"\[\]{};:\\|,.<>\/]/;
    return !specialChars.test(str);
}

export const atleast6Characters = (str = "") => {
    if (!str || str.length <= 5) return false
    return true;
}
export const doesNotContainsSpecialCharacters = (str = "") =>{
    if(str.trim().length === 0) return false
    const specialChars = /[`^$&()\'\"\[\]{};:\\|,.<>\/]/;
    return !specialChars.test(str);   
}
export const doesNotContainsSpace = (str = "")=>{
    if(str.trim().length === 0) return false    
    if (str.search(' ') >= 0) return false;
    return true
}

export const doesPasswordAndConfirmPasswordMatched= (srcString="",destString="")=>{
    if(srcString.trim().length === 0 || destString.trim().length === 0) return false
    if(srcString === destString) return true
    return false
}