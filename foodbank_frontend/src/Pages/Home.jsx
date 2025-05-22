
import React, { useEffect, useState , useRef  } from 'react';
import { useNavigate, Link , useLocation} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { useAuthContext } from '../hooks/useAuthContext';
import RecipeElement from '../Components/RecipeElement';
import bgFoodImage from '../assets/bgFoodImage.jpg'
import FeaturedRecipe from '../Components/FeaturedRecipe';
import CategorySection from '../Components/CategorySection';  
import { ThreeDot } from 'react-loading-indicators';
import './HomeAnimation.css'
import UserHomeFeed from '../Components/UserHomeFeed';

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const sectionRef = useRef(null);
  const [featuredRecipe , setFeaturedRecipe] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
        const uniqueTypes = [...new Set(data.map(recipe => recipe.type))];
        setCategories(uniqueTypes);

        //this hook for the most bookmarked recipe fetching 
        const response2 = await fetch('http://localhost:3000/recipe/mostPopularRecipe/first');
        if (!response2.ok) {
          console.error("Error in the response from the backend:", response2.statusText);
          return;
        }
        const data2 = await response2.json();
        
        setFeaturedRecipe(data2);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    

    fetchRecipes();
  }, []);


  useEffect(() => {
    const element = sectionRef.current;
    if(element){
      element.classList.remove('slide-in-left-soft'); //reset
      void element.offsetWidth;
      element.classList.add('slide-in-left-soft');
    }
  }, [location.pathname]);



  useEffect(() => {
    if (!user) navigate('/login');
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const getRecipesByCategory = (category) => {
    return recipes.filter(recipe => recipe.type === category).slice(0, 3);
  };

  if (!user) return null;



  if (loading)     
    return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );
  
if (error) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 text-red-500">
        Error: {error}
      </div>
    </div>
  );
}







  return (

    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="pt-14 flex-grow">
        {/* Hero Section */}
 



        <section
          ref={sectionRef}
          className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-sand-50"
        >
          {/* Background Image with Blur and Overlay */}
          <div className="absolute inset-0 overflow-hidden">
          <img
            src={bgFoodImage}
              alt="Delicious food"
              className="w-full h-full object-cover "
            />

            <div className="absolute inset-0  bg-opacity-10"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4 animate-fade-up">
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-md">
              Welcome back, {user.username}!
            </h1>
            <p className="text-lg md:text-2xl text-slate-100 mb-8 max-w-2xl mx-auto drop-shadow-sm">
              Discover recipes that bring joy to your table, with quality ingredients and straightforward techniques.
            </p>

            {/* Explore Recipes Button */}
            <Link
              to="/findRecipes"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-spice-500 to-spice-600 
                        text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl 
                        transition-transform duration-300 ease-in-out"
            >
              Explore Recipes
            </Link>
          </div>
        </section>





        <section className="page-container mt-5">
          <h2 className="font-serif text-3xl font-medium mb-8 text-center">Featured Recipe</h2>
          <div className="animate-scroll">
            <FeaturedRecipe recipe={featuredRecipe} />
          </div>
        </section>

        <section className="page-container mt-5">
          <UserHomeFeed />
        </section>

        {/* Category Sections */}
        {categories.slice(0, 3).map(category => { // Limit to 4 categories
          const categoryRecipes = getRecipesByCategory(category);

            return (
              <CategorySection
                key={category}
                category={category}
                recipes={categoryRecipes}
              />
            );
          })}


      </main>

      <Footer />
    </div>
  );
};

export default Home;
