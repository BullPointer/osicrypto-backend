const mongoose = require("mongoose");
const TermAndCondition = require("../model/termAndCondition");

exports.get_terms_and_conditions = (req, res, next) => {
  TermAndCondition.find()
    .select("_id notes date")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        message: "Terms-And-Conditions fetched successfully",
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

exports.create_or_edit_term_and_condition = async (req, res, next) => {
  const id = req.query.id;

  TermAndCondition.find()
    .exec()
    .then((result) => {
      if (result.length === 0) {
        try {
          const termAndCondition = new TermAndCondition({
            _id: new mongoose.Types.ObjectId(),
            notes: req.body.notes,
          });
          termAndCondition.save().then((data) => {
            return res.status(201).json({
              message: "Term-And-Condition created successfully",
              data: {
                notes: data.notes,
                date: data.date,
              },
              request: {
                type: "GET",
                description: "Get all Term-And-Condition",
                url: `http://localhost:3000/api/term-and-condition/`,
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
        TermAndCondition.find({ _id: id })
          .exec()
          .then((result) => {
            if (result.length === 0) {
              return res.status(404).json({
                message: "Term-And-Condition ID provided not found",
              });
            }

            TermAndCondition.findByIdAndUpdate(
              { _id: result[0]._id },
              { $set: { notes: req.body.notes, date: Date.now() } }
            )
              .exec()
              .then(() => {
                res.status(201).json({
                  message: "Term-And-Condition updated successfuly",
                  request: {
                    type: "GET",
                    description: "Get all Term-And-Condition",
                    url: `http://localhost:3000/api/Term-And-Condition/`,
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

exports.get_term_and_condition = (req, res, next) => {
  const id = req.params.policyId;

  TermAndCondition.findById(id)
    .select("_id notes date")
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          data: result,
          message: "Term-And-Condition not Found",
        });
      }
      res.status(200).json({
        data: result,
        message: "Term-And-Condition by ID fetched successfuly",
        request: {
          type: "POST",
          description: "Post request Term-And-Condition",
          url: `http://localhost:3000/api/term-and-condition/`,
        },
      });
    });
};

exports.delete_term_and_condition = (req, res, next) => {
  const id = req.params.id;

  TermAndCondition.findById(id)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          data: result,
          message: "Term-And-Condition not Found",
        });
      }
      TermAndCondition.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Term-And-Condition Deleted successfuly",
            request: {
              type: "POST",
              description: "Post location",
              url: `http://localhost:3000/api/term-and-condition/`,
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
