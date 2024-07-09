import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import config from "../../../../config/default";

interface IUser {
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(password: string): Promise<boolean> 
}

const userSchema = new Schema<IUser>(
    {
        email: { 
            type: String, 
            required: true,
            unique: true
        }, 
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, 
    { 
        timestamps: true
    }
)

userSchema.pre("save", async function(next: (err?: Error) => void){
    let user = this as IUser;

    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(config.saltWorkFactor);

    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
})

userSchema.methods.comparePassword = async function(password: string): Promise<boolean>{
    const user = this as IUser;
    return bcrypt.compare(password, user.password).catch((err) => false)
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

