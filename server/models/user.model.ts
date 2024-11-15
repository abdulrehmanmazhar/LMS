import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface User extends Document{
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string)=> Promise<boolean>;
};
const userSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string){
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be 6 characters min."],
        select: false
    },
    avatar:{
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "User"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String,

        }
    ]
},{timestamps: true});


// hashe password 

userSchema.pre<User>('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// comapre password 

userSchema.methods.comparePassword = async function (enteredPassword: string) : Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};



const userModel : Model<User> = mongoose.model("User", userSchema);
export default userModel