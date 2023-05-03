import mongoose, { Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';
import { ObjectID } from "bson";

export interface UserInterface {
    _id?: ObjectID;
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isAdmin: boolean;

    comparePassword?(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
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
        },
        isAdmin: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hashSync(this.password, salt);

    return next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password).catch((err) => false);
};

const User = mongoose.model("User", userSchema);

export default User;