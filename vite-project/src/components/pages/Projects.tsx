import React from 'react';
import '../styling/Projects.scss';

const Projects: React.FC = () => {
  return (
    <section className="projects" id="projects">
      <div className="project-list">
        <section className='project-item'>
        <img src="" alt="" />
          <h3>Project 1</h3>
          <p>Description of Project 1</p>
        </section>
        <section className='project-item'>
            <img src="" alt="" />
            <h3>Project 2</h3>
            <p>Description of Project 2</p>
        </section>
      </div>
    </section>
  );
};

export default Projects;