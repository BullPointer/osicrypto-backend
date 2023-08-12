const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Worker = require("../model/worker");

exports.get_workers = (req, res, next) => {
  Worker.find()
    .exec()
    .then((workers) => {
      res.status(200).json({
        message: "Staffs fetched successfully",
        users: workers.map((worker) => {
          return {
            _id: worker._id,
            username: worker.username,
            email: worker.email,
            password: worker.password,
            dateOfBirth: worker.dateOfBirth,
            status: worker.status,
            isAdmin: worker.isAdmin,
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/users/${worker._id}`,
            },
          };
        }),
      });
    })
    .catch();
};

exports.get_worker = (req, res, next) => {
  Worker.findById(req.params.workerId)
    .select("_id username email password dateOfBirth")
    .exec()
    .then((userObj) => {
      res.status(200).json({
        message: "Successful request for Staff by ID",
        order: {
          _id: userObj._id,
          username: userObj.username,
          email: userObj.email,
          password: userObj.password,
          dateOfBirth: userObj.dateOfBirth,
          status: userObj.status,
          isAdmin: userObj.isAdmin,
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
        message: "Staff not found",
        error: err,
      });
    });
};

exports.signup_worker = (req, res, next) => {
  Worker.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          const newWorker = new Worker({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hash,
            dateOfBirth: req.body.dateOfBirth,
            status: req.body.status,
            isAdmin: req.body.isAdmin,
          });
          newWorker
            .save()
            .then((result) => {
              res.status(201).json({
                message: "Staff created successfully",
              });
            })
            .catch();
        });
      } else {
        return res.status(400).json({
          message: "Staff already exists",
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

exports.login_worker = (req, res, next) => {
  Worker.find({ email: req.body.email })
    .exec()
    .then((worker) => {
      if (worker.length > 0) {
        bcrypt.compare(req.body.password, worker[0].password, (err, result) => {
          console.log(err);
          console.log(result);
          if (!result) {
            return res.status(401).json({
              // 401 means Unauthorized
              message: "Wrong email or password",
              error: "Failed to authenticate",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                username: worker[0].username,
                email: worker[0].email,
                userId: worker[0]._id,
              },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
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

exports.delete_worker = (req, res, next) => {
  Worker.findById(req.params.workerId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Staff not found",
        });
      }

      Worker.findByIdAndRemove({ _id: req.params.workerId })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Staff deleted successfully",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
