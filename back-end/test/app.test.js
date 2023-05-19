const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('..');
const User = require('../models/User');
const Video = require('../models/Video');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany();
    await Video.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ username: 'testuser', password: 'password' });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should not register a user with an existing username', async () => {
        const existingUser = new User({
            username: 'existinguser',
            password: await bcrypt.hash('password', 10),
        });
        await existingUser.save();

        const response = await request(app)
            .post('/api/register')
            .send({ username: 'existinguser', password: 'password' });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Username already taken');
    });

    it('should log in with valid credentials', async () => {
        const password = await bcrypt.hash('password', 10);
        const user = new User({
            username: 'testuser',
            password,
        });
        await user.save();

        const response = await request(app)
            .post('/api/login')
            .send({ username: 'testuser', password: 'password' });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('should not log in with invalid credentials', async () => {
        const password = await bcrypt.hash('password', 10);
        const user = new User({
            username: 'testuser',
            password,
        });
        await user.save();

        const response = await request(app)
            .post('/api/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Invalid username or password');
    });
});

describe('Video API', () => {
    let authToken;

    beforeAll(async () => {
        const password = await bcrypt.hash('password', 10);
        const user = new User({
            username: 'testuser',
            password,
        });
        await user.save();

        const response = await request(app)
            .post('/api/login')
            .send({ username: 'testuser', password: 'password' });

        authToken = response.body.token;
    });

    it('should share a video', async () => {
        const videoUrl = 'https://www.youtube.com/watch?v=67Y4oLNmSuM&list=RD67Y4oLNmSuM&start_radio=1&ab_channel=NguyenXuanTrongHoang';

        const response = await request(app)
            .post('/api/videos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ videoUrl });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Video shared successfully');
    });

    it('should not share a video without authentication', async () => {
        const videoUrl = 'https://www.youtube.com/watch?v=67Y4oLNmSuM&list=RD67Y4oLNmSuM&start_radio=1&ab_channel=NguyenXuanTrongHoang';

        const response = await request(app)
            .post('/api/videos')
            .send({ videoUrl });

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Authentication token not found');
    });
});
