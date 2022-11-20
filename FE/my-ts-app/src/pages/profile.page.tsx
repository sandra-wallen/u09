import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import schedulesSlice from "../reducers/schedule.reducer";
import userSlice from "../reducers/user.reducer";
import { persistor, resetStore, RootState } from "../store/store";


const Profile: React.FC = () => {

  const userState = useSelector((store: RootState) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    if (!userState._id) {
      navigate('/');
    }
  })


  return (
    <main>
    </main>
  )
}

export default Profile;