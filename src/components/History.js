import React, { useEffect, useState } from 'react';
import Header from './Header';
import './History.css';
import { FaDownload, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const History = ({ isModalOpen, isRegisterModalOpen, setIsRegisterModalOpen, setIsModalOpen, setIsLoggedIn, setUsername, setAccessKey, remainingCredits }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [jobDescriptions, setJobDescriptions] = useState([ // Sample job descriptions
    { id: 1, title: 'Software Engineer' },
    { id: 2, title: 'Data Scientist' }
  ]);
  const entriesPerPage = 10;
  const navigate = useNavigate();


  useEffect(() => {
    // Dummy data to mock API response for testing
    const dummyHistory = [
      {
        _id: '1',
        created_date: '2024-09-25',
        num_files: 5,
        clean_resumes: 4,
        discrepancies: {
          name: { value: 1 },
          work_experience: { value: 2 },
          education: { value: 1 },
          personal_info: { value: 0 },
        },
        num_duplicate_groups: 2,
        appliedForensics: true, // New column for "Resume Forensics"
        jobDescriptionMatch: true, // New column for job description match
        user_id: 'user1@example.com',
      },
      // Add more entries as needed
    ];

    setHistoryData(dummyHistory);
    setIsLoading(false);
  }, []);

  const handleDownload = async (email, userId) => {
    // Mock download function for testing
    console.log('Downloading result for user:', email);
  };

  const handleJobDescriptionSelect = (e) => {
    setSelectedJobDescription(e.target.value);
  };

  const handleCreateJobDescription = () => {
    navigate('/job-description');
  };

  const handleProceed = () => {
    if (selectedJobDescription) {
      navigate('/results');
      setShowPopup(false);
    } else {
      alert('Please select a job description.');
    }
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const totalEntries = historyData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const currentEntries = historyData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="historyPage-container">
      <Header isModalOpen={isModalOpen} isRegisterModalOpen={isRegisterModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen} setIsModalOpen={setIsModalOpen} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setAccessKey={setAccessKey} remainingCredits={remainingCredits} />

      <main className="historyPage-main">
        {isLoading ? (
          <div className="loader"></div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <section className="historyPage-section">
            <h2 className="historyPage-title">Duplicate Check History</h2>
            <div className="historyPage-table-wrapper">
              <table className="historyPage-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Resume Forensics</th>
                    <th>Resumes Detected</th>
                    <th>Good Resumes</th>
                    <th>Name Discrepancy</th>
                    <th>Work Experience Discrepancy</th>
                    <th>Education Discrepancy</th>
                    <th>Personal Info Discrepancy</th>
                    <th>Duplicate Groups</th>
                    <th>Job Description Matching</th>
                    <th>Download Forensics Result</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.created_date).toLocaleDateString()}</td>
                      <td>{entry.appliedForensics ? <FaCheckCircle style={{ color: 'green' }} /> : 'Not Applied'}</td>
                      <td>{entry.num_files || 0}</td>
                      <td>{entry.clean_resumes || 0}</td>

                      {['name', 'work_experience', 'education', 'personal_info'].map((discrepancyType) => (
                        <td key={discrepancyType}>
                          {entry.discrepancies?.[discrepancyType]?.value || 0}
                        </td>
                      ))}

                      <td>{entry.num_duplicate_groups || 0}</td>
                      <td>
                        <FaUsers
                          className="match-icon"
                          style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#672024' }}
                          onClick={openPopup}
                        />
                      </td>
                      <td>
                        <FaDownload
                          className="download-icon"
                          style={{ cursor: 'pointer', fontSize: '1rem', color: '#672024' }}
                          onClick={() => handleDownload(entry.user_id, entry._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>MayaMaya Lite - A MayaMaya Product</p>
      </footer>

      {/* Popup for Job Description */}
      {showPopup && (
        <div className="options-popup-overlay">
        <div className="options-popup-content">
          <div>
          <button className="options-popup-close-button" onClick={closePopup}>
            &times; {/* Cross icon */}
          </button>
          <h2 className="options-popup-title" style={{fontFamily: "'Titillium Web', sans-serif", fontWeight: "500"}}>Select or Create a Job Description</h2>
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
              <button className="options-popup-proceed-button" style={{marginTop: "30px"}} onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
          </div>
      )}
      
    </div>
  );
};

export default History;
