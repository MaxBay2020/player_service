export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    PLAYER = 'PLAYER'
}


export enum StatusCode {
    E200 = 200, // OK
    E400 = 400, // bad request due to client error
    E404 = 404, // resources NOT found,
    E500 = 500  // there is something wrong with server, please try again later
}

export enum Message {
    OK = 'OK',
    ErrParams = 'Necessary params NOT provided or invalid data',
    ErrSourceNotFound = 'Resource not found',
    ServerError = 'There is something wrong with server, please try again later'
}

class Log<T> {
    data: T
    statusCode: StatusCode
    message: Message

    constructor(data: T, statusCode: StatusCode, message: Message){
        this.data = data
        this.statusCode = statusCode
        this.message = message
    }

}

export default Log
