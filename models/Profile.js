const mongoose = require('mongoose')

const ProfileSchema = new  mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company : String,
    website : String,
    location : String,
    status :{
        type: String,
        required : true
    },
    skills : {
        type: [String],
        required: true
    },
    bio : String,
    githubusername : String,
    experience:[
        {
            title:{
                type: String,
                required : true
            },
            company : {
                type : String,
                required : true
            },
            location : String,
            from : {
                type : Date,
                require : true
            },
            to: Date,
            current : {
                type : Boolean,
                default : false
            },
            description : String
        }
    ],
    education :[
        {
            school : String,
            degree : String,
            fieldofstudy : String,
            from : Date,
            to: Date,
            current :Boolean,
            description : String
        }
    ],
    social: {
        youtube : String,
        twitter : String,
        facebook : String,
        linkedIn : String,
        instagram : String
    },
    date : {
        type : Date,
        default : Date.now
    }

})

module.exports = Profile = mongoose.model('profile',ProfileSchema)