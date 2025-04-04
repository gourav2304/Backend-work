class ApiError extends Error{
   constructor(
    StatusCode ,
    message= 'Something went wrong',
    errors = [],
    Stack = " "
   ){  
    super(message)
    this.StatusCode = StatusCode
    this.data = null
    this.message = message
    this.success = false;
    this.errors = errors

    if (Stack){
        this.Stack = Stack
    } else{
        Error.captureStackTrace(this, this.constructor)
    }
}
}
export {ApiError}