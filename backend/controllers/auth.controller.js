import User from "../model/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json('User has been created successfully!');
    } catch (error) {
        next(error);
        
    }
};

export const signin = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Please enter correct email and password!'));
        
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict" }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


export const google = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
            const { password: pass, ...rest } = user._doc;
            res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict" }).status(200).json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatePassword, 10);

            const newUser = new User({
                username: req.body.name.split(' ').join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png",
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict" }).status(200).json(rest);
        }
    } catch (error) {
        next(error)
    }
};


export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json('User has been signed out successfully!');
  } catch (error) {
    next(error);
  }
};