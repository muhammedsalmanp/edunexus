
"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileAwardsProps {
  user: ProfessionalUser
}

export default function ProfileAwards({ user }: ProfileAwardsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Awards & Recognition</h2>
      </div>
      <div className="grid gap-6">
        {user.awards && user.awards.length > 0 ? (
          user.awards.map((award, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{award.title}</h3>
                <p className="text-slate-600 font-medium mb-1">{award.issuer || "—"}</p>
                <p className="text-slate-500 text-sm">{award.year || "—"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 font-medium">No awards listed</p>
        )}
      </div>
    </div>
  )
}