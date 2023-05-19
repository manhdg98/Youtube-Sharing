const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Video = require('./models/Video');
const axios = require('axios');
const http = require("http");
const Ably = require('ably');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const channel = ably.channels.get('channel-name');
const io = require('socket.io')(server, {
    cors: {
        origin: "https://shareyoutube.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    secure: true,
});
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    jwt.verify(token, 'secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid authentication token' });
        }
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, userName: user.username }, 'secret-key', { expiresIn: '1h' });

        return res.json({ token });
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

app.post('/api/videos', authenticateToken, async (req, res) => {
    const { videoUrl } = req.body;

    const getVideoIdFromUrl = (url) => {
        let videoId = '';

        if (url.includes('youtube.com')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        } else if (url.includes('youtu.be')) {
            const urlParts = url.split('/');
            videoId = urlParts[urlParts.length - 1];
        }

        return videoId;
    };

    const videoId = getVideoIdFromUrl(videoUrl);
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret-key');

        const username = decodedToken.userName;

        const videoData = response.data.items[0];
        const videoTitle = videoData.snippet.title;
        const videoDescription = videoData.snippet.description;

        const { id } = response.data.items[0];
        const embedCode = `https://www.youtube.com/embed/${id}`;

        const video = new Video({
            url: embedCode,
            title: videoTitle,
            description: videoDescription,
            username
        });
        await video.save();

        channel.publish('newVideo', { videoTitle, username, videoDescription, videoUrl: embedCode });

        return res.status(201).json({ message: 'Video shared successfully' });
    } catch (error) {
        console.error('Error fetching video details:', error);
        return res.status(500).json({ error: 'Failed to fetch video details' });
    }
});

// Socket.io event listener for new connections
channel.subscribe('new-connection', (message) => {
    console.log('New client connected');
});

// Socket.io event listener for disconnect
channel.subscribe('disconnect', (message) => {
    console.log('Client disconnected');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server
