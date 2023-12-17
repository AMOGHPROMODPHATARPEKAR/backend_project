class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        statck=""
    )
    {
       super(message)//override
       this.statusCode=statusCode
       this.data = null
       this.errors=errors
       this.message=message
       this.success =false;


       if(statck)
       {
        this.stack=statck
       }else{
        Error.captureStackTrace(this,this.constructor)
       }
    }
}