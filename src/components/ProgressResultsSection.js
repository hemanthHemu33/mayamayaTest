import React, { useState, useEffect } from "react";
import './ProgressResultsSection.css';
import config from './config.json';
import { Link, useNavigate } from "react-router-dom";
import OptionsPopup from './OptionsPopup';

function ProgressResultsSection({ triggerPopup, processStatus, setIsLoggedIn, setUsername, setAccessKey, uploadedFiles, totalResumes, totalDuplicates, toggleModal, driveLink, isLoggedIn, username, accessKey, remainingCredits, setRemainingCredits, userId }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [progress, setProgress] = useState(0); // Progress in percentage
  const [count, setCount] = useState(0); // Count of resumes being processed
  const navigate = useNavigate();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const [showPopup, setShowPopup] = useState(false); // State to manage showing OptionsPopup
  const [jobDescriptions, setJobDescriptions] = useState([ // Sample job descriptions
    { id: 1, title: 'Software Engineer' },
    { id: 2, title: 'Data Scientist' }
  ]);

  // Function to check user's credit status using API
  const checkCreditStatus = async (totalApiHits) => {
    try {
      const response = await fetch(`${config.AUTH_BASE_URL}/api/credit/check-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_name: "RESUME_FORENSICS",
          total_api_hits: totalApiHits,
        }),
      });

      const creditData = await response.json();
      if (creditData.msg && creditData.msg.includes("Bad Authorization header") && !hasLoggedOut) {
        handleLogout(); // Logout if the message indicates a bad authorization header
        setHasLoggedOut(true);
      }
      if (response.ok && creditData.status === 200) {
        setRemainingCredits(creditData.data.credits);
        return creditData.data.credits;
      } else {
        triggerPopup(creditData.message || "Error checking credit status");
        return false;
      }
    } catch (error) {
      console.error("Error checking credit status:", error);
      return false;
    }
  };

  // Function to handle Get Results button click
  const handleGetResultsClick = async () => {
    if (!isLoggedIn) {
      toggleModal(); // Open the login modal if not logged in
      return;
    }

    if (uploadedFiles.length < 2 && !driveLink) {
      triggerPopup("Please upload at least 2 files to proceed.");
      return;
    }

    const totalApiHits = uploadedFiles.length;

    if (remainingCredits < totalApiHits) {
      triggerPopup("You do not have enough credits to perform this action.");
      return;
    }

    setIsAnalyzing(true);
    setCount(uploadedFiles.length);

    // Start the progress bar for 90 seconds
    const totalDuration = 90 * 1000; // 90 seconds in milliseconds
    const intervalDuration = 1000; // Update every second
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += intervalDuration;
      const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(progressPercentage);

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        setShowResults(true);
        setResultMessage("Processing Resumes. You will receive an email shortly after completion.");
      }
    }, intervalDuration);

    // Perform API call for analysis
    try {
      const formData = new FormData();
      const storedEmail = localStorage.getItem("email");
      formData.append('email', storedEmail);
      formData.append('web_app', true);
      formData.append('user_id', userId);
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('files', file);
        });
      } else if (driveLink) {
        formData.append('link', driveLink);
      }

      const response = await fetch(`${config.DATASCIENCE_API_SUITE}/resume/forensics/bulk-duplicate-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const hasCredits = await checkCreditStatus(totalApiHits);
        const result = await response.json();
        setResultMessage(result.message);
      } else {
        throw new Error("Failed to analyze resumes");
      }
    } catch (error) {
      console.error("Error analyzing resumes:", error);
      triggerPopup(resultMessage);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }

    // Cleanup on unmount
    return () => clearInterval(progressInterval);
  };

  // Function to handle analyze again button click
  function handleAnalyzeAgainClick() {
    window.scrollTo(0, 0);
    navigate("/history");
  }

  // Function to handle opening the options modal
  function handleOptionsClick() {
    setShowPopup(true); // Show the popup when Analyze is clicked
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(""); // Clear username on logout
    setAccessKey(""); // Clear access key on logout
    localStorage.removeItem("access_token"); // Remove access token from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("uploadedFiles"); // Remove uploaded files from localStorage
    localStorage.removeItem("driveLink");
    window.location.href = "/"; // Redirect to homepage
  };

  const handlePopupSubmit = (data) => {
    console.log("Selected options from popup:", data);
    // Logic for handling the data returned from OptionsPopup
    setShowPopup(false); // Close popup after submission
  };

  return (
    <div>
      <section className="progress-results-section">
        {!showResults && !isAnalyzing && (
          <>
            <button
              className='get-results-button'
              onClick={handleOptionsClick}
            >
              Analyze
            </button>
          </>
        )}

        {/* Conditionally render the OptionsPopup */}
        {showPopup && (
          <OptionsPopup
            isOpen={showPopup} // Ensure modal is open
            onClose={() => setShowPopup(false)} // Close modal when needed
            jobDescriptions={jobDescriptions} // Pass job descriptions
            onSubmit={handlePopupSubmit} // Handle submission of options
          />
        )}

        {/* Existing result handling and analysis progress sections */}
      </section>
    </div>
  );
}

export default ProgressResultsSection;