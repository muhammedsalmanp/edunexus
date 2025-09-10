
"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileSpecializationsProps {
  user: ProfessionalUser
}

export default function ProfileSpecializations({ user }: ProfileSpecializationsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Specializations</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {user.specializations && user.specializations.length > 0 ? (
          user.specializations.map((spec, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
            >
              {spec}
            </span>
          ))
        ) : (
          <p className="text-slate-400 font-medium">No specializations listed</p>
        )}
      </div>
    </div>
  )
}
