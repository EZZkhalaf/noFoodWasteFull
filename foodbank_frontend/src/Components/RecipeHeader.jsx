// components/RecipeHeader.js
import { HiMiniPencilSquare } from "react-icons/hi2";
import { RiCloseLargeLine } from "react-icons/ri";

const RecipeHeader = ({
  recipe,
  isEditing,
  newRecipeTitle,
  setNewRecipeTitle,
  setIsEditing,
  saveEditedRecipe,
  cancelEditing,
  fileInputRef,
  newRecipeImage,
  setNewRecipeImage,
  defaultRecipeImage
}) => {


    
  const handleRecipeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewRecipeImage(reader.result);
    };
    reader.readAsDataURL(file);

    setNewRecipeImage(file);
  };

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden ring-1 sm:ring-2 ring-purple-200">
      <div className="relative">
        {isEditing ? (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleRecipeImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <img
              src={newRecipeImage}
              alt={recipe.recipe_title || "Default Recipe Image"}
              className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md"
              onClick={() => fileInputRef.current.click()}
              onError={(e) => {
                e.target.src = defaultRecipeImage;
                e.target.alt = "Default Recipe Image";
              }}
            />
          </div>
        ) : (
          <img
            src={recipe.recipe_image || defaultRecipeImage}
            alt={recipe.recipe_title || "Default Recipe Image"}
            className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover"
            onError={(e) => {
              e.target.src = defaultRecipeImage;
              e.target.alt = "Default Recipe Image";
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md">
            {isEditing ? (
              <input
                type="text"
                value={newRecipeTitle}
                onChange={(e) =>setNewRecipeTitle(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl md:text-4xl font-bold text-white outline-none"
              />
            ) : (
              recipe.recipe_title
            )}
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
            {/* Buttons responsive adjustments */}
            <div className="flex gap-2 sm:gap-3">
              {isEditing ? (
                <>
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg"
                    onClick={saveEditedRecipe}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-full shadow-lg"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-full shadow-lg"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Choose Image
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all"
                  onClick={() => setIsEditing(true)}
                >
                  <HiMiniPencilSquare className="mr-1 sm:mr-2 w-4 h-4" />
                  Edit Recipe
                </button>
              )}
            </div>
            
            <span className="text-white bg-gray-800/90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {recipe.Bookmarks?.length || 0} bookmarks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;