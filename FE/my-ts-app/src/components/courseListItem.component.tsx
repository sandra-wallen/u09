import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import schedulesSlice from "../reducers/schedule.reducer";
import userSlice from "../reducers/user.reducer";
import { useAxios } from "../reusable/useAxios";
import { resetStore, RootState } from "../store/store";
import { ScheduleInterface } from './editSchedule.component'

interface CourseInterface {
  _id: string;
  ownerId: string;
  title: string;
  color?: string;
  length: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  course: {
    _id: string;
    ownerId: string;
    title: string;
    color?: string;
    length: number;
    createdAt: string;
    updatedAt: string;
  },
  index: number;
  schedule: ScheduleInterface;
  courses: Array<CourseInterface>;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleInterface>>;
  setCourses: React.Dispatch<React.SetStateAction<Array<Object>>>;
}

const CourseListItem: React.FC<Props> = ({course, index, schedule, courses, setSchedule, setCourses}) => {

  const { callbackAxios } = useAxios();
  const dispatch = useDispatch();

  const schedulesState = useSelector((store: RootState) => store.schedules);

  const handleDeleteCourse = async (id) => {
    const filteredCoursesInSchedule = schedule.courses.filter(course => course !== id);

    const res = await callbackAxios('patch', `http://localhost:8000/update-schedule/${schedule._id}`, { courses: filteredCoursesInSchedule });

    if (res.success) {
      setSchedule(res.updatedSchedule)

      const filteredSchedulesList = schedulesState.schedules.filter(item => item._id !== schedule._id);
      const updatedSchedulesList = [...filteredSchedulesList, res.updatedSchedule];

      dispatch(schedulesSlice.actions.setSchedules(updatedSchedulesList));

      const filteredCoursesList = courses.filter(course => course._id !== id);
      setCourses(filteredCoursesList);
    } else {
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
        <Link to="/">{course.title}</Link>
      </td>
      <td>{course.length} min</td>
      <td>
        <button className="btn btn-danger" type="button" onClick={() => handleDeleteCourse(course._id)}>
          Delete
        </button>
      </td>
    </tr>
  )
}

export default CourseListItem