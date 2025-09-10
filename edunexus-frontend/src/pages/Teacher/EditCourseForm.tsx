
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { getTeacherProfile, getCourseById, updateTeacherCourse } from "../../API/teacherApi";

interface Chapter {
  id: string;
  name: string;
  description: string;
  video: File | null | string; // Allow string for existing video URLs
}

interface FormData {
  name: string;
  description: string;
  thumbnail: File | null | string; // Allow string for existing thumbnail URL
  coveringTopics: string[];
  price: string;
  chapters: Chapter[];
}

interface FormErrors {
  name?: string;
  description?: string;
  thumbnail?: string;
  coveringTopics?: string;
  price?: string;
  chapters?: { [key: string]: { name?: string; description?: string; video?: string } };
  profile?: string;
}

type ChapterErrorKeys = 'name' | 'description' | 'video';

export function EditCourseForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams<{ courseId: string }>();
  const [currentTopic, setCurrentTopic] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    thumbnail: null,
    coveringTopics: [],
    price: "",
    chapters: [{ id: "1", name: "", description: "", video: null }],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        // Validate teacher profile
        const profile = await getTeacherProfile();
        if (profile.role !== 'teacher') {
          throw new Error('User is not a teacher');
        }
        if (profile.approvedByAdmin !== 'approved') {
          throw new Error('Teacher profile must be approved to edit courses');
        }

        // Fetch course data
        if (courseId) {
          const course = await getCourseById(courseId);
          setFormData({
            name: course.name,
            description: course.description,
            thumbnail: course.thumbnailImage || null,
            coveringTopics: course.coveringTopics || [],
            price: course.price.toString(),
            chapters: course.chapters.map((ch: any) => ({
              id: ch.id || Date.now().toString(), // Use existing ID or generate new
              name: ch.name,
              description: ch.description,
              video: ch.video || null,
            })),
          });
        }
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "An error occurred");
        dispatch(showNotification({
          message: err instanceof Error ? err.message : "An error occurred",
          type: 'error',
        }));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, courseId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = "Thumbnail image is required";
    }

    if (formData.coveringTopics.length === 0) {
      newErrors.coveringTopics = "At least one covering topic is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    const chapterErrors: { [key: string]: { name?: string; description?: string; video?: string } } = {};
    formData.chapters.forEach((chapter) => {
      const chapterError: { name?: string; description?: string; video?: string } = {};

      if (!chapter.name.trim()) {
        chapterError.name = "Chapter name is required";
      }

      if (!chapter.description.trim()) {
        chapterError.description = "Chapter description is required";
      }

      if (!chapter.video) {
        chapterError.video = "Chapter video is required";
      }

      if (Object.keys(chapterError).length > 0) {
        chapterErrors[chapter.id] = chapterError;
      }
    });

    if (Object.keys(chapterErrors).length > 0) {
      newErrors.chapters = chapterErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileError) {
      dispatch(showNotification({
        message: profileError,
        type: 'error',
      }));
      return;
    }

    if (!validateForm()) {
      dispatch(showNotification({
        message: "Please fix all errors before submitting.",
        type: 'error',
      }));
      return;
    }

    try {
      dispatch(setLoading(true));
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('coveringTopics', JSON.stringify(formData.coveringTopics));
      if (formData.thumbnail instanceof File) {
        submitData.append('thumbnail', formData.thumbnail);
      }
      formData.chapters.forEach((chapter, index) => {
        submitData.append(`chapters[${index}][id]`, chapter.id);
        submitData.append(`chapters[${index}][name]`, chapter.name);
        submitData.append(`chapters[${index}][description]`, chapter.description);
        if (chapter.video instanceof File) {
          submitData.append('chapterVideos', chapter.video);
        } else if (typeof chapter.video === 'string') {
          submitData.append(`chapters[${index}][videoUrl]`, chapter.video);
        }
      });

      await updateTeacherCourse(courseId!, submitData);
      dispatch(showNotification({
        message: "Course has been updated successfully.",
        type: 'success',
      }));
      navigate('/teacher/courses');
    } catch (error: any) {
      dispatch(showNotification({
        message: error.message || "Failed to update course",
        type: 'error',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addTopic = () => {
    if (currentTopic.trim() && !formData.coveringTopics.includes(currentTopic.trim())) {
      setFormData((prev) => ({
        ...prev,
        coveringTopics: [...prev.coveringTopics, currentTopic.trim()],
      }));
      setCurrentTopic("");
      if (errors.coveringTopics) {
        setErrors((prev) => ({ ...prev, coveringTopics: undefined }));
      }
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      coveringTopics: prev.coveringTopics.filter((topic) => topic !== topicToRemove),
    }));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: "",
      description: "",
      video: null,
    };
    setFormData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
  };

  const removeChapter = (chapterId: string) => {
    if (formData.chapters.length > 1) {
      setFormData((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((chapter) => chapter.id !== chapterId),
      }));
      if (errors.chapters && errors.chapters[chapterId]) {
        const newChapterErrors = { ...errors.chapters };
        delete newChapterErrors[chapterId];
        setErrors((prev) => ({ ...prev, chapters: newChapterErrors }));
      }
    }
  };

  const updateChapter = (chapterId: string, field: ChapterErrorKeys, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => (chapter.id === chapterId ? { ...chapter, [field]: value } : chapter)),
    }));

    if (errors.chapters && errors.chapters[chapterId] && errors.chapters[chapterId][field]) {
      const newChapterErrors = { ...errors.chapters };
      delete newChapterErrors[chapterId][field];
      if (Object.keys(newChapterErrors[chapterId]).length === 0) {
        delete newChapterErrors[chapterId];
      }
      setErrors((prev) => ({ ...prev, chapters: newChapterErrors }));
    }
  };

  const handleFileChange = (file: File | null, field: "thumbnail" | "video", chapterId?: string) => {
    if (file) {
      const allowedTypes = field === "thumbnail"
        ? ['image/jpeg', 'image/png', 'image/jpg']
        : ['video/mp4', 'video/mpeg', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        dispatch(showNotification({
          message: `Invalid file type for ${field}. Allowed types: ${allowedTypes.join(', ')}`,
          type: 'error',
        }));
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        dispatch(showNotification({
          message: `File size exceeds 50MB limit for ${field}`,
          type: 'error',
        }));
        return;
      }
    }
    if (field === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      if (errors.thumbnail) {
        setErrors((prev) => ({ ...prev, thumbnail: undefined }));
      }
    } else if (field === "video" && chapterId) {
      updateChapter(chapterId, "video", file);
    }
  };

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-600">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{profileError}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded"
          onClick={() => navigate('/teacher/courses')}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Course</h1>
          <h2 className="text-xl text-blue-600 font-medium">Update Your Learning Experience</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border border-blue-200 shadow-sm bg-white rounded-lg">
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <h3 className="text-xl text-blue-900 font-semibold">Course Information</h3>
            </div>
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <label htmlFor="courseName" className="text-gray-700 font-medium">
                  Course Name *
                </label>
                <input
                  id="courseName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter course name"
                  className={`w-full border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="courseDescription" className="text-gray-700 font-medium">
                  Course Description *
                </label>
                <textarea
                  id="courseDescription"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, description: e.target.value }));
                    if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Enter course description"
                  rows={4}
                  className={`w-full border ${errors.description ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-gray-700 font-medium">
                  Thumbnail Image *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, "thumbnail")}
                    className={`flex-1 border ${errors.thumbnail ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                  />
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5m4 0h5a4 4 0 014 4v5m-4 4a4 4 0 01-4 4H7m4-8v8m-8-4h8" />
                    </svg>
                  </div>
                </div>
                {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
                {formData.thumbnail && typeof formData.thumbnail === 'string' && (
                  <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    Current: {formData.thumbnail}
                  </p>
                )}
                {formData.thumbnail && formData.thumbnail instanceof File && (
                  <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    Selected: {formData.thumbnail.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Covering Topics *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    placeholder="Add a topic"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
                  />
                  <button
                    type="button"
                    onClick={addTopic}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {errors.coveringTopics && <p className="text-sm text-red-500">{errors.coveringTopics}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.coveringTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 border border-blue-200"
                    >
                      {topic}
                      <svg
                        className="h-3 w-3 cursor-pointer hover:text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => removeTopic(topic)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-gray-700 font-medium">
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, price: e.target.value }));
                    if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                  }}
                  placeholder="0.00"
                  className={`w-full border ${errors.price ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
            </div>
          </div>

          <div className="border border-blue-200 shadow-sm bg-white rounded-lg">
            <div className="bg-blue-50 border-b border-blue-100 p-4 flex flex-row items-center justify-between">
              <h3 className="text-xl text-blue-900 font-semibold">Course Chapters</h3>
              <button
                type="button"
                onClick={addChapter}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Chapter
              </button>
            </div>
            <div className="space-y-6 p-6">
              {formData.chapters.map((chapter, index) => (
                <div key={chapter.id} className="border border-blue-200 rounded-lg p-6 space-y-4 bg-white">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 text-lg">Chapter {index + 1}</h4>
                    {formData.chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(chapter.id)}
                        className="border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Chapter
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Chapter Name *</label>
                    <input
                      type="text"
                      value={chapter.name}
                      onChange={(e) => updateChapter(chapter.id, "name", e.target.value)}
                      placeholder="Enter chapter name"
                      className={`w-full border ${errors.chapters?.[chapter.id]?.name ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                    />
                    {errors.chapters?.[chapter.id]?.name && (
                      <p className="text-sm text-red-500">{errors.chapters[chapter.id].name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Chapter Description *</label>
                    <textarea
                      value={chapter.description}
                      onChange={(e) => updateChapter(chapter.id, "description", e.target.value)}
                      placeholder="Enter chapter description"
                      rows={3}
                      className={`w-full border ${errors.chapters?.[chapter.id]?.description ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black`}
                    />
                    {errors.chapters?.[chapter.id]?.description && (
                      <p className="text-sm text-red-500">{errors.chapters[chapter.id].description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Chapter Video *</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, "video", chapter.id)}
                        className={`flex-1 border ${errors.chapters?.[chapter.id]?.video ? 'border-red-400' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                      />
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l13-8-13-8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.chapters?.[chapter.id]?.video && (
                      <p className="text-sm text-red-500">{errors.chapters[chapter.id].video}</p>
                    )}
                    {chapter.video && typeof chapter.video === 'string' && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                        Current: {chapter.video}
                      </p>
                    )}
                    {chapter.video && chapter.video instanceof File && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                        Selected: {chapter.video.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded shadow-sm"
            >
              Update Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
