// src/graphql/fragments.js

/**
 * Fragment: Media Title
 */
const MEDIA_TITLE = `
    fragment MediaTitle on MediaTitle {
        romaji
        english
        native
        userPreferred
    }
`;

/**
 * Fragment: Cover Image
 */
const COVER_IMAGE = `
    fragment CoverImage on MediaCoverImage {
        extraLarge
        large
        medium
        small
        color
    }
`;

/**
 * Fragment: Media Date
 */
const MEDIA_DATE = `
    fragment MediaDate on FuzzyDate {
        year
        month
        day
    }
`;

/**
 * Fragment: Trailer
 */
const TRAILER = `
    fragment Trailer on MediaTrailer {
        id
        site
        thumbnail
        youtubeId
    }
`;

/**
 * Fragment: Studio
 */
const STUDIO = `
    fragment Studio on Studio {
        id
        name
        siteUrl
        isAnimationStudio
    }
`;

/**
 * Fragment: Character
 */
const CHARACTER = `
    fragment Character on Character {
        id
        name {
            full
            native
            alternative
        }
        image {
            large
            medium
        }
        description
    }
`;

/**
 * Fragment: Staff
 */
const STAFF = `
    fragment Staff on Staff {
        id
        name {
            full
            native
        }
        image {
            large
            medium
        }
        description
    }
`;

/**
 * Fragment: Recommendation
 */
const RECOMMENDATION = `
    fragment Recommendation on Recommendation {
        id
        rating
        mediaRecommendation {
            id
            title {
                romaji
                english
            }
            coverImage {
                large
            }
            averageScore
        }
    }
`;

/**
 * Fragment: Relation
 */
const RELATION = `
    fragment Relation on MediaRelation {
        relationType
        node {
            id
            title {
                romaji
                english
            }
            coverImage {
                large
            }
            format
            status
        }
    }
`;

/**
 * Fragment: Streaming Episode
 */
const STREAMING_EPISODE = `
    fragment StreamingEpisode on StreamingEpisode {
        title
        thumbnail
        url
        site
    }
`;

/**
 * Fragment: External Link
 */
const EXTERNAL_LINK = `
    fragment ExternalLink on ExternalLink {
        url
        site
        type
    }
`;

/**
 * Fragment: Media - Full Detail
 */
const MEDIA_FULL = `
    fragment MediaFull on Media {
        id
        title {
            ...MediaTitle
        }
        coverImage {
            ...CoverImage
        }
        bannerImage
        description
        episodes
        status
        averageScore
        meanScore
        popularity
        favourites
        trending
        genres
        studios {
            nodes {
                ...Studio
            }
        }
        startDate {
            ...MediaDate
        }
        endDate {
            ...MediaDate
        }
        format
        source
        duration
        season
        seasonYear
        siteUrl
        trailer {
            ...Trailer
        }
        rankings {
            rank
            type
            context
        }
        nextAiringEpisode {
            episode
            airingAt
        }
        characters(sort: ROLE) {
            edges {
                node {
                    ...Character
                }
                role
                voiceActors {
                    ...Staff
                }
            }
        }
        staff {
            edges {
                node {
                    ...Staff
                }
                role
            }
        }
        recommendations(sort: RATING_DESC, perPage: 5) {
            nodes {
                ...Recommendation
            }
        }
        relations {
            edges {
                ...Relation
            }
        }
        streamingEpisodes {
            ...StreamingEpisode
        }
        externalLinks {
            ...ExternalLink
        }
    }
    ${MEDIA_TITLE}
    ${COVER_IMAGE}
    ${MEDIA_DATE}
    ${TRAILER}
    ${STUDIO}
    ${CHARACTER}
    ${STAFF}
    ${RECOMMENDATION}
    ${RELATION}
    ${STREAMING_EPISODE}
    ${EXTERNAL_LINK}
`;

/**
 * Fragment: Media - List
 */
const MEDIA_LIST = `
    fragment MediaList on Media {
        id
        title {
            ...MediaTitle
        }
        coverImage {
            large
            color
        }
        bannerImage
        episodes
        status
        averageScore
        popularity
        genres
        studios {
            nodes {
                name
            }
        }
        season
        seasonYear
        format
        nextAiringEpisode {
            episode
            airingAt
        }
    }
    ${MEDIA_TITLE}
`;

/**
 * Fragment: Media - Search
 */
const MEDIA_SEARCH = `
    fragment MediaSearch on Media {
        id
        title {
            ...MediaTitle
        }
        coverImage {
            large
            medium
            color
        }
        bannerImage
        description
        episodes
        status
        averageScore
        popularity
        favourites
        genres
        studios {
            nodes {
                name
                siteUrl
            }
        }
        startDate {
            ...MediaDate
        }
        endDate {
            ...MediaDate
        }
        format
        season
        seasonYear
        siteUrl
        trailer {
            ...Trailer
        }
        nextAiringEpisode {
            episode
            airingAt
        }
    }
    ${MEDIA_TITLE}
    ${COVER_IMAGE}
    ${MEDIA_DATE}
    ${TRAILER}
`;

module.exports = {
    MEDIA_TITLE,
    COVER_IMAGE,
    MEDIA_DATE,
    TRAILER,
    STUDIO,
    CHARACTER,
    STAFF,
    RECOMMENDATION,
    RELATION,
    STREAMING_EPISODE,
    EXTERNAL_LINK,
    MEDIA_FULL,
    MEDIA_LIST,
    MEDIA_SEARCH
};