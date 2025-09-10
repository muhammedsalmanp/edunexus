
"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileAboutProps {
  user: ProfessionalUser
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">About</h2>
      </div>
      <p className="text-slate-600 leading-relaxed text-lg">{user.bio || "—"}</p>
    </div>
  )
}
