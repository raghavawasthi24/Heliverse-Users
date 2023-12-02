require("dotenv").config();
const course = require("../models/course");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require('axios');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const payload = { _id: user._id };
    const cookie_token = jwt.sign(payload, process.env.SECRET_KEY);
    res.cookie("jwt", cookie_token, {
      secure: true,
      expires: new Date(Date.now() + 10800),
      httpOnly: false,
    });
    if (password == user.password) {
      res.status(200).json({ msg: "Logeed in", jwt_token: cookie_token, id:user._id });
    } else {
      res.status(200).json({ msg: "password not matched" });
    }
  } else {
    res.status(200).json({ msg: "Not User" });
  }
};



const registerUser = async (req, res) => {
  const { name, email,gender, password } = req.body;

  // Check if the user already exists in the database
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'User is already registered' });
    }

    // If the user doesn't exist, create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      gender:gender
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const enrollUser = async(req, res) => {
  const {userId, courseId} = req.body;
  try{
    if(!userId && !courseId)
     return res.status(400).json({msg:"userId or courseId not provided"});
    else{
       const student =await User.findById(userId);
       const courses =await course.findById(courseId);
       const enroll = student.courses.filter((course)=>course.id==courseId)
       if(enroll.length==0){
        await student.updateOne({$push: {courses:{
          id:courseId,
          name:courses.name,
          instructor:courses.instructor,
          thumbnail:courses.thumbnail,
          due_date:courses.due_date,
          progress:"0",
          completed:false,
          liked:false
        }}})
        await courses.updateOne({$push: {students:{
          id:userId,
          name:student.name,
          email:student.email
        }}})
        return res.status(200).json({msg:"student enrolled in course successfully"})
       }
       else{
        return res.status(404).json({msg:"student already enrolled"})
       }
    }
  }
  catch (err){
    console.log(err);
    res.status(500).json(err);
  }
}



// const getUser= async (req,res)=>{
//     const {id} = req.body;
//     if(id){
//         const user = await User.findById(id);
//         if(user)
//         {
//            res.status(200).json({"msg":"user found","data":{
//             "name":user.name,
//             "number":user.number
//            }});
//         }
//         else{
//             res.status(200).json({"msg":"user not found"});
//         }
//     }
//     else{
//         res.status(200).json({"msg":"id not found"});
//     }
// }


module.exports = { loginUser, registerUser, enrollUser };