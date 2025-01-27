import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div class="container px-5">
            <a class="navbar-brand" href="/"><span class="fw-bolder text-primary">Start Bootstrap</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                    <li class="nav-item"><NavLink class="nav-link" to="/">Home</NavLink></li>
                    <li class="nav-item"><NavLink class="nav-link" to="resume.html">Resume</NavLink></li>
                    <li class="nav-item"><NavLink class="nav-link" to="projects.html">Projects</NavLink></li>
                    <li class="nav-item"><NavLink class="nav-link" to="contact.html">Contact</NavLink></li>
                </ul>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;