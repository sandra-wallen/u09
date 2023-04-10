import { Request, Response } from 'express';
import { callbackify } from 'util';
import Course from '../database/models/course.model';
import Schedule from '../database/models/schedule.model';

const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ ownerId: req.body.id });

    if (courses) {
      return res.status(200).json({
        success: true,
        courses
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Could not find courses"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    })
  }
}

const getAllCoursesAccociatedWithSchedule = async (req: Request, res: Response) => {
  const { scheduleId } = req.params;
 
  try {
    const schedule = await Schedule.findById(scheduleId);

    if (schedule) {
      const awaitCourses = async () => {
        // Didn't want to use .push bc it's a mutable function, but couldn't make it
        // work in any other way. Using map to return a array wasn't waiting for the promise
        // resulting in the function returning too early.
        const coursesArray = []
          for (const item of schedule.courses) {
            const course = await Course.findById(item.course);
            coursesArray.push(course);
          }

        return coursesArray;
      }
      

      awaitCourses().then((coursesArray) => {
        if (coursesArray) {
          return res.status(200).json({
            success: true,
            courses: coursesArray
          })
        } else {
          return res.status(404).json({
            success: false,
            message: "Could not find courses"
          })
        }
      })

    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    })
  }
}

const getCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (course) {
      return res.status(200).json({
        success: true,
        course
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Could not find courses"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    })
  }
}

const createCourse = async (req: Request, res: Response) => {
  const { ownerId, title, length } = req.body;

  if (ownerId && title && length) {
    try {
      const course = await new Course(req.body).save();

      if (course) {
        return res.status(201).json({
          success: true,
          course
        })
      } else {
        return res.status(404).json({
          success: false,
          message: "Could not create course"
        })
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      })
    }
  }
}

const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

    if (updatedCourse) {
      return res.status(200).json({
        success: true,
        updatedCourse
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Could not update course"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    })
  }
}

const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (deletedCourse) {
      return res.status(200).json({
        success: true,
        deletedCourse
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Could not delete course"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    })
  }
}

export { getAllCourses, getAllCoursesAccociatedWithSchedule, getCourse, createCourse, updateCourse, deleteCourse };