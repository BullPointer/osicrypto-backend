const mongoose = require("mongoose");
const Blog = require("../model/blog");
const { delete_uploaded_image } = require("../utils/handle-files");

exports.get_all_blogs = (req, res, next) => {
  Blog.find()
    .select("_id title subtitle notes author date category blogImage")
    .exec()
    .then((blogs) => {
      res.status(200).json({
        count: blogs.length,
        message: "Blogs fetched successfully",
        blogs: blogs?.map((blog) => {
          return {
            _id: blog._id,
            title: blog.title,
            subtitle: blog.subtitle,
            notes: blog.notes,
            author: blog.author,
            date: blog.date,
            category: blog.category,
            blogImage: blog.blogImage,
            status: blog.status,
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/blogs/${blog._id}`,
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
exports.get_blog = (req, res, next) => {
  const id = req.params.blogId;
  Blog.findById(id)
    .exec()
    .then((blog) => {
      if (!blog) {
        res.status(404).json({
          message: "Blog not Found",
          error: err,
        });
      }
      res.status(200).json({
        message: "",
        data: blog,
        request: {
          type: "GET",
          description: "Get all blogs",
          url: `http://localhost:3000/api/blogs/`,
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Blog not Found",
        error: err,
      });
    });
};

exports.create_blog = (req, res, next) => {
  try {
    const blog = new Blog({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      subtitle: req.body.subtitle,
      notes: req.body.notes,
      author: req.body.author,
      category: req.body.category,
      blogImage: req.file.path,
      status: req.body.status,
    });

    blog
      .save()
      .then((data) => {
        return res.status(201).json({
          message: "Blog created successfully",
          data: data,
          request: {
            type: "GET",
            description: "Get all blogs",
            url: `http://localhost:3000/api/blogs/`,
          },
        });
      })
      .catch((err) => {
        delete_uploaded_image(req.file.filename);
        res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    delete_uploaded_image(req.file.filename);
    res.status(500).json({
      error: err,
    });
  }
};

exports.update_blog = (req, res, next) => {
  const id = req.params.blogId;

  Blog.findById(id)
    .exec()
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }
      let updatedBlog = req.body;
      if (req.file) {
        delete_uploaded_image(blog.blogImage.split("/")[1]);
        updatedBlog["blogImage"] = req.file.path;
      }

      Blog.findByIdAndUpdate({ _id: id }, { $set: updatedBlog })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Blog updated successfully",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_blog = (req, res, next) => {
  const id = req.params.blogId;
  Blog.findById(id)
    .exec()
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }
      delete_uploaded_image(blog.blogImage.split("/")[1]);
      Blog.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Blog deleted successfully",
          });
        })
        .catch((err) => {
          res.status(403).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
