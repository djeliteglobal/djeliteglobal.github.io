import React from 'react';

// Datos de ejemplo - eventualmente vendrán de una API
const courses = [
  { id: 1, title: 'Booth Presence', author: 'Mama Snake', duration: '1 hr 7 min', level: 'Rookie', image: 'https://via.placeholder.com/300x180' },
  { id: 2, title: 'The Vinyl Code', author: 'Yerko', duration: '1 hr 20 min', level: 'Rookie', image: 'https://via.placeholder.com/300x180' },
  { id: 3, title: '4-deck & layering', author: 'Future.exe', duration: '1 hr 30 min', level: 'Rookie', image: 'https://via.placeholder.com/300x180' },
  { id: 4, title: 'Industry Foundations', author: 'Perc', duration: '2 hr 15 min', level: 'Pro', image: 'https://via.placeholder.com/300x180' },
  { id: 5, title: 'Into Hard Groove', author: 'Dax J', duration: '1 hr 40 min', level: 'Pro', image: 'https://via.placeholder.com/300x180' },
  { id: 6, title: 'Mixing Recreation', author: 'SNTS', duration: '1 hr 30 min', level: 'Rookie', image: 'https://via.placeholder.com/300x180' },
];

const CourseCard = ({ course }) => (
  <div className="course-card">
    <img src={course.image} alt={course.title} className="card-image" />
    <div className="card-content">
      <h4>{course.title}</h4>
      <p>By {course.author} &bull; {course.duration}</p>
      <div className="card-footer">
        <span className="level-tag">{course.level}</span>
        <button className="btn btn-primary">Watch Now</button>
      </div>
    </div>
  </div>
);

function CoursesPage() {
  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>All Courses</h1>
        <p>Find your next challenge and level up your skills.</p>
      </div>
      <div className="course-card-grid">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
