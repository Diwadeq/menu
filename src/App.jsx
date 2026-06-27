import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Library from '@/pages/Library';
import RecipeDetail from '@/pages/RecipeDetail';
import RecipeForm from '@/pages/RecipeForm';
import SwipeMode from '@/pages/SwipeMode';
import Planner from '@/pages/Planner';
import ShoppingList from '@/pages/ShoppingList';
import Creami from '@/pages/Creami';
import SweetHub from '@/pages/SweetHub';
import SavoryHub from '@/pages/SavoryHub';

function App() {
  return (
    <Router basename="/menu">
      <ScrollToTop />
      <Routes>
        {/* Fullscreen — no bottom nav */}
        <Route path="/swipe" element={<SwipeMode />} />
        <Route path="/sweet" element={<SweetHub />} />
        <Route path="/savory" element={<SavoryHub />} />
        <Route path="/recipe/new" element={<RecipeForm />} />
        <Route path="/recipe/:id/edit" element={<RecipeForm />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />

        {/* Main layout with bottom nav */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/creami" element={<Creami />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
