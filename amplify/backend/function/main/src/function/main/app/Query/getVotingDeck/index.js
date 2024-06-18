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
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const dayjs_1 = __importDefault(require("dayjs"));
const dateFormat_1 = require("../../utils/enums/dateFormat");
const filter_cards_by_seasons_1 = __importDefault(require("../../utils/filter-cards-by-seasons"));
const getVotingDeck = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    console.log('getVotingDeck');
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('User is not authorized');
    }
    ApiClient_1.default.get().useIamAuth();
    const { tripId, destinationId, attractionType } = event.arguments.input;
    const userId = event.identity.sub;
    const result = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetVotingDeckData,
        variables: {
            tripId,
            userId,
            destinationId,
            // 1000 swipes & 1000 tda's should be enough for any trip
            attractionSwipesLimit: 1000,
            tripDestinationAttractionsLimit: 1000,
        },
    });
    const { attractionSwipesByUser, tripDestinations } = ((_e = (_d = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.getUser) === null || _b === void 0 ? void 0 : _b.userTrips) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.trip) || {};
    if (!tripDestinations) {
        throw new Error('Trip destinations not found');
    }
    const tripDestination = (_f = tripDestinations.items) === null || _f === void 0 ? void 0 : _f[0];
    if (!tripDestination) {
        throw new Error('selected tripDestination not found');
    }
    const { destination } = tripDestination || {};
    if (!destination) {
        throw new Error('selected destination not found');
    }
    const destinationCoords = destination.coords;
    const startDateDestination = tripDestination.startDate;
    const endDateDestination = tripDestination.endDate;
    const destinationDates = startDateDestination && endDateDestination ? formatDates(startDateDestination, endDateDestination) : null;
    const swipedAttractionIds = (_g = ((attractionSwipesByUser === null || attractionSwipesByUser === void 0 ? void 0 : attractionSwipesByUser.items)
        ? attractionSwipesByUser.items.map((item) => item === null || item === void 0 ? void 0 : item.attractionId)
        : [])) === null || _g === void 0 ? void 0 : _g.filter((item) => item);
    const tripDestinationAttractions = ((_j = (_h = tripDestination === null || tripDestination === void 0 ? void 0 : tripDestination.tripDestinationAttractions) === null || _h === void 0 ? void 0 : _h.items) !== null && _j !== void 0 ? _j : [])
        .filter((item) => item)
        .filter((item) => { var _a; return !((_a = item === null || item === void 0 ? void 0 : item.attraction) === null || _a === void 0 ? void 0 : _a.deletedAt); });
    const attractionsToSwipe = filterAndSortAttractions(tripDestinationAttractions, swipedAttractionIds, attractionType, destinationDates, destinationId);
    const swipedAttractionsOfSelectedType = tripDestinationAttractions.filter((tripDestinationAttraction) => {
        var _a;
        return ((_a = tripDestinationAttraction.attraction) === null || _a === void 0 ? void 0 : _a.type) === attractionType &&
            swipedAttractionIds.includes(tripDestinationAttraction.attractionId);
    });
    // attractionsExist should be true if attractionsByType.length > 0 or if swipedAttractionIds
    const attractionsExist = attractionsToSwipe.length > 0 || swipedAttractionsOfSelectedType.length > 0;
    return {
        __typename: 'GetVotingDeckResponse',
        destinationCoords,
        destinationDates,
        swipedAttractionIds,
        attractionsExist,
        attractionsToSwipe,
    };
});
const filterAndSortAttractions = (tripDestinationAttractions, swipedAttractionIds, attractionType, destinationDates, destinationId) => {
    var _a, _b;
    const selectedTypeAttractions = tripDestinationAttractions.filter((tripDestinationAttraction) => { var _a; return ((_a = tripDestinationAttraction.attraction) === null || _a === void 0 ? void 0 : _a.type) === attractionType; });
    // determine which cards have been added to the voting deck vs. which were auto-imported
    // split nonSwipedAttractions into two arrays: one for cards that have been added to the voting deck, and one for cards that haven't
    let [addedToVotingDeck, originallyInVotingDeck] = selectedTypeAttractions.reduce((acc, item) => {
        if (!item.isTravaCreated || item.manuallyAddedToTrip) {
            acc[0].push(item);
        }
        else {
            acc[1].push(item);
        }
        return acc;
    }, [[], []]);
    // For cards added to the voting deck, sort by updatedAt date, so most recently added cards are first
    addedToVotingDeck === null || addedToVotingDeck === void 0 ? void 0 : addedToVotingDeck.sort((a, b) => ((0, dayjs_1.default)(a.updatedAt).isAfter((0, dayjs_1.default)(b.updatedAt)) ? -1 : 1));
    // if destination dates are set for this tripDestination, filter by seasons
    if (destinationDates) {
        // filter if attraction seasons are within destination dates
        // only trava cards can originally be in the voting deck, and all trava cards have seasons
        originallyInVotingDeck = originallyInVotingDeck.filter((card) => { var _a; return (0, filter_cards_by_seasons_1.default)((_a = card.attraction) === null || _a === void 0 ? void 0 : _a.seasons, destinationDates[0], destinationDates[1]); });
    }
    // for cards originally in voting deck, sort by 1. matching destinationId 2. rank, 3. weighted rating, 4. bucketListCount, 5. rating count, 6. name
    // rank is present only for Trava's Choice cards (Trava cards by humans)
    originallyInVotingDeck === null || originallyInVotingDeck === void 0 ? void 0 : originallyInVotingDeck.sort((a, b) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
        return ((((_a = b.attraction) === null || _a === void 0 ? void 0 : _a.destinationId) === destinationId ? 1 : 0) -
            (((_b = a.attraction) === null || _b === void 0 ? void 0 : _b.destinationId) === destinationId ? 1 : 0) ||
            ((_d = (_c = a.attraction) === null || _c === void 0 ? void 0 : _c.rank) !== null && _d !== void 0 ? _d : 1000) - ((_f = (_e = b.attraction) === null || _e === void 0 ? void 0 : _e.rank) !== null && _f !== void 0 ? _f : 1000) ||
            getWeightedRating((_m = (_l = (_k = (_j = (_h = (_g = b.attraction) === null || _g === void 0 ? void 0 : _g.locations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.startLoc) === null || _k === void 0 ? void 0 : _k.googlePlace) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.rating) -
                getWeightedRating((_t = (_s = (_r = (_q = (_p = (_o = a.attraction) === null || _o === void 0 ? void 0 : _o.locations) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q.startLoc) === null || _r === void 0 ? void 0 : _r.googlePlace) === null || _s === void 0 ? void 0 : _s.data) === null || _t === void 0 ? void 0 : _t.rating) ||
            ((_v = (_u = b.attraction) === null || _u === void 0 ? void 0 : _u.bucketListCount) !== null && _v !== void 0 ? _v : 0) - ((_x = (_w = a.attraction) === null || _w === void 0 ? void 0 : _w.bucketListCount) !== null && _x !== void 0 ? _x : 0) ||
            ((_5 = (_4 = (_3 = (_2 = (_1 = (_0 = (_z = (_y = b.attraction) === null || _y === void 0 ? void 0 : _y.locations) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.startLoc) === null || _1 === void 0 ? void 0 : _1.googlePlace) === null || _2 === void 0 ? void 0 : _2.data) === null || _3 === void 0 ? void 0 : _3.rating) === null || _4 === void 0 ? void 0 : _4.count) !== null && _5 !== void 0 ? _5 : 0) -
                ((_13 = (_12 = (_11 = (_10 = (_9 = (_8 = (_7 = (_6 = a.attraction) === null || _6 === void 0 ? void 0 : _6.locations) === null || _7 === void 0 ? void 0 : _7[0]) === null || _8 === void 0 ? void 0 : _8.startLoc) === null || _9 === void 0 ? void 0 : _9.googlePlace) === null || _10 === void 0 ? void 0 : _10.data) === null || _11 === void 0 ? void 0 : _11.rating) === null || _12 === void 0 ? void 0 : _12.count) !== null && _13 !== void 0 ? _13 : 0) ||
            ((_15 = (_14 = a.attraction) === null || _14 === void 0 ? void 0 : _14.name) !== null && _15 !== void 0 ? _15 : '').localeCompare((_17 = (_16 = b.attraction) === null || _16 === void 0 ? void 0 : _16.name) !== null && _17 !== void 0 ? _17 : ''));
    });
    let finalInVotingDeck = [];
    if (attractionType === API_1.ATTRACTION_TYPE.EAT) {
        // initialize finalInVotingDeck with all Travas Choice cards (by humans)
        const { travasChoiceCards, travaGeneratedCards } = originallyInVotingDeck.reduce((acc, card) => {
            var _a, _b;
            if ((_b = (_a = card.attraction) === null || _a === void 0 ? void 0 : _a.recommendationBadges) === null || _b === void 0 ? void 0 : _b.includes(API_1.BADGES.TRAVAS_CHOICE)) {
                acc.travasChoiceCards.push(card);
            }
            else {
                acc.travaGeneratedCards.push(card);
            }
            return acc;
        }, {
            travasChoiceCards: [],
            travaGeneratedCards: [],
        });
        finalInVotingDeck = [...travasChoiceCards];
        // now, add in travaGeneratedCards using Nick's basic sort algorithm that ensures affordable options and breakfast options appear in every 10 cards, as these would otherwise be underrepresented
        const numberOfGeneratedCards = travaGeneratedCards.length;
        for (let i = 1; i <= numberOfGeneratedCards; i++) {
            let selectedAttraction;
            // note: we're mutating travaGeneratedCards with every selection to ensure that the same card isn't selected twice
            if (i % 10 === 3 || i % 10 === 6) {
                // $$, else $$$, else any
                selectedAttraction = selectAndRemoveFromDeck(travaGeneratedCards, findAttractionByCost, [
                    API_1.ATTRACTION_COST.TEN_TO_THIRTY,
                    API_1.ATTRACTION_COST.THIRTY_TO_SIXTY,
                ]);
            }
            else if (i % 10 === 4 || i % 10 === 8) {
                // $, else $$, else $$$, else any
                selectedAttraction = selectAndRemoveFromDeck(travaGeneratedCards, findAttractionByCost, [
                    API_1.ATTRACTION_COST.UNDER_TEN,
                    API_1.ATTRACTION_COST.TEN_TO_THIRTY,
                    API_1.ATTRACTION_COST.THIRTY_TO_SIXTY,
                ]);
            }
            else if (i % 10 === 5 || i % 10 === 9) {
                // ATTRACTION_BEST_VISIT_TIME.BREAKFAST is in top 2, else top 3, else any
                selectedAttraction = selectAndRemoveFromDeck(travaGeneratedCards, findAttractionByBestVisitTime, [
                    API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST,
                ]);
            }
            else {
                selectedAttraction = travaGeneratedCards[0];
                travaGeneratedCards.shift();
            }
            finalInVotingDeck.push(selectedAttraction);
        }
    }
    else if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        finalInVotingDeck = originallyInVotingDeck;
    }
    // combine the two arrays, prioritizing cards added to the voting deck
    const attractionsToSwipe = (_b = (_a = addedToVotingDeck
        .concat(finalInVotingDeck)) === null || _a === void 0 ? void 0 : _a.map((item) => item.attraction)) === null || _b === void 0 ? void 0 : _b.filter((item) => item);
    // filter out cards that have already been swiped last, so that order of swiping is preserved
    const nonSwipedAttractions = attractionsToSwipe.filter((attraction) => !swipedAttractionIds.includes(attraction.id));
    return nonSwipedAttractions;
};
const getWeightedRating = (rating) => {
    const { score, count } = rating || {};
    if (!score || !count) {
        return 0;
    }
    const weightedScore = score + (count < 100 ? -0.15 : count < 250 ? -0.05 : count > 5000 ? 0.15 : count > 1000 ? 0.05 : 0);
    return weightedScore;
};
const formatDates = (startDateDestination, endDateDestination) => {
    const formattedDestinationStartDate = (0, dayjs_1.default)(startDateDestination.toString(), dateFormat_1.DateFormat.YYYYMMDD).format(dateFormat_1.DateFormat.YYYY_MM_DD);
    const formattedDestinationEndDate = (0, dayjs_1.default)(endDateDestination.toString(), dateFormat_1.DateFormat.YYYYMMDD).format(dateFormat_1.DateFormat.YYYY_MM_DD);
    return [formattedDestinationStartDate, formattedDestinationEndDate];
};
const findAttractionByCost = (deck, costs) => {
    for (let cost of costs) {
        const found = deck.find((card) => { var _a; return ((_a = card.attraction) === null || _a === void 0 ? void 0 : _a.cost) === cost; });
        if (found)
            return found;
    }
    return deck[0];
};
const findAttractionByBestVisitTime = (deck, times) => {
    const time = times[0];
    // Check for visit time in top 2
    let found = deck.find((card) => { var _a, _b; return (_b = (_a = card.attraction) === null || _a === void 0 ? void 0 : _a.bestVisited) === null || _b === void 0 ? void 0 : _b.slice(0, 2).includes(time); });
    if (found)
        return found;
    // Check for visit time in top 3
    found = deck.find((card) => { var _a, _b; return (_b = (_a = card.attraction) === null || _a === void 0 ? void 0 : _a.bestVisited) === null || _b === void 0 ? void 0 : _b.slice(0, 3).includes(time); });
    if (found)
        return found;
    // Return any if not found
    return deck[0];
};
const selectAndRemoveFromDeck = (deck, fn, desiredOptions) => {
    const attraction = fn(deck, desiredOptions);
    const index = deck.indexOf(attraction);
    if (index !== -1)
        deck.splice(index, 1); // remove the selected card from the deck
    return attraction;
};
exports.default = getVotingDeck;
