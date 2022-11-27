const ERRORS_MAPPER = {
    e1: 500,// BAD GATEWAY
    e1: 400,//BAD REQUEST
    e2: 404,//NOT FOUND
    e3: 401 //UNAUTHORIZED
}

const DEFAULT_ERROR = {
    status: 500, 
    body:  {
        description: `An internal error occurred. Contact your system administrator.`
    } 
 }
 

export function convertToHttpError(error) {
    const status = ERRORS_MAPPER[error.code]
    return status ?  
        {
            status: status, 
            body:  {description: error.error} 
        } 
        : DEFAULT_ERROR
}

function getTasks(token){
    //TODO verify if userToken is not undefined
    //TODO verify if userToken is associated to user
    //TODO tasks of user
    return data.getUserByToken(token)
            .then(user => data.getTasksByUserId(user.id))
            .catch(error => Promise.reject(errors.NOT_AUTHORIZED())) 
            //Verify if is NOT_FOUND error from getUserByToken 
}


export const errors = {
    BAD_GATEWAY: badGateway,
    BAD_REQUEST: badRequest,
    NOT_FOUND: notFound,
    NOT_AUTHORIZED: notAuthorized
}

function badGateway(){
    return {
       code : e0,
       error : 'Was unable to connect to server, check your connection'
    }
}

function badRequest(id) {
    return {
        code: "e1",
        error: `${id.toString()} is not a valid id`
    }
}

function notFound(id) {
    return {
        code: "e2",
        error: `${id} not found`
    }
}

function notAuthorized() {
    return {
        code: "e3",
        error: `is not authorized`
    }
}