import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import schedulesSlice from "../../reducers/schedule.reducer";
import userSlice from "../../reducers/user.reducer";
import { useAxios } from "../../reusable/useAxios";
import { resetStore } from "../../store/store";
import AddCourse from "./addCourse.component";
import CourseListItem from "./courseListItem.component";

const EditSchedule = () => {
  const { scheduleId } = useParams();

  const [schedule, setSchedule] = useState();
  const [courses, setCourses] = useState([]);

  const userState = useSelector((store) => store.user);
  const schedulesState = useSelector((store) => store.schedules);
  console.log(schedulesState.schedules);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { callbackAxios } = useAxios();

  const getCourses = async () => {
    const res = await callbackAxios('get', `http://localhost:8000/schedule/courses/${scheduleId}`);

    if (res.success) {
      setCourses(res.courses);
    } else {
      if (res.request.status === 403) {
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
        resetStore();
      }
    }
  }

  const getSchedule = async () => {
    const res = await callbackAxios('get', `http://localhost:8000/schedule/${scheduleId}`);

    if (res.success) {
      setSchedule(res.schedule)
      getCourses();
    } else {
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

    getSchedule();
  }, [userState._id])


  const handleInputChange = (event) => {
    setSchedule({
      ...schedule,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = async (event) => {

    const res = await callbackAxios('patch', `http://localhost:8000/update-schedule/${schedule._id}`);

    if (res.success) {

      const filteredSchedules = schedulesState.schedules.filter(item => item._id !== schedule._id);
      const updatedSchedules = [...filteredSchedules, res.updatedSchedule];

      dispatch(schedulesSlice.actions.setSchedules(updatedSchedules));
      
      
    } else {
      if (res.request.status === 403) {
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
        resetStore();
      }
    }
  }

  return (
    <main className="container">
      {schedule && (
        <>
          <h1>{schedule.title}</h1>
          <form>
            <div className="row gx-2 my-4">
              <div className="col-12 col-md-6 p-2">
                <div className="d-flex flex-column align-items-start mb-3">
                  <label htmlFor="inputTitle" className="form-label">Title</label>
                  <input type="text" id="inputTitle" name="title" className="form-control" placeholder="Title" value={schedule.title} onChange={handleInputChange}/>
                </div>
                <div className="d-flex flex-column align-items-start mb-3">
                  <label htmlFor="inputDuration" className="form-label">Duration</label>
                  <select id="inputDuration" className="form-select" name="duration" aria-label="Input duration" value={schedule.duration}  onChange={handleInputChange}>
                    <option disabled>Duration in weeks</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6 p-2">
                <h2 className="text-start">Courses</h2>
                  <AddCourse />
                <table>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Start date & time</th>
                      <th style={{width: "20%"}} scope="col">Length</th>
                      <th style={{width: "20%"}} scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                      {courses && 
                        courses.map((course, index) => (
                          <CourseListItem 
                            course={course} 
                            index={index} 
                            schedule={schedule} 
                            courses={courses} 
                            setSchedule={setSchedule} 
                            setCourses={setCourses} 
                          />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </>
      )}
    </main>
  )
}

export default EditSchedule;