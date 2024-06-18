"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatsOpenSearchQuery = void 0;
const createStatsOpenSearchQuery = ({ searchStringEmbedding, }) => {
    return {
        size: 0,
        query: {
            script_score: {
                query: {
                    match_all: {},
                },
                script: {
                    lang: 'knn',
                    source: 'knn_score',
                    params: {
                        field: 'embedding',
                        query_value: searchStringEmbedding,
                        space_type: 'cosinesimil',
                    },
                },
            },
        },
        aggs: {
            score_stats: {
                extended_stats: {
                    script: {
                        lang: 'painless',
                        source: '_score',
                    },
                },
            },
        },
    };
};
exports.createStatsOpenSearchQuery = createStatsOpenSearchQuery;
