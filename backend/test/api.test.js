const request = require('supertest');
require('dotenv').config();

// const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

// describe('open API tests', () => {
//     it('should created a new user without an image',async () => {
//         const uniqueUsername=`testuser${Date.now()}`;
//         const uniqueEmail=`testuser${Date.now()}@gmail.com`;

//         const res=await request(BASE_URL)
//             .post('/api/user/register')
//             .field('username', uniqueUsername)
//             .field('email', uniqueEmail)
//             .field('password', 'testpassword');

// })