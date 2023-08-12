const mongoose = require("mongoose");
const Faq = require("../model/faq");

exports.get_faqs = (req, res, next) => {
  Faq.find()
    .select("_id question type answer status date")
    .exec()
    .then((faqs) => {
      res.status(200).json({
        count: faqs.length,
        message: "Faqs fetched successfully",
        data: faqs.map((faq) => {
          return {
            _id: faq._id,
            question: faq.question,
            type: faq.type,
            answer: faq.answer,
            status: faq.status,
            date: faq.date,
          };
        }),
      });
    })
    .catch((error) =>
      res.status(500).json({
        error: err,
      })
    );
};

exports.create_faqs = (req, res, next) => {
  try {
    const faq = new Faq({
      _id: new mongoose.Types.ObjectId(),
      question: req.body.question,
      type: req.body.type,
      answer: req.body.answer,
      status: req.body.status,
    });
    faq
      .save()
      .then((data) => {
        res.status(201).json({
          message: "FaQ created successfully",
          data: data,
          request: {
            type: "GET",
            description: "Get all faqs",
            url: `http://localhost:3000/api/faqs/`,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error from the request body",
          error: error,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error from the request body",

      error: error,
    });
  }
};

exports.get_faq = (req, res, next) => {
  const id = req.params.faqId;
  Faq.findById(id)
    .select("_id question type answer status date")
    .exec()
    .then((faq) => {
      if (!faq) {
        return res.status(404).json({
          data: faq,
          message: "Faq not Found",
        });
      }
      res.status(200).json({
        data: faq,
        message: "Faq by ID fetched successfuly",
        request: {
          type: "POST",
          description: "Post blogs",
          url: `http://localhost:3000/api/faqs/`,
        },
      });
    });
};

exports.edit_faq = (req, res, next) => {
  const id = req.params.faqId;

  Faq.findById(id)
    .exec()
    .then((faq) => {
      if (!faq) {
        return res.status(404).json({
          message: "FaQ not found",
        });
      }
      const updatedBlog = {};
      for (const faqArr of req.body) {
        updatedBlog[faqArr.key] = faqArr.value;
      }

      Faq.findByIdAndUpdate({ _id: id }, { $set: updatedBlog })
        .exec()
        .then(() => {
          res.status(201).json({
            message: "FaQ updated successfuly",
            request: {
              type: "GET",
              description: "Get all faqs",
              url: `http://localhost:3000/api/faqs/`,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({
            message:
              "Please, please provide a valid ID and make sure body request is an array [key: value]",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.delete_faq = (req, res, next) => {
  const id = req.params.faqId;

  Faq.findById(id)
    .exec()
    .then((faq) => {
      if (!faq) {
        return res.status(404).json({
          data: faq,
          message: "Faq not Found",
        });
      }
      Faq.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Faq Deleted successfuly",
            request: {
              type: "POST",
              description: "Post blogs",
              url: `http://localhost:3000/api/faqs/`,
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
