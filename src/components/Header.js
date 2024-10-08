import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import './UploadSection.css'; // Reusing the same CSS
import logo from './logo.svg';
import config from './config.json';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Registration function
async function registerUser(userData) {
  try {
    console.log("Base url : ", config.AUTH_BASE_URL)
    console.log("Complete url : ", `${config.AUTH_BASE_URL}/auth/register`)
    const response = await fetch(`${config.AUTH_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // Parse response JSON
    console.log("Data : ", data)
    // Update the success condition to check for status 200
    if (data.status === 200) {
      return { success: true, data }; // Successful registration
    } else if (data.status === 400 && data.message === "User already exist") {
      return { success: false, error: "User already exists" }; // Return user already exists error
    } else {
      throw new Error(`${data.message}`);
    }
  } catch (error) {
    console.log("Error caught", error)
    return { success: false, error: error.message }; // Return error object
  }
}

async function login(username, password) {
  try {
    const response = await fetch(`${config.AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
        product_name: "MAYAMAYA_LITE"
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("email", username);
        return data; // Login successful
      } else {
        return null;
      }
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error(`Login failed: ${response.statusText}`);
    }
  } catch (error) {
    return null;
  }
}

// New function to handle forgot password
async function handleForgotPassword(email) {
  try {
    const response = await fetch(`${config.AUTH_BASE_URL}/api/user/send-mail/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        suite_product: "RESUME-FORENSICS",
      }),
    });

    const data = await response.json();
    return data; // Return the response data
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    return null;
  }
}



function Header({ setIsRegisterModalOpen, setIsModalOpen, isModalOpen, isRegisterModalOpen, setIsLoggedIn, setUsername, setAccessKey, remainingCredits }) {
  const [isLoggedIn, setIsLoggedInLocal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [username, setUsernameLocal] = useState(""); // For login
  const [email, setEmail] = useState(""); // For registration
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedAccessToken = localStorage.getItem("access_token");

    if (storedEmail && storedAccessToken) {
      setIsLoggedIn(true);
      setIsLoggedInLocal(true);
      setUsername(storedEmail);
      setAccessKey(storedAccessToken); // Set access token if available
    }
  }, [setIsLoggedIn, setAccessKey]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoggedInLocal(false);
    setUsername(""); // Clear username on logout
    setAccessKey(""); // Clear access key on logout
    localStorage.removeItem("access_token"); // Remove access token from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("uploadedFiles"); // Remove uploaded files from localStorage
    localStorage.removeItem("driveLink");
    window.location.href = "/"; // Redirect to homepage
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Toggle password visibility
const toggleShowPassword = () => {
  setShowPassword(!showPassword);
};

const handleLogin = async () => {
  const response = await login(username, password);
  if (response) {
    // Only set logged-in state if response is valid
    setIsLoggedIn(true);
    setIsLoggedInLocal(true);
    setUsername(username);
    setAccessKey(response.access_token); // Assuming access token is used as access key
    setIsModalOpen(false);
    window.location.reload();
  } else {
    // If response is null or there's an error
    setIsLoggedIn(false);
    setIsLoggedInLocal(false);
    triggerPopup("Login failed"); // This alert can be improved based on your UX design
  }
};

const handleRegister = async () => {
  if (!firstName || !lastName || !email || !password) {
    triggerPopup("Please fill in all required fields.");
    return;
  }

  const response = await registerUser({
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    org_name: orgName,
    product_name: "MAYAMAYA_LITE",
  });


  if (response.success) {
    triggerPopup("Registration successful!");
    setIsRegisterModalOpen(false);

    // Immediately attempt login using the same credentials
    const loginResponse = await login(email, password); // Use email and password directly for login
    if (loginResponse) {
      console.log("Login successful after registration");
      setIsLoggedIn(true);
      setIsLoggedInLocal(true);
      setUsername(email); // Set the username to email
      setAccessKey(loginResponse.access_token); // Assuming access token is used as access key
      setIsModalOpen(false);      
    } else {
      triggerPopup("Login failed after registration. Please try again.");
    }
  } else {
    triggerPopup(`Registration failed: ${response.error}`);
  }
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

const handleForgotPasswordClick = async () => {
    if (!username) {
      triggerPopup("Please enter your email address.");
      return;
    }

    const response = await handleForgotPassword(username); // Use username as email
    if (response) {
      triggerPopup("Forgot password email sent! Check your inbox.");
      setUsername(""); // Clear the email input
    } else {
      triggerPopup("Failed to send forgot password email.");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfile = () => {
    navigate("/profile"); // Navigate to profile page
  };

  const handleBillings = () => {
    navigate("/pricing"); // Navigate to pricing/billings page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogo = () => {
    navigate("/");
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false); // Automatically close the menu on larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
    <div className="upload-header">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" onClick={handleLogo} />

        {/* Remaining Credits */}
      {isLoggedIn && (
        <div className="credits-info">
          Credits: <span>{remainingCredits}</span>
        </div>
      )}
        <>
          <div className="hamburger" onClick={toggleMenu}>
            <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}></span>
          </div>
          {menuOpen && (
            <nav className="mobile-menu">
              <ul>
                {!isLoggedIn ? (
                  <>
                    <li><p onClick={() => setIsModalOpen(true) } style={{cursor: "pointer"}}>Login</p></li>
                    <li><p onClick={() => setIsRegisterModalOpen(true)}style={{cursor: "pointer"}}>Register</p></li>
                  </>
                ) : (
                  <>
                    <li><a href="/profile">My Profile</a></li>
                    <li><a href="/history">My Results</a></li>
                    <li><a href="/job-description">Create Job Description</a></li>
                    <li><a href="/pricing">Billing</a></li>
                    <li><a href="/" onClick={handleLogout}>Logout</a></li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </>

      </div>
      <section >

      {showPopup && (
    <div>
      <div className="overlay" onClick={handleClosePopup}></div>
      <div className="popup">
        <button className="close-btn" onClick={handleClosePopup}>×</button>
        {popupMessage}
      </div>
    </div>
  )}
  
        {/* Login Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-left">
                <h3>Welcome!</h3>
                <p>Please login to continue.</p>
              </div>
              <div className="modal-right">
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  X
                </button>
                <h3>Login</h3>
                <input
                  type="text"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsernameLocal(e.target.value)}
                />
                
                <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={toggleShowPassword} className="eye-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
                <button className="modal-btn" onClick={handleLogin}>Login</button>
                <div>
                  <p style={{ marginTop: '15px', fontSize: '14px', color: "#555" }}>Forgot your password? <span onClick={handleForgotPasswordClick} style={{ cursor: "pointer", color: "#007bff" }}>Click here</span></p>
                </div>
                <p style={{ marginTop: '15px', fontSize: '14px', color: "#555" }}>
  Don't have an account? 
  <a
    href="#"
    onClick={() => {
      setIsModalOpen(false);
      setIsRegisterModalOpen(true);
    }}
    style={{ color: '#007bff', textDecoration: 'none' }}
    onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
     Register here
  </a>
</p>

              </div>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {isRegisterModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-left">
                <h3>Join Us!</h3>
                <p>Create your account and start your journey.</p>
              </div>
              <div className="modal-right">
                <button
                  className="close-btn"
                  onClick={() => setIsRegisterModalOpen(false)}
                >
                  X
                </button>
                <h3>Register</h3>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email} // Use email state here
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={toggleShowPassword} className="eye-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
                <button className="modal-btn" onClick={handleRegister}>Register</button>
                <p style={{ marginTop: '15px', fontSize: '14px', color: "#555" }}>
  Already have an account? 
  <a
    href="#"
    onClick={() => {
      setIsRegisterModalOpen(false);
      setIsModalOpen(true);
    }}
    style={{ color: '#007bff', textDecoration: 'none' }}
    onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
    Login here
  </a>
</p>

              </div>
            </div>
          </div>
        )}
        </section>
        </>
  );
}

export default Header;
