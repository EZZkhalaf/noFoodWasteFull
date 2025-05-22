// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight } from 'lucide-react';
// import RecipeElement from '../Components/RecipeElement';
// // import { useScrollAnimation } from '../hooks/useScrollAnimation';
// import { motion } from 'framer-motion';

// const CategorySection = ({ category, recipes }) => {
//   if (recipes.length === 0) return null;

//   // const scrollAnimation = useScrollAnimation();

//   return (
//     <motion.section
//       className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//     >
//       <div className="flex justify-center">
//         <div className="w-[30vw] border-t-2 border-sand-200"></div>
//       </div>

//       <div className="flex justify-between items-center mb-8 mt-5">
//         <h2 className="font-serif text-3xl font-medium">{category}</h2>

//         <Link 
//           to={`/findRecipes?category=${encodeURIComponent(category)}`} 

//           className="text-spice-500 font-medium flex items-center hover:text-spice-600 transition-colors"
//         >
//           View all
//           <ArrowRight className="ml-1 w-4 h-4" />
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {recipes.slice(0, 4).map(recipe => ( // Show only 4 recipes

//           <RecipeElement 

//             key={recipe._id}
//             RecipeId={recipe._id}
//             recipe_image={recipe.recipe_image}
//             recipe_name={recipe.recipe_title}
//             recipe_description={recipe.recipe_description}

//             recipeType={recipe.type}

//             cookingTime={recipe.cookingTime}
//             difficulty={recipe.difficulty}
//           />
//         ))}
//       </div>
//     </motion.section>
//   );
// }


// export default CategorySection;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RecipeElement from '../Components/RecipeElement';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CategorySection = ({ category, recipes }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (recipes.length === 0) return null;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
    >
      <div className="flex justify-center">
        <div className="w-[30vw] border-t-2 border-sand-200"></div>
      </div>

      <div className="flex justify-between items-center mb-8 mt-5">
        <h2 className="font-serif text-3xl font-medium">{category}</h2>

        <Link 
          to={`/findRecipes?category=${encodeURIComponent(category)}`} 
          className="text-spice-500 font-medium flex items-center hover:text-spice-600 transition-colors"
        >
          View all
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {recipes.slice(0, 4).map((recipe) => (
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
        ))}
      </motion.div>
    </motion.section>
  );
}

export default CategorySection;