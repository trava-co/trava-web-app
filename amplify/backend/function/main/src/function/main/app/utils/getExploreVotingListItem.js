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
exports.getExploreVotingListItem = void 0;
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const filter_cards_by_seasons_1 = __importDefault(require("./filter-cards-by-seasons"));
function getExploreVotingListItem({ attractionId, destinationDates, inMyBucketList, swipes, }) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetAttractionDetailsForSearchAttraction,
            variables: {
                id: attractionId,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        const attraction = (_b = res.data) === null || _b === void 0 ? void 0 : _b.getAttraction;
        if (!attraction) {
            throw new Error('Attraction not found');
        }
        const validLocations = (_c = attraction.locations) === null || _c === void 0 ? void 0 : _c.filter((location) => !!location);
        if (!(validLocations === null || validLocations === void 0 ? void 0 : validLocations.length)) {
            throw new Error('Attraction has no locations');
        }
        let inSeason = true;
        if (destinationDates === null || destinationDates === void 0 ? void 0 : destinationDates.length) {
            const seasons = (_d = attraction.seasons) === null || _d === void 0 ? void 0 : _d.filter((season) => !!season);
            inSeason = (0, filter_cards_by_seasons_1.default)({
                seasons,
                destinationStartDate: destinationDates[0],
                destinationEndDate: destinationDates[1],
            });
        }
        const exploreVotingListItem = {
            __typename: 'ExploreVotingListItem',
            attractionCategories: attraction.attractionCategories,
            attractionCuisine: attraction.attractionCuisine,
            cost: attraction.cost,
            descriptionShort: attraction.descriptionShort,
            id: attraction.id,
            image: (_e = attraction.images) === null || _e === void 0 ? void 0 : _e[0],
            inMyBucketList,
            inSeason,
            name: attraction.name,
            rating: (_g = (_f = attraction.locations) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.startLoc.googlePlace.data.rating,
            recommendationBadges: attraction.recommendationBadges,
            swipes,
            type: attraction.type,
        };
        return exploreVotingListItem;
    });
}
exports.getExploreVotingListItem = getExploreVotingListItem;
