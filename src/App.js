import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ShopPage from './pages/ShopPage';
import DashboardPage from './pages/DashboardPage';
import PreferencesPage from './pages/PreferencesPage';
import BundleDetailPage from './pages/BundleDetailPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/bundles/:id" element={<BundleDetailPage />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
