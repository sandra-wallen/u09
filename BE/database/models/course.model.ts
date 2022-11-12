import { ObjectId } from 'mongodb';
import mongoose, { Schema } from "mongoose";

interface CourseInterface {
  _id: ObjectId;
  ownerId: ObjectId
  title: string;
  color: string;
  length: number;
}

const CourseSchema = new Schema<CourseInterface>(
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
    color: {
      type: String,
      unique: false,
      required: false
    },
    length: {
      type: Number,
      unique: false,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Course = mongoose.model<CourseInterface>("Course", CourseSchema);

export default Course;
export { CourseInterface, CourseSchema };