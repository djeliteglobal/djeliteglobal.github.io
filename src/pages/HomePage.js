import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';

// INSTRUCCIÓN: Descarga tu animación Lottie de unicorn.studio
// y guárdala como 'hero-animation.json' en el directorio src/
let animationData = null;
try {
  animationData = require('../hero-animation.json');
} catch (error) {
  console.log('No se encontró la animación. Descárgala para mostrarla.');
}

function HomePage() {

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Your Career in Music Starts Here.</h1>
          <p>Access exclusive courses, tutorials, and the tools you need to become a professional DJ and producer.</p>
          <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
        </div>
        <div className="hero-animation">
          {animationData && <Lottie options={defaultOptions} />}
        </div>
      </section>

      {/* Aquí irían el resto de las secciones mejoradas de la HomePage */}
    </div>
  );
}

export default HomePage;