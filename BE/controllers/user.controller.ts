import { Request, Response } from "express";
import User from "../database/models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const registerUser = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.body.isAdmin ? req.body.isAdmin : false;
        const user = await User.create({ ...req.body, isAdmin });
        user.save().then(() => {
            res.status(201).json({ success: true, message: "User created" });
        });
    } catch (error: any) {
        res.status(500).json(error.message);
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json("Please provide a valid email and password");
    }

    try {
        const user: any | null = await User.findOne({ email }).select(
            "+password"
        );
        if (!user) {
            return res
                .status(404)
                .json("No account is registered with this email");
        }
        const isMatch: boolean = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json("Invalid password");
        }
        if (user) {
            const token: string = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "1d",
                }
            );

            const expires: Date = new Date(Date.now() + 86400 * 1000);

            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    path: "/",
                    expires,
                })
                .status(200)
                .json({
                    success: true,
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        isAdmin: user.isAdmin
                    },
                    expires: expires,
                });
        }
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { user, id } = req.body;

    if (!user) {
        return res
            .status(400)
            .json("Please provide user information");
    } else {
        try {
            // If the request is trying to update password, delete the password property,
            // password should be updated through the updatePassword endpoint
            if (user.password) {
                delete user.password;
            }
            const updatedUser: any | null = await User.findByIdAndUpdate(id, { ...user }, { new: true });

            if (updatedUser) {
                return res.status(200).json({
                    success: true,
                    user: {
                        _id: updatedUser._id,
                        email: updatedUser.email,
                        name: updatedUser.name,
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
    }
};

const updatePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword, id } = req.body;

    if (!currentPassword || !newPassword) {
        return res
            .status(400)
            .json("Please provide current password and new password");
    } else {
        try {
            const user: any | null = await User.findById(id).select(
                "+password"
            );

            const isMatch: boolean = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json("Invalid current password");
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hashSync(newPassword, salt);

                const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });

                if (updatedUser) {
                    return res.status(200).json({
                        success: true
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "Could not update password",
                    });
                }

            }

        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.body.id);
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

const logoutUser = async (req: Request, res: Response) => {
    return res
        .clearCookie("access_token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
        })
        .status(200)
        .json({ success: true, message: "User logged out" });
};

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.body.id);

        if (user) {
            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
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

const authUser = (req: Request, res: Response, next: any) => {
    const token = req.cookies.access_token;

    // Will be true if cookie is not sent or expired
    if (!token) {
        return res
            .clearCookie("access_token")
            .status(403)
            .json({ message: "No token" });
    }

    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            async (err: any, decoded: any) => {
                req.body.id = decoded.id;
                req.body.isAdmin = decoded.isAdmin;
            }
        );
        next();
    } catch (error) {
        return res.status(500).json("Could not verify token");
    }
};

const authAdmin = (req: Request, res: Response, next: any) => {
    if (req.body.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: "Not authorized" });
    }

};

export { registerUser, loginUser, updateUser, updatePassword, deleteUser, logoutUser, getUser, authUser, authAdmin };
