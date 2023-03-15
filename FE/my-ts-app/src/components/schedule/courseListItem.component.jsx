import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import schedulesSlice from "../../reducers/schedule.reducer";
import userSlice from "../../reducers/user.reducer";
import { useAxios } from "../../reusable/useAxios";
import { resetStore } from "../../store/store";


const CourseListItem = ({course, index, schedule, courses, setSchedule, setCourses}) => {

  const scheduleCourse = schedule.courses.find(item => item.course === course._id)

  const { callbackAxios } = useAxios();
  const dispatch = useDispatch();

  const schedulesState = useSelector((store) => store.schedules);

  const handleDeleteCourse = async (id) => {
    const filteredCoursesInSchedule = schedule.courses.filter(item => item.course !== id);

    const res = await callbackAxios('patch', `http://localhost:8000/update-schedule/${schedule._id}`, { courses: filteredCoursesInSchedule });

    if (res.success) {
      setSchedule(res.updatedSchedule)

      const filteredSchedulesList = schedulesState.schedules.filter(item => item._id !== schedule._id);
      const updatedSchedulesList = [...filteredSchedulesList, res.updatedSchedule];

      dispatch(schedulesSlice.actions.setSchedules(updatedSchedulesList));

      const filteredCoursesList = courses.filter(item => item._id !== id);
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
      <td>{scheduleCourse.startDateTime.toLocaleString()}</td>
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