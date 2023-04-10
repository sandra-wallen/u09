import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useAxios } from "../../reusable/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { resetStore } from "../../store/store";
import userSlice from "../../reducers/user.reducer";
import schedulesSlice from "../../reducers/schedule.reducer";

const SearchCourse = ({ searchQuery, setSearchQuery }) => {
    const [courses, setCourses] = useState([]);
    const userState = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const { callbackAxios } = useAxios();

    const getCourses = async () => {
        const res = await callbackAxios("get", "http://localhost:8000/courses");

        if (res.success) {
            console.log(res);
            const courseIds = res.courses.map((item) => {
                return {
                    id: item._id,
                    label: item.title,
                };
            });
            setCourses(courseIds);
            console.log(courses);
        } else {
            if (res.request.status === 403) {
                dispatch(schedulesSlice.actions.clearState());
                dispatch(userSlice.actions.clearState());
                resetStore();
            }
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <Autocomplete
            id="search-course"
            options={courses}
            sx={{ width: 300 }}
            value={courses[0]}
            onChange={(event, value) => {
                setSearchQuery(value);
            }}
            renderInput={(params) => <TextField {...params} label="Course" />}
        />

        // <TextField
        //   id="search-course"
        //   className="text"
        //   label="Course"
        //   placeholder="search.."
        //   variant="outlined"
        //   size="small"
        //   value={searchQuery}
        //   onChange={(event) => {
        //     setSearchQuery(event.target.value)
        //   }}
        // />
    );
};

export default SearchCourse;
