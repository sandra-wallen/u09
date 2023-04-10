import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Hejhopp from "../components/hejhopp";

const Profile = () => {
    const userState = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userState._id) {
            navigate("/");
        }
    }, []);

    return (
        <main>
            <Hejhopp />
        </main>
    );
};

export default Profile;
