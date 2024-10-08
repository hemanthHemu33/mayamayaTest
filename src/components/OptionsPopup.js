import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './OptionsPopup.css';

const OptionsPopup = ({ isOpen, onClose, jobDescriptions, onSubmit }) => {
  const [useForensics, setUseForensics] = useState(true); // Initially checked
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setUseForensics(true); // Reset to initial checked state
      setSelectedJobDescription('');
      setNewJobDescription(''); // Reset new job description
    }
  }, [isOpen]);

  const handleJobDescriptionSelect = (e) => {
    setSelectedJobDescription(e.target.value);
  };

  const handleCreateJobDescription = () => {
    navigate('/job-description');
  };

  const handleProceed = () => {
    if (selectedJobDescription) {
      onSubmit({ useForensics, selectedJobDescription });
      onClose();
      window.scrollTo(0, 0);
      navigate('/results');
    } else {
      alert('Please select a job description.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="options-popup-overlay">
      <div className="options-popup-content">
        <button className="options-popup-close-button" onClick={onClose}>
          &times; {/* Cross icon */}
        </button>
        <h2 className="options-popup-title">Processing Options</h2>

        <div className="options-popup-checkboxes">
          <label className="options-popup-label">
            <input
              type="checkbox"
              checked={useForensics}
              onChange={() => setUseForensics(!useForensics)}
              style={{marginRight: "5px", paddingTop: "5px"}}
            />
            Use Resume Forensics
          </label>
        </div>

        <div className="options-popup-jobdesc">
          <select
            id="job-description"
            className="options-popup-dropdown"
            value={selectedJobDescription}
            onChange={handleJobDescriptionSelect}
          >
            <option value="">-- Select a Job Description --</option>
            {jobDescriptions.map((job, index) => (
              <option key={index} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <label className="options-popup-label" htmlFor="new-job-description">
            OR
          </label>

          <button className="options-popup-create-button" onClick={handleCreateJobDescription}>
            Create Job Description
          </button>
        </div>

        <div className="options-popup-actions">
          <button className="options-popup-proceed-button" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsPopup;
