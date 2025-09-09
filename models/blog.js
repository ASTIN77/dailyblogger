const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true },
    image:   { type: String, trim: true },
    body:    { type: String, required: true },
    created: { type: Date, default: Date.now }
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON:   { virtuals: true, getters: true }
  }
);
// Create index for speedy sorting
BlogSchema.index({ created: -1, _id: -1 }); // speeds up "newest first" sorts

// Stable string id for templates
BlogSchema.virtual('id').get(function () {
  return this._id.toString();
});

module.exports = mongoose.model('Blog', BlogSchema);
