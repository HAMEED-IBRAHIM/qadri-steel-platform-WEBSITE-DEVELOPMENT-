import React, { useState } from 'react';
import './Explore.css';
import { FaBuilding, FaHardHat, FaTools, FaCheckCircle, FaIndustry, FaWarehouse } from 'react-icons/fa';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const projects = [
    {
      id: 1,
      title: 'Metro Rail Infrastructure',
      image: '/truck-pipes.jpg',
      category: 'Infrastructure',
      desc: 'Supplied over 5,000 tonnes of high-grade MS Pipes and TMT bars for underground tunneling support and station frameworks.'
    },
    {
      id: 2,
      title: 'Industrial Warehousing',
      image: '/roofing-sheet.png',
      category: 'Commercial',
      desc: 'Complete roofing and structural steel solution for a 200,000 sq.ft logistics hub.'
    },
    {
      id: 3,
      title: 'Modern Commercial Plaza',
      image: '/poster.jpg',
      category: 'Construction',
      desc: 'Premium finishing using our customized square and rectangular hollow sections for aesthetic facade support.'
    },
    {
      id: 4,
      title: 'Water Treatment Plant',
      image: '/pipes-hand.png',
      category: 'Infrastructure',
      desc: 'Specialized anti-corrosive GI pipes provided for municipal water supply lines.'
    }
  ];

  return (
    <div className="explore-container">
      {/* Hero Section */}
      <div className="explore-hero">
        <div className="explore-hero-overlay"></div>
        <div className="explore-hero-content">
          <div className="eh-badge">Discover Qadri Steel</div>
          <h1 className="eh-title">Building the Future,<br/><span className="highlight">One Structure at a Time</span></h1>
          <p className="eh-subtitle">Explore how our premium steel and tubes power the nation's biggest infrastructure and commercial projects.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="explore-tabs">
        <button className={`et-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <FaBuilding /> Featured Projects
        </button>
        <button className={`et-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          <FaTools /> Applications
        </button>
        <button className={`et-btn ${activeTab === 'quality' ? 'active' : ''}`} onClick={() => setActiveTab('quality')}>
          <FaCheckCircle /> Quality & Standards
        </button>
      </div>

      {/* Tab Content: Projects */}
      {activeTab === 'projects' && (
        <div className="explore-section fade-in">
          <div className="section-header">
            <h2>Landmark Deliveries</h2>
            <p>Our materials stand strong in these iconic structures.</p>
          </div>
          
          <div className="projects-grid">
            {projects.map(p => (
              <div className="project-card" key={p.id}>
                <div className="pc-img-wrap">
                  <img src={p.image} alt={p.title} />
                  <span className="pc-tag">{p.category}</span>
                </div>
                <div className="pc-content">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Applications */}
      {activeTab === 'applications' && (
        <div className="explore-section fade-in">
          <div className="section-header">
            <h2>Industrial Applications</h2>
            <p>Versatile steel solutions for every sector.</p>
          </div>
          
          <div className="app-grid">
            <div className="app-box">
              <FaIndustry className="app-icon" />
              <h3>Manufacturing</h3>
              <p>Heavy-duty structural steel for factory sheds, crane girders, and machinery support.</p>
            </div>
            <div className="app-box">
              <FaHardHat className="app-icon" />
              <h3>Construction</h3>
              <p>TMT bars, scaffolding pipes, and binding wires for residential and commercial builds.</p>
            </div>
            <div className="app-box">
              <FaWarehouse className="app-icon" />
              <h3>Agriculture & Storage</h3>
              <p>Corrosion-resistant roofing sheets and hollow sections for greenhouses and silos.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Quality */}
      {activeTab === 'quality' && (
        <div className="explore-section fade-in">
          <div className="quality-showcase">
            <div className="qs-text">
              <h2>Uncompromising Quality</h2>
              <p>At Qadri Steel, every pipe and sheet passes through rigorous quality checks to ensure longevity, strength, and safety.</p>
              <ul className="qs-list">
                <li><FaCheckCircle className="chk" /> ISO 9001:2015 Certified Manufacturing Partners</li>
                <li><FaCheckCircle className="chk" /> Spectrometer Tested for Chemical Composition</li>
                <li><FaCheckCircle className="chk" /> UTM Tested for Tensile & Yield Strength</li>
                <li><FaCheckCircle className="chk" /> Anti-Rust Coating on all Hollow Sections</li>
              </ul>
            </div>
            <div className="qs-image">
              <div className="qs-shield">
                <span>100%</span>
                <small>Tested</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
