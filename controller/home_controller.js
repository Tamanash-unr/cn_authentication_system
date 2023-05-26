// Show Home Page
module.exports.home = function(req, res){
    return res.render('home',{
        title: 'Authsys | Home'
    })
}