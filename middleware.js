module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash('error','You Must Be LogIn')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveOriginalUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        console.log('set')
       res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}