
function isLoggedIn() {
    return localStorage.email &&
        localStorage.sessionCookie &&
        localStorage.userId
}

function getUserAccessLevel() {
    return Number(localStorage.accessLevel) || 1
}

export {
    isLoggedIn,
    getUserAccessLevel
}