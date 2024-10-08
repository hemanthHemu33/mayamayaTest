import React, { useState, useEffect } from 'react';
import Header from './Header'; // Adjust the path as needed
import './Pricing.css'; // Import the CSS file

function Pricing({ isModalOpen, isRegisterModalOpen, setIsRegisterModalOpen, setIsModalOpen, setIsLoggedIn, setUsername, setAccessKey, remainingCredits, subscriptionType }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // State for subscription status
  const [subscriptionDetails, setSubscriptionDetails] = useState(null); // Subscription info state
  const [isLoggedIn, setIsLoggedInState] = useState(false);

  useEffect(() => {
    // Add Stripe script dynamically
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  // Simulate checking subscription status (replace with real API call)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedInState(true);
    } else {
      setIsLoggedInState(false);
    }
    if (subscriptionType === 'paid') {
      const fetchSubscriptionDetails = async () => {
        const response = {
          subscribed: true,
          planName: '3000 Credits', // Updated plan name
          amount: 19.99,
          credits: 3000, // Updated credits
        };
        console.log('Subscription Response:', response);
        if (response.subscribed) {
          setIsSubscribed(true);
          setSubscriptionDetails(response);
        } else {
          setIsSubscribed(false);
          setSubscriptionDetails(null);
        }
      };
      fetchSubscriptionDetails();
    } else {
      setIsSubscribed(false);
      setSubscriptionDetails(null);
    }
  }, [subscriptionType]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleManageSubscription = () => {
    window.location.href = 'https://billing.stripe.com/p/login/your_customer_portal_link'; // Replace with real link
  };

  if (!isLoggedIn) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <div className="pricing-container">
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
      <div className="pricing-content">
        <div className="pricing-header">
          <div className="total-credits">
            <p>Credits: <span>{remainingCredits}</span></p>
          </div>
          <h1 className="pricing-title">
            Buy More Credits <span>Check More Resumes</span>
          </h1>
          <p className="pricing-description">
            Easily purchase credits to access premium features and unlock new opportunities. Our flexible credit
            packages are designed to fit your needs.
          </p>
        </div>

        {isSubscribed ? (
          <div className="subscription-details">
            <h2>Already <span>Subscribed</span></h2>
            <p>You are currently subscribed to the <span>{subscriptionDetails.planName}</span>.</p>
            <p>Credits in this plan: <span>{subscriptionDetails.credits}</span></p>
            <p>Monthly cost: <span>${subscriptionDetails.amount}</span></p>
            <button className="manage-subscription-btn" onClick={handleManageSubscription}>
              Manage Subscription
            </button>
          </div>
        ) : (
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="card-content">
                <h3 className="card-title">
                  <span style={{ textDecoration: 'line-through', color: '#e3e3e3', fontSize: "1.2rem" }}>2500 Credits</span><br />
                  <span style={{ marginLeft: '0px', color: '#fff' }}>3000 Credits</span>
                </h3>
                <p className="card-description">Our most popular credit package for advanced features.</p>
                <div className="card-price">$19.99</div>
                <stripe-buy-button
  buy-button-id="buy_btn_1Q2QgMEFgkQkp9XBpqcMIGCA"
  publishable-key="pk_live_51JUlKeEFgkQkp9XBlmsS9rlqGHEzVZJfUVRZKVz7fxiRIzBxSX9dcE7AL3kvN1gTSJHgWWAsKhYfL8jMpM6Ogtlf00tWqkLoPR"
>
</stripe-buy-button>
              </div>
              <div className="card-footer">
              
              </div>
            </div>
          </div>
        )}

        <div className="how-it-works">
          <h2 className="section-title-works">How It <span>Works</span></h2>
          <div className="steps">
            <div className="step">
              <h3 className="step-title">1. Select Package</h3>
              <p className="step-description">Choose the credit package that best fits your needs.</p>
            </div>
            <div className="step">
              <h3 className="step-title">2. Secure Checkout</h3>
              <p className="step-description">Proceed to a secure Stripe checkout to complete your purchase.</p>
            </div>
            <div className="step">
              <h3 className="step-title">3. Start Using</h3>
              <p className="step-description">Your credits will be instantly available to use.</p>
            </div>
          </div>
        </div>

        <div className="faq">
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <div className="accordion">
            {faqData.map((item, index) => (
              <div key={index} className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                </button>
                {activeIndex === index && (
                  <div className="accordion-content">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqData = [
  {
    question: 'What are credits?',
    answer: 'Credits are a virtual currency that can be used to access premium features and unlock new opportunities within our platform. They provide a flexible way to pay for the services you need, without committing to a long-term subscription.'
  },
  {
    question: 'How do I purchase credits?',
    answer: 'To purchase credits, simply select the package that best fits your needs and click the "Buy Now" button. You\'ll be redirected to a secure Stripe checkout where you can complete your purchase using a credit card or other supported payment method.'
  },
  {
    question: 'Do credits expire?',
    answer: 'No, your credits do not expire. They are stored in your account and can be used at any time to access premium features and services.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'We stand behind the quality of our services, but we understand that sometimes things don\'t work out as planned. If you\'re not satisfied with your purchase, please contact our support team within 14 days, and we\'ll be happy to provide a full refund.'
  }
];

export default Pricing;
