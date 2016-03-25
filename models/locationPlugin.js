module.exports = function location (schema,options) {
  schema.virtual('location').get(function () {
  return this.place.location;
  });
  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });
};