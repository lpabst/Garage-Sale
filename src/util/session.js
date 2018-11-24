
function isLoggedIn() {
    return localStorage.email &&
        localStorage.sessionCookie &&
        localStorage.userId
}

export {
    isLoggedIn
}