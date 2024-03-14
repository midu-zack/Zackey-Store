// get homepage
let homePage = (req, res) => {
  try {
    res.render('user/index');
  } catch (error) {
    console.error(error ,"rendering homage  ");
    res.status(500).send('Internal Server Error in home page');
  }
}


// get userAccount
let account = async (req,res)=>{
  try {
    
  } catch (error) {
    
  }
}

 
module.exports ={
    homePage ,
    account

} 