

// import React, { useState, useEffect, useCallback } from 'react';
// import IngredientSelection from '../Components/IngredientSelection';
// import RecipeType from '../Components/RecipeType';
// import NavBar from '../Components/NavBar';
// import RecipeElement from '../Components/RecipeElement';
// import { ServerOff } from 'lucide-react';
// import { useSearchParams } from 'react-router-dom';
// import { ThreeDot } from 'react-loading-indicators';

// const API_ENDPOINTS = {
//   RECIPES: 'http://localhost:3000/recipe/getRecipesPerPage',
//   SEARCH_BY_NAME: 'http://localhost:3000/recipe/searchRecipeByName',
//   SEARCH_BY_INGREDIENTS: 'http://localhost:3000/recipe/search',
// };

// const RECIPES_PER_PAGE = 12;

// const FindRecipes = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [displayedRecipes, setDisplayedRecipes] = useState([]);
//   const [ingredientsOpen, setIngredientsOpen] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedRecipeType, setSelectedRecipeType] = useState(''); 
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchParams] = useSearchParams();
//   const componentTitle = 'filter by ingredients : '
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);


//   useEffect(() => {
//     const initialCategory = searchParams.get('category');
//     if (initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
//   }, [searchParams]);

//   const fetchRecipes = useCallback(async () => {
//     setLoading(true);
//     const params = new URLSearchParams({
//       page: currentPage.toString(),
//       perPage: RECIPES_PER_PAGE.toString(),
//       searchQuery: searchQuery,
//       ingredients: JSON.stringify(selectedItems),
//       type: selectedRecipeType
//     });

//     try {
//       const response = await fetch(`http://localhost:3000/recipe/getRecipesPerPage?${params}`);
//       if (!response.ok) throw new Error('Network error');
      
//       const data = await response.json();
//       setRecipes(data.recipes);
//       setTotalPages(data.totalPages);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, selectedItems, selectedRecipeType]);

//   useEffect(() => {
//     fetchRecipes();
//   }, [fetchRecipes]);

//   // useEffect(()=>{
//   //   const handler = setTimeout(()=>{
//   //     setDebouncedSearchQuery(searchQuery);
//   //   },300)//for debounce in the api call

//   //   return ()=> clearTimeout(handler)
//   // },[searchQuery])


//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const renderRecipes = (recipes) => (
//     recipes.map((recipe) => (
//       <RecipeElement 
//         key={recipe._id}
//         RecipeId={recipe._id}
//         recipe_image={recipe.recipe_image}
//         recipe_name={recipe.recipe_title}
//         recipe_description={recipe.recipe_description}
//         recipeType={recipe.type} 
//         cookingTime={recipe.cookingTime}
//         difficulty={recipe.difficullty}
//       />
//     ))
//   );

//   if (loading)     
//     return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
//         <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
//       </div>
//     </div>
//   );
  
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center p-8 text-red-500">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <NavBar />
//       <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
//         <div className="mb-10 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//             Find Recipes
//           </h2>

//           <div className="flex w-full max-w-lg mx-auto">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search recipes..."
//               className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
//             />
//             <button
//               onClick={() => setIngredientsOpen(prev => !prev)}
//               className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition">
//               Filter with ingredients
//             </button>
//           </div>
//         </div>

//         {ingredientsOpen && (
//           <div className='w-full'>
//             <IngredientSelection
//               selectedItems={selectedItems}
//               setSelectedItems={setSelectedItems}
//               componentTitle={componentTitle}
//             />
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
//             <RecipeType
//               selectedRecipeType={selectedRecipeType}
//               setSelectedRecipeType={setSelectedRecipeType}
//             />
//           </div>

//           <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {recipes.length > 0 ? renderRecipes(recipes) : (
//               <div className="text-center text-gray-500 col-span-full">
//                 <ServerOff size={48} />
//                 <p>No recipes found.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="mt-10 flex justify-center">
//             <nav className="flex items-center gap-1">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-indigo-500 text-white' : ''}`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindRecipes;



import React, { useState, useEffect, useCallback } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import { motion } from 'framer-motion';

const API_ENDPOINT = 'http://localhost:3000/recipe/getRecipesPerPage';
const RECIPES_PER_PAGE = 12;

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRecipeType, setSelectedRecipeType] = useState('');
  const [pageLoading, setPageLoading] = useState(false); // Track page loading state
  const [searching, setSearching] = useState(false); // Track search input loading state
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const componentTitle = 'Filter by ingredients:';
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) {
      setSelectedRecipeType(decodeURIComponent(initialCategory));
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchRecipes = useCallback(async () => {
    setPageLoading(true); // Set page loading to true when starting the fetch
    const params = new URLSearchParams({
      page: currentPage.toString(),
      perPage: RECIPES_PER_PAGE.toString(),
      searchQuery: debouncedSearchQuery,
      ingredients: JSON.stringify(selectedItems),
      type: selectedRecipeType,
    });

    try {
      const response = await fetch(`${API_ENDPOINT}?${params}`);
      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setPageLoading(false); // Turn off loading after fetching
    }
  }, [currentPage, debouncedSearchQuery, selectedItems, selectedRecipeType]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderRecipes = () => (
    recipes.length > 0 ? (
      recipes.map((recipe) => (
        <motion.div
          key={recipe._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="transform transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
        >
          <RecipeElement
            RecipeId={recipe._id}
            recipe_image={recipe.recipe_image}
            recipe_name={recipe.recipe_title}
            recipe_description={recipe.recipe_description}
            recipeType={recipe.type}
            cookingTime={recipe.cookingTime}
            difficulty={recipe.difficulty}
          />
        </motion.div>
      ))
    ) : (
      <div className="text-center text-gray-500 col-span-full">
        <ServerOff size={48} />
        <p>No recipes found.</p>
      </div>
    )
  );

  useEffect(() => {
    if (debouncedSearchQuery) {
      setSearching(true); // Set searching state when starting to type
    } else {
      setSearching(false); // Set searching state to false when searchQuery is empty
    }
  }, [debouncedSearchQuery]);

  if (pageLoading && !searching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
          <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Find Recipes</h2>

          <div className="flex w-full max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            <button
              type="button"
              onClick={() => setIngredientsOpen(prev => !prev)}
              className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition"
            >
              Filter with ingredients
            </button>
          </div>
        </div>

        {ingredientsOpen && (
          <div className="w-full">
            <IngredientSelection
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              componentTitle={componentTitle}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
            <RecipeType
              selectedRecipeType={selectedRecipeType}
              setSelectedRecipeType={setSelectedRecipeType}
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderRecipes()}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-indigo-500 text-white' : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRecipes;
