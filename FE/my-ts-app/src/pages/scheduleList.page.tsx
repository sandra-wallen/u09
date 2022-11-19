import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { rootState } from "../store/store";
import { useAxios } from "../reusable/useAxios";
import schedulesSlice from "../reducers/schedule.reducer";
import userSlice from "../reducers/user.reducer";
import CreateSchedule from "../components/createSchedule.component";

const ScheduleList: React.FC = () => {

  const userState = useSelector((store: rootState) => store.userSlice);
  const schedulesState = useSelector((store: rootState) => store.schedulesSlice);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { callbackAxios } = useAxios();

  const getSchedules = async () => {
    const res = await callbackAxios('get', 'http://localhost:8000/schedules', { id: userState._id });
    
    if (res.success) {
      dispatch(schedulesSlice.actions.setSchedules(res.schedules));

        localStorage.setItem('schedules', JSON.stringify(res.schedules));
    } else {
      // Do something else here
      console.log(res.request.status)
      if (res.request.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('schedules');
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
      }
    }
  }

  useEffect(() => {
    if (!userState._id) {
      navigate('/');
    }

    getSchedules();
  }, [userState._id])


  return (
    <main>

      <CreateSchedule />
      
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Duration</th>
            <th scope="col">Courses</th>
          </tr>
        </thead>
        <tbody>
            {schedulesState.schedules.map((schedule: any, index: any) => (
              <tr>
              <th scope="row">{index + 1}</th>
              <td>{schedule.title}</td>
              <td>{schedule.duration} weeks</td>
              <td>{schedule.courses?.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}

export default ScheduleList