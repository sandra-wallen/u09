import React, { useState } from "react";
import FocusTrap from "@mui/base/FocusTrap";
import SearchCourse from "./searchCourse.component";
import CustomDateTimePicker from "../customDateTimePicker.component";

const AddCourse = () => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());

    const handleSubmit = () => {
        console.log("searhQuery: ", searchQuery);
        console.log("selectedDateTime: ", selectedDateTime);
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-primary align-self-end m-2"
                data-bs-toggle="modal"
                data-bs-target="#addCourseModal"
                onClick={() => setOpen(true)}
            >
                add
            </button>
            <FocusTrap open={open}>
                <div
                    className="modal fade"
                    id="addCourseModal"
                    tabIndex={-1}
                    aria-labelledby="addCourseModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1
                                    className="modal-title fs-5"
                                    id="addCourseModal"
                                >
                                    Add course
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <CustomDateTimePicker
                                            selectedDateTime={selectedDateTime}
                                            setSelectedDateTime={
                                                setSelectedDateTime
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <SearchCourse
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </FocusTrap>
        </>
    );
};

export default AddCourse;
