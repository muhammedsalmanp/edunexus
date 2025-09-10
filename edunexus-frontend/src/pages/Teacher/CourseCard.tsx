"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import type { CourseCardProps } from "../../types/CourseType";

export function CourseCard({ course }: CourseCardProps) {
    const navigate = useNavigate();

    const handlePreview = (e: React.MouseEvent): void => {
        e.stopPropagation();
        console.log("[v0] Preview course:", course.id);
        alert(`Previewing course: ${course.title}`);
    };

    const handleEdit = (e: React.MouseEvent): void => {
        e.stopPropagation();
        console.log("[v0] Edit course:", course.id);
        navigate(`/teacher/course/edit/${course.id}`);
    };

    const handleUpdate = (e: React.MouseEvent): void => {
        e.stopPropagation();
        console.log("[v0] Update course:", course.id);
        alert(`Updating course: ${course.title}`);
    };

    const handleShare = (e: React.MouseEvent): void => {
        e.stopPropagation();
        console.log("[v0] Share course:", course.id);
        alert(`Sharing course: ${course.title}`);
    };

    const handleCardClick = (): void => {
        console.log("[v0] Course card clicked:", course.id);
        navigate(`/teacher/course/${course.id}`);
    };

    return (
        <div
            className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 cursor-pointer hover:border-green-300"
            onClick={handleCardClick}
        >
            <div className="relative w-full aspect-video">
                <img
                    src={course.thumbnail || "/placeholder.svg?height=200&width=300&query=course-thumbnail"}
                    alt={course.title}
                    className="object-cover h-[200px] rounded-lg"
                />

                <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${course.status === "published"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                >
                    {course.status}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                <div className="text-sm text-gray-500">
                    <span className="font-medium">Duration: {course.duration}</span>
                </div>
            </div>
            <div className="p-4 pt-0 flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded transition-colors"
                        onClick={handlePreview}
                    >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                    </button>
                    <button
                        className="flex-1 py-2 px-4 border border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-900 rounded transition-colors"
                        onClick={handleEdit}
                    >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex-1 py-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded transition-colors"
                        onClick={handleUpdate}
                    >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11-5v5h-5m0 10h5v-5m-5 0H4v5m16-10V4" />
                        </svg>
                        Update
                    </button>
                    <button
                        className="flex-1 py-2 px-4 border border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-900 rounded transition-colors"
                        onClick={handleShare}
                    >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}