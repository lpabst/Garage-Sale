
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkResponse(data, history) {
    if (data.error || !data.success) {
        if (data.message.match(/invalid session cookie | please log in/i)) {
            return history.push('/login');
        }
        alert(data.message);
    }
    return data;
}

export {
    validateEmail,
    checkResponse
}