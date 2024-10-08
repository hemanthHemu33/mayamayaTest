import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadSection from './components/UploadSection';
import Pricing from './components/Pricing';
import Profile from './components/Profile';
import History from './components/History';
import ResetPassword from './components/PasswordReset';
import JobDescription from './components/JobDescriptionPage';
import Results from './components/Results';
import './App.css';
import config from './components/config.json'; // Assuming the config file is in components folder

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [driveLink, setDriveLink] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [subscriptionType, setSubscriptionType] = useState('');
  const [userId, setUserId] = useState('');
  const [processStatus, setProcessStatus] = useState('');
  const [totalResumes, setTotalResumes] = useState(0);
  const [totalDuplicates, setTotalDuplicates] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);


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

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={
              <UploadSection
                setUploadedFiles={setUploadedFiles}
                setDriveLink={setDriveLink}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                remainingCredits={remainingCredits}
                uploadedFiles={uploadedFiles}
                driveLink={driveLink}
                isLoggedIn={isLoggedIn}
                username={username}
                accessKey={accessKey}
                setRemainingCredits={setRemainingCredits}
                userId={userId}
                totalResumes={totalResumes} // Pass total resumes
                totalDuplicates={totalDuplicates} // Pass total duplicates
                processStatus={processStatus}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />
            } />
            <Route path="/pricing" element={
              <Pricing
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                remainingCredits={remainingCredits}
                subscriptionType={subscriptionType} // Pass subscription type to Pricing page
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />
            } />
            <Route path="/profile" element={
              <Profile
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                accessKey={accessKey}
                remainingCredits={remainingCredits}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />
            } />
            <Route path="/history" element={
              <History
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                remainingCredits={remainingCredits}
                setTotalResumes={setTotalResumes}
                setTotalDuplicates={setTotalDuplicates}
                totalResumes={totalResumes}
                totalDuplicates={totalDuplicates}
                historyData={historyData}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />
            } />
            <Route path="/results" element={
              <Results
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                remainingCredits={remainingCredits}
                setTotalResumes={setTotalResumes}
                setTotalDuplicates={setTotalDuplicates}
                totalResumes={totalResumes}
                totalDuplicates={totalDuplicates}
                historyData={historyData}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />
            } />
            <Route path="/auth/user/reset-password" element={<ResetPassword />} />
            <Route path="/job-description" element={<JobDescription
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setAccessKey={setAccessKey}
                remainingCredits={remainingCredits}
                setTotalResumes={setTotalResumes}
                setTotalDuplicates={setTotalDuplicates}
                totalResumes={totalResumes}
                totalDuplicates={totalDuplicates}
                historyData={historyData}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
              />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
