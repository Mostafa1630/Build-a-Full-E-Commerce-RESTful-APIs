const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Brand requried"],
    unique:[true,"Brand must be unique"],
    minlength:[3,"Too short Brand name"],
    maxlength:[32,"Too long Brand name"],
  },
  //in slug  A and B ===> a-and-b
  slug:{
    type:String,
    lowercase:true
  },
  image:{
    type:String,
  }
},{timestamps:true}
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const BrandModel = new mongoose.model('Brand',brandSchema);

module.exports = BrandModel;