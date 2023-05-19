import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VideoForm from './components/VideoForm';
import VideoList from './components/VideoList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layout/header/Header';
import Container from 'react-bootstrap/Container';

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Container>
      {isLoggedIn ? (
        <Router>
          <div>
            <Header />
            <VideoForm />
            <VideoList />
          </div>
        </Router>
      ) : (
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<VideoList />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </div>
        </Router>
      )}
    </Container>
  );
};

export default App;