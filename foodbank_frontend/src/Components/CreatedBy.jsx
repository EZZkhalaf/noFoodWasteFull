// components/CreatedBy.js
import { Link } from "react-router-dom";

const CreatedBy = ({ recipeUser, defaultRecipeImage }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
      <Link
        href={`/userPage/${recipeUser?._id}`}
        className="flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-6"
      >
        <div className="relative -mt-12 xs:-mt-0">
          <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl rotate-45 overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={recipeUser?.avatar || defaultRecipeImage} 
              alt="User avatar"
              className="w-full h-full object-cover -rotate-45 scale-125"
            />
          </div>
          {/* Verification badge */}
          {recipeUser?.verified && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 sm:p-1 shadow-sm">
              <div className="bg-emerald-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM10 13.25a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {recipeUser?.username || "Unknown Chef"}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-emerald-600">
              Recipe Creator • {recipeUser?.experience || "Professional Chef"}
            </p>
          </div>
          
          <div className="inline-flex items-center bg-white rounded-full py-1 px-3 sm:py-1.5 sm:px-4 shadow-sm border border-gray-200">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <time 
              dateTime={recipeUser?.createdAt} 
              className="text-xs sm:text-sm font-medium text-gray-600"
            >
              {new Date(recipeUser?.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CreatedBy;