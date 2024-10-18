import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";

import Home from './pages/home/Home';
import Services from './pages/services/Services';
import Blogs from './pages/blogs/Blogs';
import About from './pages/about/About';
import Contactus from './pages/contactus/ContactUs';
import Quiz from './pages/quiz/Quiz';
import Booking from './pages/services/booking/Booking';
import BlogDetail from './pages/blogs/BlogDetail'; 
import ThankYouMessage from './pages/thankmessage/ThankMessage';
import CookiesPolicy from './pages/policies/CookiesPolicy';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import LegalNotice from './pages/policies/LegalNotice';

import Layout from './components/Layout';
import Payment from './pages/services/booking/payment/PaymentSection';
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component

const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Include the ScrollToTop component here */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/thankyoumessage" element={<ThankYouMessage />} />
          <Route path="/cookiespolicy" element={<CookiesPolicy />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/legalnotice" element={<LegalNotice />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
