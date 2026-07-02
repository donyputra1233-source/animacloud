-- ============================================
-- DATABASE: animacloud_db
-- Untuk XAMPP (MySQL/MariaDB)
-- Sumber Data: AniList
-- ============================================

CREATE DATABASE IF NOT EXISTS animacloud_db;
USE animacloud_db;

-- ============================================
-- TABLE: anime
-- Menyimpan data anime dari AniList
-- ============================================
CREATE TABLE IF NOT EXISTS anime (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anilist_id INT UNIQUE NOT NULL,              -- ID dari AniList
    title_romaji VARCHAR(255),
    title_english VARCHAR(255),
    title_native VARCHAR(255),
    title_user_preferred VARCHAR(255),           -- Preferred title user
    
    synopsis TEXT,
    description TEXT,                            -- HTML description
    
    cover_image_large VARCHAR(500),
    cover_image_medium VARCHAR(500),
    cover_image_color VARCHAR(10),
    banner_image VARCHAR(500),
    
    format ENUM('TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT') DEFAULT 'TV',
    status ENUM('FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS') DEFAULT 'NOT_YET_RELEASED',
    episodes INT DEFAULT 0,
    duration INT DEFAULT 0,                       -- Episode duration in minutes
    
    season ENUM('WINTER', 'SPRING', 'SUMMER', 'FALL') NULL,
    season_year INT NULL,
    
    average_score INT DEFAULT 0,                  -- 0-100
    mean_score INT DEFAULT 0,                     -- 0-100
    popularity INT DEFAULT 0,
    favourites INT DEFAULT 0,
    trending INT DEFAULT 0,
    
    source VARCHAR(50) DEFAULT 'ANIME',
    is_adult BOOLEAN DEFAULT FALSE,
    
    site_url VARCHAR(500),
    trailer_id VARCHAR(50),
    trailer_site VARCHAR(50),
    
    next_airing_episode INT NULL,
    next_airing_at DATETIME NULL,
    
    start_date DATE NULL,
    end_date DATE NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_anilist_id (anilist_id),
    INDEX idx_title_romaji (title_romaji),
    INDEX idx_title_english (title_english),
    INDEX idx_format (format),
    INDEX idx_status (status),
    INDEX idx_season_year (season_year),
    INDEX idx_average_score (average_score),
    INDEX idx_popularity (popularity),
    FULLTEXT INDEX idx_search (title_romaji, title_english, synopsis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: anime_titles (alternative titles)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_titles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    title_type ENUM('SYNONYM', 'OFFICIAL', 'ABBREVIATION') DEFAULT 'SYNONYM',
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    INDEX idx_anime_id (anime_id),
    INDEX idx_title (title),
    INDEX idx_language (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: genres
-- ============================================
CREATE TABLE IF NOT EXISTS genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    anime_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: anime_genres (relasi many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_genres (
    anime_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (anime_id, genre_id),
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: studios
-- ============================================
CREATE TABLE IF NOT EXISTS studios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anilist_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    site_url VARCHAR(500),
    is_animation_studio BOOLEAN DEFAULT TRUE,
    anime_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_anilist_id (anilist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: anime_studios (relasi many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_studios (
    anime_id INT NOT NULL,
    studio_id INT NOT NULL,
    PRIMARY KEY (anime_id, studio_id),
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: characters
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anilist_id INT UNIQUE,
    name_full VARCHAR(255) NOT NULL,
    name_native VARCHAR(255),
    name_alternative VARCHAR(255),
    image_large VARCHAR(500),
    image_medium VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name_full),
    INDEX idx_anilist_id (anilist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: anime_characters (relasi many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    character_id INT NOT NULL,
    role ENUM('MAIN', 'SUPPORTING', 'BACKGROUND') DEFAULT 'SUPPORTING',
    voice_actor_id INT NULL,
    voice_actor_name VARCHAR(255),
    voice_actor_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_anime_id (anime_id),
    INDEX idx_character_id (character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: staff
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anilist_id INT UNIQUE,
    name_full VARCHAR(255) NOT NULL,
    name_native VARCHAR(255),
    image_large VARCHAR(500),
    image_medium VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name_full),
    INDEX idx_anilist_id (anilist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: anime_staff (relasi many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    staff_id INT NOT NULL,
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    INDEX idx_anime_id (anime_id),
    INDEX idx_staff_id (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: episodes
-- ============================================
CREATE TABLE IF NOT EXISTS episodes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255),
    title_romaji VARCHAR(255),
    thumbnail VARCHAR(500),
    site_url VARCHAR(500),
    duration INT DEFAULT 0,                      -- In seconds
    airing_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    UNIQUE KEY unique_anime_episode (anime_id, episode_number),
    INDEX idx_anime_id (anime_id),
    INDEX idx_episode_number (episode_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: streaming_links
-- ============================================
CREATE TABLE IF NOT EXISTS streaming_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    site VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('STREAMING', 'DOWNLOAD', 'TRAILER') DEFAULT 'STREAMING',
    language VARCHAR(10) DEFAULT 'en',
    is_official BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    INDEX idx_anime_id (anime_id),
    INDEX idx_site (site)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: external_links
-- ============================================
CREATE TABLE IF NOT EXISTS external_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    site VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    INDEX idx_anime_id (anime_id),
    INDEX idx_site (site)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anime_id INT NOT NULL,
    recommended_anime_id INT NOT NULL,
    rating INT DEFAULT 0,                        -- 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_anime_id) REFERENCES anime(id) ON DELETE CASCADE,
    UNIQUE KEY unique_recommendation (anime_id, recommended_anime_id),
    INDEX idx_anime_id (anime_id),
    INDEX idx_recommended (recommended_anime_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: sync_logs
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sync_type ENUM('FULL', 'TRENDING', 'POPULAR', 'SEASONAL', 'SINGLE') DEFAULT 'FULL',
    source VARCHAR(50) DEFAULT 'anilist',
    status ENUM('RUNNING', 'SUCCESS', 'FAILED') DEFAULT 'RUNNING',
    total_items INT DEFAULT 0,
    synced_items INT DEFAULT 0,
    failed_items INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_sync_type (sync_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEW: v_anime_full
-- ============================================
CREATE OR REPLACE VIEW v_anime_full AS
SELECT 
    a.*,
    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genre_names,
    GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS studio_names,
    (SELECT COUNT(*) FROM episodes e WHERE e.anime_id = a.id) AS episode_count,
    (SELECT MAX(e.episode_number) FROM episodes e WHERE e.anime_id = a.id) AS latest_episode,
    (SELECT COUNT(*) FROM anime_characters ac WHERE ac.anime_id = a.id) AS character_count
FROM anime a
LEFT JOIN anime_genres ag ON a.id = ag.anime_id
LEFT JOIN genres g ON ag.genre_id = g.id
LEFT JOIN anime_studios ast ON a.id = ast.anime_id
LEFT JOIN studios s ON ast.studio_id = s.id
GROUP BY a.id;

-- ============================================
-- VIEW: v_anime_trending
-- ============================================
CREATE OR REPLACE VIEW v_anime_trending AS
SELECT 
    a.*,
    g.name AS genre,
    s.name AS studio,
    a.trending AS score
FROM anime a
LEFT JOIN anime_genres ag ON a.id = ag.anime_id
LEFT JOIN genres g ON ag.genre_id = g.id
LEFT JOIN anime_studios ast ON a.id = ast.anime_id
LEFT JOIN studios s ON ast.studio_id = s.id
WHERE a.trending > 0
ORDER BY a.trending DESC;

-- ============================================
-- SEED DATA: Genres Awal (dari AniList)
-- ============================================
INSERT IGNORE INTO genres (name, slug) VALUES
('Action', 'action'),
('Adventure', 'adventure'),
('Comedy', 'comedy'),
('Drama', 'drama'),
('Fantasy', 'fantasy'),
('Horror', 'horror'),
('Mystery', 'mystery'),
('Romance', 'romance'),
('Sci-Fi', 'sci-fi'),
('Slice of Life', 'slice-of-life'),
('Sports', 'sports'),
('Supernatural', 'supernatural'),
('Thriller', 'thriller'),
('Martial Arts', 'martial-arts'),
('Shounen', 'shounen'),
('Seinen', 'seinen'),
('Shojo', 'shojo'),
('Josei', 'josei'),
('Mecha', 'mecha'),
('Music', 'music'),
('Parody', 'parody'),
('Samurai', 'samurai'),
('School', 'school'),
('Ecchi', 'ecchi'),
('Harem', 'harem'),
('Demons', 'demons'),
('Game', 'game'),
('Historical', 'historical'),
('Magic', 'magic'),
('Military', 'military'),
('Psychological', 'psychological'),
('Isekai', 'isekai'),
('Reincarnation', 'reincarnation'),
('Vampire', 'vampire'),
('Zombie', 'zombie'),
('Cyberpunk', 'cyberpunk'),
('Steampunk', 'steampunk'),
('Detective', 'detective'),
('Gore', 'gore'),
('Medical', 'medical');

-- ============================================
-- NOTES:
-- 1. Jalankan di phpMyAdmin atau via command line
-- 2. Pastikan XAMPP MySQL sudah running
-- 3. Untuk import: mysql -u root -p < database/migration.sql
-- 4. Data AniList akan disync melalui API
-- ============================================