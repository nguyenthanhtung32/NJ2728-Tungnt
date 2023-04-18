const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  {
    versionKey: false,
  },
);

const Category = model('Category', categorySchema);

module.exports = Category;
