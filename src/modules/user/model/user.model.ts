import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../../config/default';

export interface IUser extends Document {
    email: string;
    name: string;
    password?: string;
    verified: boolean;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
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
        },
        verified: {
            type: Boolean,
            default: false
        },
        country: {
            type: String,
            required: true
        }
    }, 
    { 
        timestamps: true
    }
);

userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.saltWorkFactor);
    
    if(this.password){
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }


    next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password).catch(() => false);
};

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default UserModel;
