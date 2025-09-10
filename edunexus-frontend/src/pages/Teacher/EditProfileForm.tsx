"use client"

import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showNotification } from '../../store/slices/notificationSlice'
import { setLoading } from '../../store/slices/loadingSlice'
import { getTeacherProfile, updateTeacherProfile } from "../../API/teacherApi"
import { X, Plus, Upload, Trash2, User, GraduationCap, Award, FileText, Camera } from "lucide-react"
import type { ProfessionalUser } from "../../types/TeacherTypes"

export default function EditProfileForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<ProfessionalUser | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newQualification, setNewQualification] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")
  const [certificates, setCertificates] = useState<{ name: string; year: number | undefined; image: string }[]>([])

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        dispatch(setLoading(true))
        const profile = await getTeacherProfile()
        setFormData(profile)
        setCertificates(
          profile.certificates?.map(cert =>
            typeof cert === "string"
              ? { name: "", year: undefined, image: cert } // cert is string (image URL)
              : {
                name: cert.name || "",
                year: cert.year ?? undefined,
                image: cert.image ?? ""
              }
          ) || []
        )

      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to load profile data',
          type: 'error'
        }))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchProfileData()
  }, [dispatch])

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        return !value || value.trim() === "" ? "Name is required" : ""
      case "phone":
        return !value || value.trim() === ""
          ? "Phone number is required"
          : !/^\+?[\d\s-()]+$/.test(value)
            ? "Invalid phone number format"
            : ""
      case "bio":
        return !value || value.trim() === "" ? "Bio is required" : ""
      case "profilePic":
        return !value || value.trim() === "" ? "Profile picture is required" : ""
      case "qualifications":
        return !value || value.length === 0 ? "At least one qualification is required" : ""
      case "specializations":
        return !value || value.length === 0 ? "At least one specialization is required" : ""
      case "educationHistory":
        return !value || value.length === 0 ? "At least one education entry is required" : ""
      default:
        return ""
    }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData) return;

  // Validate form
  const newErrors: Record<string, string> = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key as keyof ProfessionalUser]);
    if (error) newErrors[key] = error;
  });

  // Validate file sizes
  const profilePicInput = document.getElementById('profilePic') as HTMLInputElement;
  if (profilePicInput?.files?.[0] && profilePicInput.files[0].size > 5 * 1024 * 1024) {
    newErrors.profilePic = 'Profile picture must be under 5MB';
  }

  certificates.forEach((cert, index) => {
    const certInput = document.getElementById(`certificate-image-${index}`) as HTMLInputElement;
    if (certInput?.files?.[0] && certInput.files[0].size > 5 * 1024 * 1024) {
      newErrors[`certificate_${index}`] = `Certificate ${index + 1} must be under 5MB`;
    }
    if (cert.name && !certInput?.files?.[0]) {
      newErrors[`certificate_${index}`] = `Certificate ${index + 1} requires an image if name is provided`;
    }
  });

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    dispatch(setLoading(true));

    // Create FormData object
    const formDataToSend = new FormData();

    // Append non-file fields
    formDataToSend.append('name', formData.name || '');
    formDataToSend.append('phone', formData.phone || '');
    formDataToSend.append('bio', formData.bio || '');
    formDataToSend.append('qualifications', JSON.stringify(formData.qualifications || []));
    formDataToSend.append('specializations', JSON.stringify(formData.specializations || []));
    formDataToSend.append('educationHistory', JSON.stringify(formData.educationHistory || []));
    formDataToSend.append('awards', JSON.stringify(formData.awards || []));
    formDataToSend.append('experience', formData.experience?.toString() || '');

    // Append profile picture file
    if (profilePicInput?.files?.[0]) {
      formDataToSend.append('profilePic', profilePicInput.files[0]);
      console.log('Profile Pic:', profilePicInput.files[0].name, profilePicInput.files[0].size);
    } else {
      console.log('No profile picture selected');
    }

    // Append certificate files and metadata
    certificates.forEach((cert, index) => {
      const certInput = document.getElementById(`certificate-image-${index}`) as HTMLInputElement;
      if (certInput?.files?.[0]) {
        formDataToSend.append('certificates', certInput.files[0]);
        console.log(`Certificate ${index}:`, certInput.files[0].name, certInput.files[0].size);
      }
      formDataToSend.append(`certificateMeta[${index}][name]`, cert.name || '');
      formDataToSend.append(`certificateMeta[${index}][year]`, cert.year?.toString() || '');
      console.log(`Certificate Meta ${index}:`, { name: cert.name, year: cert.year });
    });

    // Log FormData contents
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    // Send request to backend
    await updateTeacherProfile(formDataToSend);
    dispatch(
      showNotification({
        message: 'Profile updated successfully!',
        type: 'success',
      })
    );
    navigate('/teacher/profile');
  } catch (error) {
    console.error('Frontend Submit Error:', error);
    dispatch(
      showNotification({
        message: 'Failed to update profile: ' + (error || 'Unknown error'),
        type: 'error',
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};
  const handleInputChange = (field: keyof ProfessionalUser, value: any) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleBlur = (field: string, value: any) => {
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const addQualification = () => {
    if (!formData || !newQualification.trim()) return
    if (formData.qualifications?.includes(newQualification.trim())) return

    const updatedQualifications = [...(formData.qualifications || []), newQualification.trim()]
    setFormData({ ...formData, qualifications: updatedQualifications })
    setNewQualification("")
    if (errors.qualifications) {
      setErrors(prev => ({ ...prev, qualifications: "" }))
    }
  }

  const removeQualification = (index: number) => {
    if (!formData) return
    const updatedQualifications = formData.qualifications?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, qualifications: updatedQualifications })
  }

  const addSpecialization = () => {
    if (!formData || !newSpecialization.trim()) return
    if (formData.specializations?.includes(newSpecialization.trim())) return

    const updatedSpecializations = [...(formData.specializations || []), newSpecialization.trim()]
    setFormData({ ...formData, specializations: updatedSpecializations })
    setNewSpecialization("")
    if (errors.specializations) {
      setErrors(prev => ({ ...prev, specializations: "" }))
    }
  }

  const removeSpecialization = (index: number) => {
    if (!formData) return
    const updatedSpecializations = formData.specializations?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, specializations: updatedSpecializations })
  }

  const addEducation = () => {
    if (!formData) return
    const updatedEducation = [...(formData.educationHistory || []), { degree: "", institution: "", year: undefined }]
    setFormData({ ...formData, educationHistory: updatedEducation })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    if (!formData) return
    const updatedEducation = formData.educationHistory?.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    ) || []
    setFormData({ ...formData, educationHistory: updatedEducation })
  }

  const removeEducation = (index: number) => {
    if (!formData) return
    const updatedEducation = formData.educationHistory?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, educationHistory: updatedEducation })
  }

  const addAward = () => {
    if (!formData) return
    const updatedAwards = [...(formData.awards || []), { title: "", year: undefined, issuer: "" }]
    setFormData({ ...formData, awards: updatedAwards })
  }

  const updateAward = (index: number, field: string, value: any) => {
    if (!formData) return
    const updatedAwards = formData.awards?.map((award, i) =>
      i === index ? { ...award, [field]: value } : award
    ) || []
    setFormData({ ...formData, awards: updatedAwards })
  }

  const removeAward = (index: number) => {
    if (!formData) return
    const updatedAwards = formData.awards?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, awards: updatedAwards })
  }

  const addCertificate = () => {
    setCertificates([...certificates, { name: "", year: undefined, image: "" }])
  }

  const updateCertificate = (index: number, field: 'name' | 'year' | 'image', value: any) => {
    const updatedCertificates = certificates.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    )
    setCertificates(updatedCertificates)
  }

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index))
  }

 const handleCertificateFileUpload = (index: number, file: File) => {
  const mockUrl = URL.createObjectURL(file)
  updateCertificate(index, 'image', mockUrl)
}


  const handleFileUpload = (field: keyof ProfessionalUser, file: File) => {
    if (!formData) return
    const mockUrl = URL.createObjectURL(file)
    if (field === "profilePic") {
      setFormData({ ...formData, [field]: mockUrl })
      if (errors.profilePic) {
        setErrors(prev => ({ ...prev, profilePic: "" }))
      }
    }
  }

  if (!formData) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            Edit Your Profile
          </h1>
          <p className="text-gray-600 text-lg">Update your professional information to showcase your expertise</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <Camera className="w-6 h-6" />
                Profile Picture *
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {formData.profilePic && (
                  <div className="relative">
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-100 shadow-lg hover:shadow-xl transition-shadow"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="profilePic"
                    className={`flex items-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-all duration-200 hover:border-blue-400 cursor-pointer ${errors.profilePic ? 'border-red-400 hover:border-red-400' : 'border-gray-300'}`}
                  >
                    <Upload className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Upload Profile Picture</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload("profilePic", file)
                    }}
                  />
                  {errors.profilePic && (
                    <p className="text-sm text-red-500 flex items-center gap-2 mt-3">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.profilePic}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <User className="w-6 h-6" />
                Basic Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              {/* Email (readonly) */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-base font-medium text-gray-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Email cannot be changed for security reasons
                </p>
              </div>

              {/* Name */}
              <div className="space-y-3">
                <label htmlFor="name" className="block text-base font-medium text-gray-800">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  className={`w-full p-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-200 transition-all text-black duration-200 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label htmlFor="phone" className="block text-base font-medium text-gray-800">
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  className={`w-full p-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-black ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <label htmlFor="bio" className="block text-base font-medium text-gray-800">
                  Bio *
                </label>
                <textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  onBlur={(e) => handleBlur('bio', e.target.value)}
                  className={`w-full p-3 border rounded-lg min-h-[120px] text-base focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-black leading-relaxed ${errors.bio ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Tell us about your professional background..."
                  rows={5}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <GraduationCap className="w-6 h-6" />
                Qualifications *
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-base text-black"
                  placeholder="Add qualification (e.g., PhD in Mathematics)"
                />
                <button
                  type="button"
                  onClick={addQualification}
                  disabled={!newQualification.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.qualifications && formData.qualifications.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {formData.qualifications.map((qual, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {qual}
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="text-blue-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No qualifications added yet</p>
                  <p className="text-sm">Add your educational qualifications above</p>
                </div>
              )}
              {errors.qualifications && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.qualifications}
                </p>
              )}
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Specializations *
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-base text-black"
                  placeholder="Add specialization (e.g., Calculus)"
                />
                <button
                  type="button"
                  onClick={addSpecialization}
                  disabled={!newSpecialization.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.specializations && formData.specializations.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {formData.specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm hover:bg-indigo-100 transition-colors"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialization(index)}
                        className="text-indigo-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No specializations added yet</p>
                  <p className="text-sm">Add your areas of expertise above</p>
                </div>
              )}
              {errors.specializations && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.specializations}
                </p>
              )}
            </div>
          </div>

          {/* Education History */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <GraduationCap className="w-6 h-6" />
                Education History *
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
            <div className="p-8 space-y-6">
              {formData.educationHistory?.map((edu, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-semibold text-lg text-gray-800">Education #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black "
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Institution"
                    />
                    <input
                      type="number"
                      value={edu.year || ''}
                      onChange={(e) => updateEducation(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Year"
                    />
                  </div>
                </div>
              ))}
              {errors.educationHistory && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.educationHistory}
                </p>
              )}
            </div>
          </div>

          {/* Awards */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <Award className="w-6 h-6" />
                Awards & Recognition
              </h2>
              <button
                type="button"
                onClick={addAward}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Award
              </button>
            </div>
            <div className="p-8 space-y-6">
              {formData.awards?.map((award, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-semibold text-lg text-gray-800">Award #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={award.title}
                      onChange={(e) => updateAward(index, 'title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Award Title"
                    />
                    <input
                      type="text"
                      value={award.issuer || ''}
                      onChange={(e) => updateAward(index, 'issuer', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Issuer"
                    />
                    <input
                      type="number"
                      value={award.year || ''}
                      onChange={(e) => updateAward(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Year"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold text-blue-600 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Certificates
              </h2>
              <button
                type="button"
                onClick={addCertificate}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            </div>
            <div className="p-8 space-y-6">
              {certificates.map((cert, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-semibold text-lg text-gray-800">Certificate #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Certificate Name"
                    />
                    <input
                      type="number"
                      value={cert.year || ''}
                      onChange={(e) => updateCertificate(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-base text-black"
                      placeholder="Year"
                    />
                    <div className="flex flex-col">
                      <label
                        htmlFor={`certificate-image-${index}`}
                        className="flex items-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl 
               hover:bg-blue-50 transition-all duration-200 hover:border-blue-400 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-800">Upload Certificate Image</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                      <input
                        id={`certificate-image-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleCertificateFileUpload(index, file)
                        }}
                      />

                      {cert.image && (
                        <img
                          src={cert.image}
                          alt={`Certificate ${index + 1}`}
                          className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      )}
                    </div>

                  </div>
                  {cert.image && (
                    <div className="mt-4">
                      <img
                        src={cert.image}
                        alt={`Certificate ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}