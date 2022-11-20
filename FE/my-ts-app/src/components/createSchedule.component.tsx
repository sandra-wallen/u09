import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../reusable/useAxios";
import { resetStore, RootState } from "../store/store";
import userSlice from "../reducers/user.reducer";
import schedulesSlice from "../reducers/schedule.reducer";

const CreateSchedule: React.FC = () => {

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');

  const dispatch = useDispatch();
  const { callbackAxios } = useAxios();
  const userState = useSelector((store: RootState) => store.user);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, 
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(event.target.value);
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {

    const res = await callbackAxios('post', 'http://localhost:8000/create-schedule', { ownerId: userState._id, title, duration });

    if (res.success) {
      dispatch(schedulesSlice.actions.updateSchedules(res.schedule));
      
    } else {
      if (res.request.status === 403) {
        dispatch(schedulesSlice.actions.clearState());
        dispatch(userSlice.actions.clearState());
        resetStore();
      }
    }

  }

  return (
    <>
      <button type="button" className="btn btn-primary align-self-end m-2" data-bs-toggle="modal" data-bs-target="#newScheduleModal">
        NEW
      </button>

      <div className="modal fade" id="newScheduleModal" tabIndex={-1} aria-labelledby="newScheduleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newScheduleModal">New schedule</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="inputTitle" className="form-label">Title</label>
                  <input type="text" id="inputTitle" className="form-control" placeholder="Title" value={title} onChange={(event) => handleInputChange(event, setTitle)}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="inputDuration" className="form-label">Duration</label>
                  <select id="inputDuration" className="form-select" aria-label="Input duration" value={duration}  onChange={(event) => handleInputChange(event, setDuration)}>
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
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateSchedule;