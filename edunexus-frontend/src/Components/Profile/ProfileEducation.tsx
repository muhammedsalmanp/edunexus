
"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileEducationProps {
  user: ProfessionalUser
}

export default function ProfileEducation({ user }: ProfileEducationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Education History</h2>
      </div>
      <div className="space-y-6">
        {user.educationHistory && user.educationHistory.length > 0 ? (
          user.educationHistory.map((edu, index) => (
            <div key={index} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-2">{edu.degree}</h3>
                <p className="text-blue-600 font-semibold mb-1">{edu.institution}</p>
                <p className="text-slate-500 font-medium">{edu.year || "—"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 font-medium">No education history listed</p>
        )}
      </div>
    </div>
  )
}
