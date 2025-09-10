
"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileQualificationsProps {
  user: ProfessionalUser
}

export default function ProfileQualifications({ user }: ProfileQualificationsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Qualifications</h2>
      </div>
      <div className="space-y-4">
        {user.qualifications && user.qualifications.length > 0 ? (
          user.qualifications.map((qualification, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-slate-700 font-medium text-sm leading-relaxed">{qualification}</span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 font-medium">No qualifications listed</p>
        )}
      </div>
    </div>
  )
}
