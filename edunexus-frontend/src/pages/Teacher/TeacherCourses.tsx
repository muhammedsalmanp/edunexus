"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "./CourseCard";
import type { CourseCardProps, Course } from "../../types/CourseType";
import { getTeacherProfile, getTeacherCourse } from "../../API/teacherApi";

export function TeacherCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseCardProps["course"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setLoading(true);
        
        const profile = await getTeacherProfile();
        if (profile.role !== 'teacher') {
          throw new Error('User is not a teacher');
        }
        if (profile.approvedByAdmin !== 'approved') {
          throw new Error('Teacher profile must be approved to view courses');
        }

        // Fetch courses
        const data = await getTeacherCourse();
        const mappedCourses: CourseCardProps["course"][] = data.map((course: Course) => ({
          id: course.id,
          title: course.name,
          description: course.description,
          thumbnail: course.thumbnailImage,
          status: course.courseStatus,
          duration: `${course.chapters.length} chapters`,
        }));

        setCourses(mappedCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  const handleAddCourse = () => {
    navigate("/teacher/course/add");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="w-8 h-8 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
        <button
          className="mt-4 py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <p>No courses found. Create your first course!</p>
        <button
          className="mt-4 py-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded"
          onClick={handleAddCourse}
        >
          Add Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
        <button
          className="py-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded"
          onClick={handleAddCourse}
        >
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}