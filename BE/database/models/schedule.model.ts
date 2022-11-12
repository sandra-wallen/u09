import { ObjectId } from 'mongodb';
import mongoose, { Schema, Types } from "mongoose";

import { CourseInterface, CourseSchema } from './course.model';

interface ScheduleInterface {
  _id: ObjectId;
  ownerId: ObjectId;
  title: string;
  duration: number;
  courses: Types.Array<ObjectId>;
}

const ScheduleSchema = new Schema<ScheduleInterface>(
  {
    ownerId: {
      type: ObjectId,
      unique: false,
      required: true
    },
    title: {
      type: String,
      unique: false,
      required: true
    },
    duration: {
      type: Number,
      unique: false,
      required: true
    },
    courses: {
      type: [ObjectId],
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Schedule = mongoose.model<ScheduleInterface>("Schedule", ScheduleSchema);

export default Schedule;