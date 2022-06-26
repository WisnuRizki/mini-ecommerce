
function validateRequest(req,res,next,schema){
    const {error,value} = schema.validate(req.body);

    if(error){
        return res.status(400).json({
            message: 'Bad Request',
            error: error
        })
    }else{
        req.body = value;
        next();
    }
}

module.exports = {
    validateRequest
}