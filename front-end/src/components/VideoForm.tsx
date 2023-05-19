import React, { useState } from 'react';
import axios from 'axios';
import './VideoForm.scss';

const VideoForm: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleShareVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://youtubeshare.vercel.app/api/videos', { videoUrl }, { headers: { Authorization: `Bearer ${token}` } });
      console.log(response.data.message);
    } catch (error) {
      console.error('Failed to share video:', error);
    }
  };

  return (
    <div className="video-form-container">
      <h2 className="video-form-title">Share Video</h2>
      <div className="video-form-input-container">
        <input
          className="video-form-input"
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button className="video-form-button" onClick={handleShareVideo}>Share</button>
      </div>
    </div>
  );
};

export default VideoForm;
