import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Blog from '../models/blog';
import mongoose from 'mongoose';

const create = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to register blog ...');

  let { author, title, content, headline, picture } = req.body;

  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
    content,
    headline,
    picture
  });

  return blog
    .save()
    .then((newBlog) => {
      logging.info('New blog created...');

      return res.status(200).json({ blog: newBlog });
    })
    .catch((error) => {
      logging.error(error.message);
      logging.error(blog._id);
      return res.status(500).json({
        message: error.message
      });
    });
};

const read = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogID;
  logging.info(`Incoming read for blog with id ${_id}`);

  Blog.findById(_id)
    .exec()
    .then((blog) => {
      if (blog) {
        return res.status(200).json({
          blog: blog
        });
      } else {
        return res.status(404).json({
          error: 'Blog not found.'
        });
      }
    })
    .catch((error) => {
      logging.error(error.message);

      return res.status(500).json({
        error: error.message
      });
    });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
  logging.info('readAll route called');
  logging.info(req.params.uid);
  Blog.find()
    .exec()
    .then((blogs) => {
      return res.status(200).json({
        count: blogs.length,
        blogs: blogs
      });
    })
    .catch((error) => {
      logging.error(error.message);

      return res.status(500).json({
        message: error.message
      });
    });
};

const query = (req: Request, res: Response, next: NextFunction) => {
  logging.info('query time...');

  Blog.find(req.body)
    .exec()
    .then((blogs) => {
      return res.status(200).json({
        count: blogs.length,
        blogs: blogs
      });
    })
    .catch((error) => {
      logging.error(error.message);

      return res.status(500).json({
        message: error.message
      });
    });
};

const update = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogID;
  logging.info(`Incoming update for blog with id ${_id}`);

  Blog.findById(_id)
    .exec()
    .then((blog) => {
      if (blog) {
        blog.set(req.body);

        blog
          .save()
          .then((newBlog) => {
            logging.info(`Blog updated ...`);
            return res.status(201).json({ blog: newBlog });
          })
          .catch((error) => {
            logging.error(error);
            return res.status(500).json({
              error
            });
          });
      } else {
        return res.status(404).json({
          error: 'Blog not found.'
        });
      }
    })
    .catch((error) => {
      logging.error(error.message);

      return res.status(500).json({
        message: error.message
      });
    });
};

const deleteBlog = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogID;

  logging.warn(`Incoming delete for blog with id ${_id}`);

  Blog.findByIdAndDelete(_id)
    .exec()
    .then((blog) => {
      return res.status(201).json({ message: 'Blog Deleted Successfully ...' });
    })
    .catch((error) => {
      logging.error(error.message);

      return res.status(500).json({
        error: error.message
      });
    });
};

export default {
  create,
  read,
  readAll,
  query,
  update,
  deleteBlog
};
