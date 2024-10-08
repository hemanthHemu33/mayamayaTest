import React, { useState, useEffect  } from "react";
import './UploadSection.css';
import ProgressResultsSection from './ProgressResultsSection';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Header from './Header';

function UploadSection({ setIsRegisterModalOpen, isRegisterModalOpen, setIsModalOpen, isModalOpen, processStatus, setUploadedFiles, setDriveLink, setIsLoggedIn, setUsername, setAccessKey, uploadedFiles, accessKey, remainingCredits, setRemainingCredits, userId }) {
  const [driveLink, setDriveLinkLocal] = useState("");
  const [isLoggedIn, setIsLoggedInLocal] = useState(false);
  const [username, setUsernameLocal] = useState(""); // For login
  const [files, setFiles] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedAccessToken = localStorage.getItem("access_token");

    if (storedEmail && storedAccessToken) {
      setIsLoggedIn(true);
      setIsLoggedInLocal(true);
      setUsernameLocal(storedEmail);
      setAccessKey(storedAccessToken); // Set access token if available
    }
  }, [setIsLoggedIn, setAccessKey]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles'));
    const storedDriveLink = localStorage.getItem('driveLink');
  
    if (storedFiles) {
      setFiles(storedFiles.map((fileName) => ({ name: fileName }))); // Restore file names
      setUploadedFiles(storedFiles.map((fileName) => ({ name: fileName }))); // Restore uploadedFiles state
    }
  
    if (storedDriveLink) {
      setDriveLinkLocal(storedDriveLink);
      setDriveLink(storedDriveLink); // Restore the drive link
    }
  }, [setUploadedFiles, setDriveLink]);
  
  // Update localStorage whenever files or drive link are changed

  const handleFileUpload = (fileList) => {
    const fileArray = Array.from(fileList);
    
    // Save the uploaded files in local state as file objects
    setFiles(fileArray);
    setUploadedFiles(fileArray);
  
    // Save the uploaded files in localStorage
    //localStorage.setItem('uploadedFiles', JSON.stringify(fileArray.map(file => file.name)));
  
  
    // Clear any drive link input if files are uploaded
    setDriveLinkLocal("");
    setDriveLink("");
  };
  
  
  // Handle Drive link input change
  const handleLinkInputChange = (event) => {
    const link = event.target.value;
    setDriveLinkLocal(link);
    setDriveLink(link);

    // Clear files when a link is entered
    setFiles([]);
    setUploadedFiles([]);
    localStorage.removeItem('uploadedFiles'); // Clear local storage if a drive link is entered
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };



const triggerPopup = (message) => {
  setPopupMessage(message);
  setShowPopup(true);
  setTimeout(() => {
    setShowPopup(false);
  }, 3000); // Display the popup for 3 seconds
};

const handleClosePopup = () => {
  setShowPopup(false);
  setPopupMessage(""); // Optionally clear the popup message if needed
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
      <div className="upload-section-title">
      
      {showPopup && (
    <div>
      <div className="overlay" onClick={handleClosePopup}></div>
      <div className="popup">
        <button className="close-btn" onClick={handleClosePopup}>×</button>
        {popupMessage}
      </div>
    </div>
  )}

        <h1 className="pricing-title">
        Revolutionize your hiring by uncovering resume truths and ensuring perfect job matches. At MayaMaya, we combine forensics with intelligent matching to reveal authentic talent.
        </h1>
      </div>

      <section className="upload-section">
        

          
        <div className="upload-text">
          <h2><span>MayaMaya</span> Lite</h2>
          <p>
          Gain clarity and efficiency in your recruitment strategy.</p>
          <p>Our AI-driven platform analyzes resumes for authenticity and matches them against job descriptions, ensuring you focus only on the best candidates.</p>
          <p>Experience a streamlined hiring process where every detail counts.
          </p>
          
        </div>

        <div className="upload-area">
          <h2>Please Upload Resumes </h2>

          {/* Drag-drop box made clickable */}
          <div
            className="drag-drop-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById('file-upload').click()} // Make box clickable
          >
            
            <p><p><FaCloudUploadAlt className="upload-icon" /></p>Drag & drop resumes here or click to browse<p className="file-types">Accepts PDF or DOCX</p></p>
            
          </div>

          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            accept=".pdf, .docx"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
          />

<h2>Or Drive Link</h2>

          <input
            type="text"
            className="drive-link-input"
            placeholder="Insert Sharable Drive Link (https://… example)"
            value={driveLink}
            onChange={handleLinkInputChange}
          />

          {/* Display uploaded files or entered Drive link */}
          <div className="file-list">
          {files.length > 0 ? (
    <ul>
      {files.map((file, index) => (
        <li key={index}>{file.name}</li> // Accessing the name property correctly
      ))}
    </ul>
  ) : (
    <p></p>
  )}
            <ProgressResultsSection
                  uploadedFiles={uploadedFiles}
                  driveLink={driveLink}
                  isLoggedIn={isLoggedIn}
                  username={username}
                  accessKey={accessKey}
                  remainingCredits={remainingCredits} // Pass remaining credits here
                  setRemainingCredits={setRemainingCredits}
                  userId={userId}
                  toggleModal={toggleModal}
                  processStatus={processStatus}
                  triggerPopup={triggerPopup}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                  setAccessKey={setAccessKey}
                />
          </div>
        </div>
      </section>
      <footer className="footer">
          <p>
            MayaMaya Lite - A MayaMaya Product
          </p>
        </footer>
    </div>
  );
}

export default UploadSection;
