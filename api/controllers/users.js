const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Token = require("../model/token");
const {
  verify_mail_token,
  reset_password_mail,
  completed_registration,
} = require("../utils/handle-nodemailer");

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

exports.get_user = async (req, res, next) => {
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

exports.req_reset_password = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = await Token.findOne({ userId: String(user._id) });

      if (!user) return res.status(404).send("User not found!");

      if (!token) {
        const savetoken = await new Token({
          userId: String(user._id),
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        await reset_password_mail(
          String(user._id),
          user.username,
          user.email,
          savetoken.token
        );

        return res.status(200).json({
          message: "Reset link has successfully been sent to your email!",
        });
      } else {
        await reset_password_mail(
          String(user._id),
          user.username,
          user.email,
          token.token
        );

        return res.status(200).json({
          message: "Reset link has successfully been sent to your email!",
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found in our database",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

exports.reset_password = async (req, res, next) => {
  const { id, token, password } = req.body;
  const user = await User.findOne({ _id: id });

  if (!user) return res.status(400).send("Invalid credentials");

  const tokenData = await Token.findOne({ userId: id, token: token });

  if (!tokenData) return res.status(400).send("Invalid credentials");

  bcrypt.hash(password, 10, (err, hash) => {
    user.password = hash;
    user.save();
    Token.findByIdAndRemove({ _id: String(tokenData._id) })
      .then(() => {
        return res.status(200).json({
          message: "Password reset completed successfully!",
        });
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json({
          message: "Internal server error",
          error: error,
        });
      });
  });
};

exports.confirm_email = async (req, res, next) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: id });

  if (!user) return res.status(400).send("Invalid link");

  const tokenData = await Token.findOne({ userId: id, token: token });

  if (!tokenData) return res.status(400).send("Invalid link");
  console.log(user.email, user.username);
  user.verified = true;
  user.save().then(() => {
    Token.findByIdAndRemove({ _id: String(tokenData._id) })
      .then(() => {
        completed_registration(user.username, user.email);
        return res.status(200).json({
          message: "Email successfully confirmed!!",
        });
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json({
          message: "Internal server error",
          error: error,
        });
      });
  });
};

exports.signup_users = async (req, res, next) => {
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
            .then(async (result) => {
              const savetoken = await new Token({
                userId: result._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();
              await verify_mail_token(
                result._id,
                result.username,
                result.email,
                savetoken.token
              );

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
                message: "A confirmation link has been sent to your email",
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
        message: "Internal server error",
        error: err,
      });
    });
};

exports.login_users = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        const token = jwt.sign(
          {
            username: user[0].username,
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "5h" }
        );

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              // 401 means Unauthorized
              message: "Auth failed",
              error: "Failed to authenticate",
            });
          }
          if (result && !user[0].verified) {
            Token.findOne({
              userId: String(user[0]._id),
            }).then((data) => {
              verify_mail_token(
                String(user[0]._id),
                user[0].username,
                user[0].email,
                data.token
              );
              return res.status(200).json({
                verified: false,
                message: "A confirmation link has been sent to your email",
                token: token,
              });
            });
          }
          if (result && user[0].verified) {
            return res.status(200).json({
              verified: true,
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
