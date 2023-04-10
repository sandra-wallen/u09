import { ObjectId } from 'mongodb';
import mongoose, { Schema, Types } from "mongoose";

interface CoursesItem {
  course: ObjectId;
  startDateTime: string;
}

interface ScheduleInterface {
  _id: ObjectId;
  ownerId: ObjectId;
  title: string;
  duration: number;
  courses: Types.Array<CoursesItem>;
}

const CoursesItemSchema = new Schema<CoursesItem>(
  {
    course: {
      type: ObjectId,
      unique: false,
      required: true
    },
    startDateTime: {
      type: String,
      unique: false,
      required: true
    }
  }
)

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
      type: [CoursesItemSchema],
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Schedule = mongoose.model<ScheduleInterface>("Schedule", ScheduleSchema);

export default Schedule;