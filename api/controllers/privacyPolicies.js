const mongoose = require("mongoose");
const PrivacyPolicy = require("../model/privacyPolicy");

exports.get_privacy_policies = (req, res, next) => {
  PrivacyPolicy.find()
    .select("_id notes date")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        message: "Privacy-Policy fetched successfully",
        data: docs.map((doc) => {
          return {
            _id: doc._id,
            notes: doc.notes,
          };
        }),
      });
    })
    .catch((error) =>
      res.status(500).json({
        error: error,
      })
    );
};

exports.create_or_edit_privacy_policies = async (req, res, next) => {
  const id = req.query.id;

  PrivacyPolicy.find()
    .exec()
    .then((result) => {
      if (result.length === 0) {
        try {
          const privacyPolicy = new PrivacyPolicy({
            _id: new mongoose.Types.ObjectId(),
            notes: req.body.notes,
          });
          privacyPolicy.save().then((data) => {
            return res.status(201).json({
              message: "Privacy-Policy created successfully",
              data: {
                notes: data.notes,
                date: data.date,
              },
              request: {
                type: "GET",
                description: "Get all Privacy-Policy",
                url: `http://localhost:3000/api/privacy-policy/`,
              },
            });
          });
        } catch (error) {
          console.log(error);
          res.status(400).json({
            message: "Error from the request body",

            error: error,
          });
        }
      } else {
        PrivacyPolicy.find({ _id: id })
          .exec()
          .then((result) => {
            if (result.length === 0) {
              return res.status(404).json({
                message: "Privacy-Policy ID provided not found",
              });
            }

            PrivacyPolicy.findByIdAndUpdate(
              { _id: result[0]._id },
              { $set: { notes: req.body.notes, date: Date.now() } }
            )
              .exec()
              .then(() => {
                res.status(201).json({
                  message: "Privacy-Policy updated successfuly",
                  request: {
                    type: "GET",
                    description: "Get all Privacy-Policy",
                    url: `http://localhost:3000/api/privacy-policy/`,
                  },
                });
              })
              .catch((error) => {
                res.status(400).json({
                  message:
                    "Please, please provide a valid ID and make sure body request is an object {key: value}",
                  error: error,
                });
              });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      }
    });
};

exports.get_privacy_policy = (req, res, next) => {
  const id = req.params.policyId;

  PrivacyPolicy.findById(id)
    .select("_id notes date")
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          data: result,
          message: "Privacy-Policy not Found",
        });
      }
      res.status(200).json({
        data: result,
        message: "Privacy-Policy by ID fetched successfuly",
        request: {
          type: "POST",
          description: "Post Privacy-Policy",
          url: `http://localhost:3000/api/privacy-policy/`,
        },
      });
    });
};

exports.delete_privacy_policies = (req, res, next) => {
  const id = req.params.policyId;

  PrivacyPolicy.findById(id)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          data: result,
          message: "Privacy-Policy not Found",
        });
      }
      PrivacyPolicy.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Privacy-Policy Deleted successfuly",
            request: {
              type: "POST",
              description: "Post location",
              url: `http://localhost:3000/api/privacy-policy/`,
            },
          });
        })
        .catch((error) => {
          res.status(404).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
