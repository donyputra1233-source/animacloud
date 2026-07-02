// tests/anilist.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('AniList API Integration Tests', () => {
    // Setup - clear database before tests
    beforeAll(async () => {
        await db.query('DELETE FROM sync_logs WHERE source = "anilist"');
    });

    // Cleanup after tests
    afterAll(async () => {
        await db.end();
    });

    describe('GET /api/v1/anilist/search', () => {
        it('should return anime results for "naruto"', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/search')
                .query({ q: 'naruto', limit: 5 });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return 400 if search query is missing', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/search')
                .query({ limit: 5 });
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('wajib diisi');
        });
    });

    describe('GET /api/v1/anilist/anime/:id', () => {
        it('should return anime detail for ID 20 (Naruto)', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/anime/20');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('id', 20);
            expect(response.body.data).toHaveProperty('title');
        });

        it('should return 404 for non-existent anime ID', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/anime/999999999');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('GET /api/v1/anilist/trending', () => {
        it('should return trending anime', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/trending')
                .query({ limit: 10 });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/anilist/popular', () => {
        it('should return popular anime', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/popular')
                .query({ limit: 10 });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/anilist/seasonal', () => {
        it('should return seasonal anime', async () => {
            const currentYear = new Date().getFullYear();
            const response = await request(app)
                .get('/api/v1/anilist/seasonal')
                .query({ year: currentYear, season: 'SUMMER', limit: 5 });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return 400 if year or season is missing', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/seasonal')
                .query({ limit: 5 });
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('POST /api/v1/anilist/sync/:id', () => {
        it('should sync anime to database', async () => {
            const response = await request(app)
                .post('/api/v1/anilist/sync/20');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('animeId');
            expect(response.body.data).toHaveProperty('detail');
        });
    });

    describe('GET /api/v1/anilist/db/:id', () => {
        it('should get anime from database', async () => {
            const response = await request(app)
                .get('/api/v1/anilist/db/20');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('anilist_id', 20);
        });
    });

    describe('GET /api/v1/anime', () => {
        it('should list anime from database', async () => {
            const response = await request(app)
                .get('/api/v1/anime')
                .query({ page: 1, limit: 10 });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('pagination');
        });
    });

    describe('GET /api/v1/genres', () => {
        it('should list all genres', async () => {
            const response = await request(app)
                .get('/api/v1/genres');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});