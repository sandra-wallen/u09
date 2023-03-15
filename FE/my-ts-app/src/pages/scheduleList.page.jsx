import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { resetStore, RootState } from "../store/store";
import { useAxios } from "../reusable/useAxios";
import schedulesSlice from "../reducers/schedule.reducer";
import userSlice from "../reducers/user.reducer";

import CreateSchedule from "../components/schedule/createSchedule.component";
import ScheduleListItem from "../components/schedule/scheduleListItem.component";

const ScheduleList = () => {

  const userState = useSelector((store) => store.user);
  const schedulesState = useSelector((store) => store.schedules);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { callbackAxios } = useAxios();

  const getSchedules = async () => {
    const res = await callbackAxios('get', 'http://localhost:8000/schedules', { id: userState._id });
    
    if (res.success) {
      dispatch(schedulesSlice.actions.setSchedules(res.schedules));

    } else {
      // Do something else here
      if (res.request.status === 403) {
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
        resetStore();
      }
    }
  }

  useEffect(() => {
    if (!userState._id) {
      navigate('/');
    }

    getSchedules();
  }, [userState._id])

  

  const handleDelete = async (id) => {
    const res = await callbackAxios('delete', `http://localhost:8000/delete-schedule/${id}`);

    if (res.success) {
      const updatedList = schedulesState.schedules.filter(item => item._id !== id)

      dispatch(schedulesSlice.actions.deleteSchedule(updatedList));
    } else {
      console.log(res.request);
      if (res.request.status === 403) {
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
        resetStore();
      }
    }
  }


  return (
    <main className="d-flex flex-column mb-3 px-4">

      <CreateSchedule />
      
      <table className="table .container-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th style={{width: "9%"}} scope="col">Duration</th>
            <th style={{width: "9%"}} scope="col">Courses</th>
            <th style={{width: "9%"}} scope="col"></th>
            <th style={{width: "9%"}} scope="col"></th>
          </tr>
        </thead>
        <tbody>
            {schedulesState.schedules[0] !== null && 
              schedulesState.schedules.map((schedule, index) => (
              <ScheduleListItem schedule={schedule} index={index} />
            ))}
        </tbody>
      </table>
    </main>
  )
}

export default ScheduleList