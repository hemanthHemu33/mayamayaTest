import React, { useEffect, useState } from 'react';
import Header from './Header'; // Import the header from Header.js
import './Profile.css'; // Import the CSS file
import config from './config.json';
import { useNavigate } from 'react-router-dom';

const Profile = ({ isModalOpen, isRegisterModalOpen, setIsRegisterModalOpen, setIsModalOpen, setIsLoggedIn, setUsername, setAccessKey, accessKey, remainingCredits }) => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [creditsInfo, setCreditsInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndCredits = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error('You are not logged in. Please log in to access your profile.');
        }

        const profileResponse = await fetch(`${config.AUTH_BASE_URL}/api/user/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: storedEmail,
          }),
        });

        const profileData = await profileResponse.json();

        if (profileData.status === 200) {
          setProfileInfo(profileData.data);
        } else {
          throw new Error('Failed to fetch profile data');
        }

        const creditsResponse = await fetch(`${config.AUTH_BASE_URL}/api/user/product`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: profileData.data.user_profile.user_id,
            product_code: 'RESUME_FORENSICS',
          }),
        });

        const creditsData = await creditsResponse.json();

        if (creditsData.status === 200) {
          setCreditsInfo(creditsData.data.user_product_details);
        } else {
          throw new Error('Failed to fetch credits data');
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProfileAndCredits();
  }, []);

  return (
    <div className="profilePage-container">
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
      
      <main className="profilePage-main">
        {isLoading ? (
          <div className="loader"></div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <>
            <div className="profilePage-leftColumn">
              <section className="profilePage-infoSection">
                <h2 className="profilePage-sectionTitle">Profile Information</h2>
                <form className="profilePage-infoForm">
                  <div className="profilePage-formGroup">
                    <label htmlFor="firstName" className="profilePage-formLabel">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileInfo?.user_profile?.first_name || ''}
                      disabled
                      className="profilePage-formInput"
                    />
                  </div>
                  <div className="profilePage-formGroup">
                    <label htmlFor="lastName" className="profilePage-formLabel">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileInfo?.user_profile?.last_name || ''}
                      disabled
                      className="profilePage-formInput"
                    />
                  </div>
                  <div className="profilePage-formGroup">
                    <label htmlFor="email" className="profilePage-formLabel">Email</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={profileInfo?.user_profile?.email || ''}
                      disabled
                      className="profilePage-formInput"
                    />
                  </div>
                  <div className="profilePage-formGroup">
                    <label htmlFor="organization" className="profilePage-formLabel">Organization</label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={profileInfo?.user_profile?.org_name || ''}
                      disabled
                      className="profilePage-formInput"
                    />
                  </div>
                </form>
              </section>
            </div>
            <div className="profilePage-rightColumn">
              <section className="profilePage-creditsSection">
                <h2 className="profilePage-sectionTitle">Credits Overview</h2>
                <div className="profilePage-creditsInfo">
                  <p><strong>Total Credits: {creditsInfo?.credits_purchased || 0}</strong></p>
                  <p><strong>Credits Used: {creditsInfo?.credits_purchased - remainingCredits}</strong></p>
                  <p><strong>Credits Left: {remainingCredits || 0}</strong></p>
                  <p className="profilePage-creditsMessage">
                    You have {creditsInfo?.remaining_credits || 0} resume checks remaining.
                  </p>
                </div>
              </section>
              <section className="profilePage-paymentSection">
                <h2 className="profilePage-sectionTitle">Subscription</h2>
                <p className="profilePage-paymentDescription">
                  Here you can view subscription plans, manage your payment methods, view subscription details, and update your billing information.
                </p>
                <button className="profilePage-managePaymentsButton" onClick={() => navigate('/pricing')}>Explore Plans</button>
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>MayaMaya Lite - A MayaMaya Product</p>
      </footer>
    </div>
  );
};

export default Profile;
