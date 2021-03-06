exports.createPostValidator=(req,res,next)=>
{
    req.check('title','write the title').notEmpty()// checks title is not empty and if it is empty it shows the error "write title"
    req.check('title','title less then 30 more then 4 please!').isLength({
        min:4,
        max:20
    });

    req.check('body','write the title').notEmpty()// checks title is not empty and if it is empty it shows the error "write title"
    req.check('body','title less then 2000 more then 4 please!').isLength({
        min:4,
        max:2000
    });

    const errors=req.validationErrors()
    if(errors)
    {  const firstError=errors.map((error)=>error.msg)[0]
       return res.status(400).json({error:firstError})
    } 
     next();
}

exports.userSchemaValidator=(req,res,next)=>{
    req.check("name","Name is required").notEmpty();
    req.check("email","email required").notEmpty().matches(/.+\@.+\..+/).withMessage("email mush have @");

    req.check("password","password required").notEmpty();

    req.check('password').isLength({min:6})
                         .withMessage("password must contain atleast 6 charecters")
                         .matches(/\d/)
                         .withMessage("password must contain a number")


    const errors=req.validationErrors()
    if(errors)
    {  const firstError=errors.map((error)=>error.msg)[0]
       return res.status(400).json({error:firstError})
    } 
     next();
}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};