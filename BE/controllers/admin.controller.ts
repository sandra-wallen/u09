import { Request, Response } from "express";
import User from "../database/models/user.model";
import bcrypt from 'bcrypt';

const adminGetUsers = async (req: Request, res: Response) => {
    try {
        const users: any = await User.find();

        if (users) {
            const data = users.map((user) => {
                return {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    isAdmin: user.isAdmin
                };
            });
            return res.status(200).json({
                success: true,
                users: data
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};

const adminGetUser = async (req: Request, res: Response) => {
    try {
        const user: any = await User.findById(req.params.userId);

        if (user) {
            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    isAdmin: user.isAdmin
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};

const adminUpdateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser: any = await User.findByIdAndUpdate(req.params.userId, {
                ...req.body.user
            },
            { new: true });

        if (updatedUser) {
            return res.status(200).json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    createdAt: updatedUser.createdAt,
                    isAdmin: updatedUser.isAdmin
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not update user",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

const adminUpdateUserPassword = async (req: Request, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(req.body.user.password, salt);

        const updatedUser: any = await User.findByIdAndUpdate(req.params.userId,
            { password: hashedPassword },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({
                success: true,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not update password",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};
const adminDeleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (deletedUser) {
            return res.status(200).json({
                success: true,
                message: "Successfully deleted user"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not delete user",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export { adminGetUsers, adminGetUser, adminUpdateUser, adminUpdateUserPassword, adminDeleteUser };