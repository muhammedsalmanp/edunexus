
// "use client"

// import type { ProfessionalUser } from "../../types/TeacherTypes"

// interface ProfileCertificatesProps {
//   user: ProfessionalUser
// }

// export default function ProfileCertificates({ user }: ProfileCertificatesProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
//           <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold text-slate-800">Certificates</h2>
//       </div>
//       <div className="grid grid-cols-1 gap-4">
//         {user.certificates && user.certificates.length > 0 ? (
//           user.certificates.map((cert, index) => {
//             const [certName, certImage] = cert.includes("|") ? cert.split("|") : [cert, null]
//             return (
//               <div
//                 key={index}
//                 className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
//               >
//                 {certImage ? (
//                   <div className="space-y-3">
//                     <div className="relative group cursor-pointer">
//                       <img
//                         src={certImage || "/placeholder.svg"}
//                         alt={certName}
//                         className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
//                       />
//                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
//                         <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
//                           <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <div className="w-5 h-5 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                       </div>
//                       <span className="text-slate-700 font-medium text-sm leading-relaxed">{certName}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-start gap-3 p-3">
//                     <div className="w-5 h-5 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                     </div>
//                     <span className="text-slate-700 font-medium text-sm leading-relaxed">{certName}</span>
//                   </div>
//                 )}
//               </div>
//             )
//           })
//         ) : (
//           <p className="text-slate-400 font-medium">No certificates listed</p>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import type { ProfessionalUser } from "../../types/TeacherTypes"

interface ProfileCertificatesProps {
  user: ProfessionalUser
}

export default function ProfileCertificates({ user }: ProfileCertificatesProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Certificates</h2>
      </div>

      {/* Certificates List */}
      <div className="grid grid-cols-1 gap-4">
        {user.certificates && user.certificates.length > 0 ? (
          user.certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
            >
              {cert.image ? (
                <div>
                  {/* Image */}
                  <div className="relative group cursor-pointer">
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.name}
                      className="w h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                        <svg
                          className="w-5 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Name + Year */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-slate-700 font-medium text-sm block">
                        {cert.name}
                      </span>
                      {cert.year && (
                        <span className="text-slate-500 text-xs">
                          {cert.year}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-slate-700 font-medium text-sm block">
                      {cert.name}
                    </span>
                    {cert.year && (
                      <span className="text-slate-500 text-xs">
                        {cert.year}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-400 font-medium">No certificates listed</p>
        )}
      </div>
    </div>
  )
}
