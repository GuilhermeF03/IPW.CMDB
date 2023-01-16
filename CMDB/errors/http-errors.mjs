const ERRORS_MAPPER = {
    e1: 500,// BAD GATEWAY
    e1: 400,//BAD REQUEST
    e2: 404,//NOT FOUND
    e3: 401 //UNAUTHORIZED
}

const DEFAULT_ERROR = {
    status: 500, 
    body:  {description: `An internal error occurred. Contact your system administrator.`} 
 }
 

export default function convertToHttpError(error) {
    const status = ERRORS_MAPPER[error.code]
    return status ?  {
            status: status, 
            body:  {message: error.error} 
        } 
        : DEFAULT_ERROR
}

export const errors = {
    BAD_GATEWAY: badGateway,
    BAD_REQUEST: badRequest,
    NOT_FOUND: notFound,
    NOT_AUTHORIZED: notAuthorized
}

function badGateway(){
    return {
       code : "e0",
       error : 'Was unable to establish a connection with the server, check your connection and try again.'
    }
}

function badRequest(message) {
    return {
        code: "e1",
        error: message || `Invalid request format, check <docs/cmdb-api-spec> for valid format.`
    }
}

function notFound(message) {
    return {
        code: "e2",
        error: message ||`The information you're trying to access couldn't be found. Check request format. `
    }
}

function notAuthorized(message) {
    return {
        code: "e3",
        error: message || `An invalid token was provided. Try again with a valid token.`
    }
}