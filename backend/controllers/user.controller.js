import passport from "passport";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import express from "express";
import csrf from "csrf";
import dotenv from "dotenv";
import {localStrategy} from "../configs/passport.config.js";


dotenv.config({path: ".env"});
const secret = process.env.JWT_SECRET;
const csrfProtection = new csrf();

export const createUser = (req, res, next) => {
  const user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function () {
      return res.json({message: "Create account successfully"});
    })
    .catch(function (error) {
      if (error.code === 11000) {
        console.log(error);
        return res
          .status(400)
          .send({error: "Username or E-mail already exists"});
      }
      next(error);
    });
};

export const localLogin = (req, res, next) => {
  passport.use(localStrategy);
  if (!req.body.user.email) {
    return res.status(422).json({errors: {email: "can't be blank"}});
  }
  if (!req.body.user.password) {
    return res.status(422).json({errors: {password: "can't be blank"}});
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      user.token = user.generateJWT();
      const cookieData = user.toAuthJSON();

      res.cookie("auth", cookieData, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: 0,
        path: "/",
        domain: "monkeydcar.website",
      });

      res.header(user.getIdJSON()).send("Login success");
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
};

export const getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const logout = async (req, res, next) => {
  const cookie_name = req.body.cookie_name;
  res.clearCookie(cookie_name, {
    path: "/",
  });
  res.clearCookie(cookie_name, {
    path: "/",
  });
  res.status(200).send("logout successfully");
};

export const checkLogin = async (req, res, next) => {
  return res.status(200).json({isLogin: true});
};

export const getNavbarInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.headers.user_id});
    return res.json(user);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
};

export const getCSRF = async (req, res, next) => {
  const token = csrfProtection.create(secret);
  res.cookie("csrf-token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  res.json({token});
};