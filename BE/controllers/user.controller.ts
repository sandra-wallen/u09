import { Request, Response } from "express";
import User from "../database/models/user.model";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        user.save().then(() => {
            res.status(201).json({ message: "User created" });
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
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "1d",
                }
            );

            const expires = new Date(Date.now() + 86400 * 1000);

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
                    },
                    expires: expires,
                });
        }
    } catch (error: any) {
        return res.status(500).json(error.message);
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
                user,
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

const authorizeUser = (req: Request, res: Response, next: any) => {
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
            }
        );
        next();
    } catch (error) {
        return res.status(500).json("Could not verify token");
    }
};

export { registerUser, loginUser, logoutUser, getUser, authorizeUser };
