class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        stack=""
    )
    {
       super(message)//override
       this.statusCode=statusCode
       this.data = null
       this.errors=errors
       this.message=message
       this.success =false;


       if(stack)
       {
        this.stack=stack
       }else{
        Error.captureStackTrace(this,this.constructor)
       }
    }
}