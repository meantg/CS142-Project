var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
});

var photoSchema = new mongoose.Schema({
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    date_time: { type: Date, default: Date.now }, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
});

var commentSchema = new mongoose.Schema({
    comment: String,     // The text of the comment.
    date_time: { type: Date, default: Date.now }, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
});

var activitySchema = new mongoose.Schema({
    action: String,
    date_time: {type: Date, default: Date.now},
    maker: userSchema,
    photo: photoSchema,
    comment: commentSchema
})

var Activities = mongoose.model('Activites', activitySchema);

module.exports = Activities;