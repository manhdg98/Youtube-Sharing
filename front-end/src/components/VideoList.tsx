import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VideoList.scss';
const Ably = require('ably');
const ably = new Ably.Realtime('LFYR6A.mEJdNQ:ziNeyOot2LDYZ1wmAoQFXnMikO5I7f538tg-viiJqcw');
const channel = ably.channels.get('channel-name');


const VideoList = () => {
  const [videos, setVideos] = useState<{
    title: string;
    username: string;
    description: string;
    videoUrl: string;
  }[]>([]);

  const showToast = (
    message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | ((props: ToastContentProps<unknown>) => React.ReactNode) | null | undefined
  ) => {
    toast(message);
  };

  useEffect(() => {
    channel.subscribe('newVideo', (message: { data: any; }) => {
        const { data } = message;
        const { videoTitle, username, videoDescription, videoUrl } = data;
  
        showToast(`New video shared: ${videoTitle} by ${username}`);
  
        setVideos((prevVideos) => [
          ...prevVideos,
          { title: videoTitle, username, description: videoDescription, videoUrl },
        ]);
      });
  
      return () => {
        channel.unsubscribe('newVideo');
        ably.close();
      };
  }, []);

  return (
    <div className="video-list">
      <h2>Video List</h2>
      {videos.map((video, index) => (
        <div key={index} className="video-item">
          <div className="video-container">
            <iframe
              width="500"
              height="300"
              src={video.videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-details">
            <h3>{video.title}</h3>
            <p>Shared by: {video.username}</p>
            <p>Description: {video.description}</p>
          </div>
          <hr></hr>
        </div>
      )).reverse()}
      <ToastContainer />
    </div>
  );
};

export default VideoList;
