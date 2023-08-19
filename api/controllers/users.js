const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.get_users = (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json({
        count: users.length,
        message: "Users fetched successfully",
        users: users.map((user) => {
          return {
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            country: user.country,
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/users/${user._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_user = (req, res, next) => {
  User.findById(req.params.userId)
    .select("_id username email password country")
    .exec()
    .then((userObj) => {
      res.status(200).json({
        message: "Successful request for User by ID",
        order: {
          _id: userObj._id,
          username: userObj.username,
          email: userObj.email,
          password: userObj.password,
          country: userObj.country,
          request: {
            type: "GET",
            description: "Make a get request by Id",
            url: `http://localhost:3000/api/users/`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "User not found",
        error: err,
      });
    });
};

exports.signup_users = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hash,
            country: req.body.country,
          });
          newUser
            .save()
            .then((result) => {
              const token = jwt.sign(
                {
                  username: result.username,
                  email: result.email,
                  userId: result._id,
                },
                process.env.JWT_KEY,
                { expiresIn: "5h" }
              );
              res.status(201).json({
                message: "User created successfully",
                token: token,
              });
            })
            .catch();
        });
      } else {
        return res.status(400).json({
          message: "User already exists",
          error: "Failed to authenticate",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.login_users = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          console.log(err);
          console.log(result);
          if (!result) {
            return res.status(401).json({
              // 401 means Unauthorized
              message: "Auth failed",
              error: "Failed to authenticate",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                username: user[0].username,
                email: user[0].email,
                userId: user[0]._id,
              },
              process.env.JWT_KEY,
              { expiresIn: "5h" }
            );

            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          }
        });
      } else {
        res.status(401).json({
          message: "Auth failed",
          error: "Failed to authenticate",
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        message: "Auth failed",
        error: "Failed to authenticate",
      });
    });
};

exports.delete_users = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      User.findByIdAndRemove({ _id: req.params.userId })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "User deleted successfully",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
