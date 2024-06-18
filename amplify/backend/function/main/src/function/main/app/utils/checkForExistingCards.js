"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForExistingCards = void 0;
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const dbClient_1 = __importDefault(require("./dbClient"));
const getTableName_1 = __importDefault(require("./getTableName"));
/**
 * Retrieves existing attractions matching the provided googlePlaceId
 */
const checkForExistingCards = ({ googlePlaceId, userId, destinationDates, }) => __awaiter(void 0, void 0, void 0, function* () {
    const googlePlaceTableName = (0, getTableName_1.default)(process.env.API_TRAVA_GOOGLEPLACETABLE_NAME);
    // First, validate that the Google Place ID exists in the Google Places table
    const { Item: googlePlace } = yield dbClient_1.default
        .get({
        TableName: googlePlaceTableName,
        Key: {
            id: googlePlaceId,
        },
    })
        .promise();
    if (!googlePlace) {
        console.log('checkForExistingCards: googlePlace does not exist in DB');
        return {
            existingGooglePlace: null,
            existingAttractions: null,
        };
    }
    console.log('checkForExistingCards: googlePlace exists in DB');
    const filteredDestinationDates = destinationDates === null || destinationDates === void 0 ? void 0 : destinationDates.filter(Boolean);
    const validatedDestinationDates = (filteredDestinationDates === null || filteredDestinationDates === void 0 ? void 0 : filteredDestinationDates.length) === 2 ? filteredDestinationDates : undefined;
    // Then, query the OpenSearch index with the Google Place ID to get the attraction
    const openSearchQuery = createOpenSearchQuery(googlePlaceId, userId, validatedDestinationDates);
    const openSearchResponse = yield ApiClient_1.default.get().useIamAuth().openSearchFetch('attraction', openSearchQuery);
    // @ts-ignore
    const matchedAttractions = openSearchResponse.hits.hits;
    const existingAttractions = 
    // @ts-ignore
    matchedAttractions.map((hit) => {
        const { _source, sort } = hit;
        return {
            __typename: 'AttractionExistsItem',
            id: _source.id,
            name: _source.name,
            locations: _source.locations,
            duration: _source.duration,
            destinationName: _source.destination.name,
            attractionCategories: _source.attractionCategories,
            attractionCuisine: _source.attractionCuisine,
            bucketListCount: _source.bucketListCount,
            isTravaCreated: _source.isTravaCreated,
            images: _source.images,
            author: _source.author,
            type: _source.type,
            deletedAt: _source.deletedAt,
            outOfSeason: (sort === null || sort === void 0 ? void 0 : sort[0]) === 0,
            recommendationBadges: _source.recommendationBadges,
        };
    });
    return {
        existingGooglePlace: googlePlace,
        existingAttractions,
    };
});
exports.checkForExistingCards = checkForExistingCards;
const createOpenSearchQuery = (googlePlaceId, userId, destinationDates) => {
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    const filterConditions = [
        {
            // either should be public or should be created by me
            bool: {
                should: [
                    {
                        term: {
                            privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
                        },
                    },
                    {
                        term: {
                            'author.id': userId,
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
        {
            term: {
                googlePlaceIds: googlePlaceId,
            },
        },
    ];
    const sort = destinationDates
        ? [
            {
                // inSeason
                _script: {
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
                        params: {
                            destination_start_date: destinationDates[0],
                            destination_end_date: destinationDates[1],
                        },
                    },
                    order: 'desc',
                },
            },
        ]
        : {};
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
    return {
        _source: {
            includes: [
                'id',
                'name',
                'locations',
                'duration',
                'destination',
                'seasons',
                'attractionCategories',
                'attractionCuisine',
                'bucketListCount',
                'isTravaCreated',
                'images',
                'author',
                'type',
                'recommendationBadges',
                'deletedAt',
            ],
        },
        size: 500,
        query,
        sort,
    };
};
