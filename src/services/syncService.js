// src/services/syncService.js
const anilistService = require('./anilistService');
const { SyncLog } = require('../models');

class SyncService {
    // === SYNC TRENDING ===
    async syncTrending(limit = 20) {
        const syncLogId = await SyncLog.create({
            sync_type: 'TRENDING',
            source: 'anilist',
            status: 'RUNNING',
            total_items: limit
        });

        try {
            const trending = await anilistService.getTrending(limit);
            const anilistIds = trending.map(item => item.id);
            
            let synced = 0;
            let failed = 0;
            const results = [];

            for (const id of anilistIds) {
                try {
                    const result = await anilistService.syncAnimeToDatabase(id, false);
                    results.push(result);
                    synced++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`❌ Failed to sync anime ${id}:`, error.message);
                    failed++;
                    results.push({ id, error: error.message });
                }
            }

            await SyncLog.update(syncLogId, {
                status: 'SUCCESS',
                synced_items: synced,
                failed_items: failed,
                completed_at: new Date().toISOString()
            });

            return { synced, failed, results };
        } catch (error) {
            await SyncLog.update(syncLogId, {
                status: 'FAILED',
                error_message: error.message
            });
            throw error;
        }
    }

    // === SYNC POPULAR ===
    async syncPopular(limit = 20) {
        const syncLogId = await SyncLog.create({
            sync_type: 'POPULAR',
            source: 'anilist',
            status: 'RUNNING',
            total_items: limit
        });

        try {
            const popular = await anilistService.getPopular(limit);
            const anilistIds = popular.map(item => item.id);
            
            let synced = 0;
            let failed = 0;
            const results = [];

            for (const id of anilistIds) {
                try {
                    const result = await anilistService.syncAnimeToDatabase(id, false);
                    results.push(result);
                    synced++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`❌ Failed to sync anime ${id}:`, error.message);
                    failed++;
                    results.push({ id, error: error.message });
                }
            }

            await SyncLog.update(syncLogId, {
                status: 'SUCCESS',
                synced_items: synced,
                failed_items: failed,
                completed_at: new Date().toISOString()
            });

            return { synced, failed, results };
        } catch (error) {
            await SyncLog.update(syncLogId, {
                status: 'FAILED',
                error_message: error.message
            });
            throw error;
        }
    }

    // === SYNC SEASONAL ===
    async syncSeasonal(year, season, limit = 20) {
        const syncLogId = await SyncLog.create({
            sync_type: 'SEASONAL',
            source: 'anilist',
            status: 'RUNNING',
            total_items: limit
        });

        try {
            const seasonal = await anilistService.getSeasonal(season, year, limit);
            const anilistIds = seasonal.map(item => item.id);
            
            let synced = 0;
            let failed = 0;
            const results = [];

            for (const id of anilistIds) {
                try {
                    const result = await anilistService.syncAnimeToDatabase(id, false);
                    results.push(result);
                    synced++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`❌ Failed to sync anime ${id}:`, error.message);
                    failed++;
                    results.push({ id, error: error.message });
                }
            }

            await SyncLog.update(syncLogId, {
                status: 'SUCCESS',
                synced_items: synced,
                failed_items: failed,
                completed_at: new Date().toISOString()
            });

            return { synced, failed, results };
        } catch (error) {
            await SyncLog.update(syncLogId, {
                status: 'FAILED',
                error_message: error.message
            });
            throw error;
        }
    }

    // === SYNC ALL ===
    async syncAll(limit = 20) {
        console.log('🔄 Starting full sync...\n');
        
        const results = {
            trending: null,
            popular: null,
            seasonal: null
        };

        // Sync trending
        console.log('📌 Syncing trending...');
        results.trending = await this.syncTrending(limit);

        // Sync popular
        console.log('\n📌 Syncing popular...');
        results.popular = await this.syncPopular(limit);

        // Sync seasonal
        const year = new Date().getFullYear();
        const season = 'SUMMER';
        console.log(`\n📌 Syncing seasonal (${season} ${year})...`);
        results.seasonal = await this.syncSeasonal(year, season, limit);

        return results;
    }

    // === GET SYNC LOGS ===
    async getSyncLogs(limit = 10) {
        return await SyncLog.findAll(limit);
    }

    // === GET SYNC LOG BY ID ===
    async getSyncLog(id) {
        return await SyncLog.findById(id);
    }
}

module.exports = new SyncService();