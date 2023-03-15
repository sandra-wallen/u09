import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import schedulesSlice from "../../reducers/schedule.reducer";
import userSlice from "../../reducers/user.reducer";

import { useAxios } from "../../reusable/useAxios";
import { resetStore } from "../../store/store";

const ScheduleListItem = ({schedule, index}) => {

  const schedulesState = useSelector((store) => store.schedules);
  const { callbackAxios } = useAxios();
  const dispatch = useDispatch();

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
    <tr>
      <th scope="row">{index + 1}</th>
      <td>
        <Link to="/">{schedule.title}</Link>
      </td>
      <td>{schedule.duration} weeks</td>
      <td>{schedule.courses?.length}</td>
      <td>
        <Link className="btn btn-info" to={`/edit-schedule/${schedule._id}`}>Edit</Link>
      </td>
      <td>
        <button className="btn btn-danger" type="button" onClick={() => handleDelete(schedule._id)}>
          Delete
        </button>
      </td>
    </tr>
  )
}

export default ScheduleListItem