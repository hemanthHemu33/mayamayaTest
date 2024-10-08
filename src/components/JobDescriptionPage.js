import React, { useState } from 'react';
import './JobDescriptionPage.css';
import Header from './Header';

const JobDescriptionPage = ({
  isModalOpen,
  isRegisterModalOpen,
  setIsRegisterModalOpen,
  setIsModalOpen,
  setIsLoggedIn,
  setUsername,
  setAccessKey,
  remainingCredits,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredExperience, setPreferredExperience] = useState('');
  const [jobSummary, setJobSummary] = useState('');

  // Initialize with dummy data
  const [savedJobDescriptions, setSavedJobDescriptions] = useState([
    {
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      requiredSkills: ['JavaScript', 'React', 'Node.js'],
      preferredExperience: '2-3 years',
      jobSummary: 'Responsible for developing and maintaining web applications.',
    },
    {
      jobTitle: 'Product Manager',
      department: 'Product',
      requiredSkills: ['Agile', 'Scrum', 'Communication'],
      preferredExperience: '5+ years',
      jobSummary: 'Manage product lifecycle and coordinate cross-functional teams.',
    },
  ]);

  const handleSave = () => {
    const jobDescription = {
      jobTitle,
      department,
      requiredSkills: requiredSkills.split(','), // Split skills into array
      preferredExperience,
      jobSummary,
    };

    // Save job description logic (e.g., API call)
    console.log('Job Description Saved:', jobDescription);

    // Update saved job descriptions state
    setSavedJobDescriptions([...savedJobDescriptions, jobDescription]);

    // Clear the form
    setJobTitle('');
    setDepartment('');
    setRequiredSkills('');
    setPreferredExperience('');
    setJobSummary('');
  };

  return (
    <div>
      <Header
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
        setAccessKey={setAccessKey}
        remainingCredits={remainingCredits}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        isRegisterModalOpen={isRegisterModalOpen}
      />
      <div className='job-description-main'>
        <div className="job-description-container">
          <h2>Create a New Job Description</h2>
          <div className="job-form">
            <label>Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
            />

            <label>Department:</label> {/* New department input */}
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department"
            />

            <label>Required Skills (comma separated):</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
            />

            <label>Preferred Experience:</label>
            <input
              type="text"
              value={preferredExperience}
              onChange={(e) => setPreferredExperience(e.target.value)}
              placeholder="e.g., 3-5 years"
            />

            <label>Job Summary:</label>
            <textarea
              value={jobSummary}
              onChange={(e) => setJobSummary(e.target.value)}
              placeholder="Enter job summary"
            ></textarea>

            <button className="save-btn" onClick={handleSave}>
              Save Job Description
            </button>
          </div>
        </div>
        <div>
          {/* Table to display saved job descriptions */}
          {savedJobDescriptions.length > 0 && (
            <div className="saved-job-descriptions">
              <h3>Saved Job Descriptions</h3>
              <table className="saved-job-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Required Skills</th>
                    <th>Preferred Experience</th>
                    <th>Job Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {savedJobDescriptions.map((job, index) => (
                    <tr key={index}>
                      <td>{job.jobTitle}</td>
                      <td>{job.department}</td>
                      <td>{job.requiredSkills.join(', ')}</td>
                      <td>{job.preferredExperience}</td>
                      <td>{job.jobSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>Resume Forensics - A MayaMaya Product</p>
      </footer>
    </div>
  );
};

export default JobDescriptionPage;
