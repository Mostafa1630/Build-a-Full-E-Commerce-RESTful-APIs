const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category requried"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    //in slug  A and B ===> a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

const CategoryModel = new mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
