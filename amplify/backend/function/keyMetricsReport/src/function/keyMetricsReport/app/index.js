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
exports.handler = void 0;
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const getAllPastDay_1 = require("./utils/getAllPastDay");
const sendSlackMessage_1 = require("./utils/sendSlackMessage");
const API_1 = require("shared-types/API");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const weekday_1 = __importDefault(require("dayjs/plugin/weekday"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(weekday_1.default);
const tz = 'America/New_York';
const date = dayjs_1.default().tz(tz).subtract(1, 'day');
const formattedDate = `${date.format('dddd')}, ${date.format('MMMM')}, ${date.format('D')}, ${date.format('YYYY')}`;
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // only run this function in production
    if (process.env.ENV !== 'prod')
        return;
    console.log('Running key metrics report function...');
    ApiClient_1.default.get().useIamAuth();
    // new users
    const newUsersToday = yield getAllPastDay_1.getAllUsersPastDay();
    const newUsersTodayLength = (_a = newUsersToday === null || newUsersToday === void 0 ? void 0 : newUsersToday.length) !== null && _a !== void 0 ? _a : 0;
    console.log(`New users today: ${newUsersTodayLength}`);
    const newUsersCsv = newUsersToday
        .map((user) => `${user.id},${user.username},${user.name},${user.email},${user.phone}`)
        .join('\n');
    // user sessions (app opens)
    const userSessionsToday = yield getAllPastDay_1.getAllAppSessionsPastDay();
    const userSessionsTodayLength = (_b = userSessionsToday === null || userSessionsToday === void 0 ? void 0 : userSessionsToday.length) !== null && _b !== void 0 ? _b : 0;
    console.log(`User sessions today: ${userSessionsTodayLength}`);
    const userSessionsCsv = userSessionsToday
        .filter((userSession) => !!userSession)
        .map((userSession) => `${userSession.id},${userSession.userId},${userSession.deviceType},${userSession.appVersion},${userSession.createdAt}`)
        .join('\n');
    const usersOpeningApp = userSessionsToday
        .filter((userSession) => !!userSession)
        .reduce((acc, userSession) => {
        if (userSession === null || userSession === void 0 ? void 0 : userSession.userId) {
            return Object.assign(Object.assign({}, acc), { [userSession.userId]: true });
        }
        else {
            return acc;
        }
    }, {});
    const numberOfUsersOpeningApp = Object.keys(usersOpeningApp).length;
    // new attraction swipes
    const newAttractionSwipesToday = yield getAllPastDay_1.getAllAttractionSwipesPastDay();
    const newAttractionSwipesTodayLength = (_c = newAttractionSwipesToday === null || newAttractionSwipesToday === void 0 ? void 0 : newAttractionSwipesToday.length) !== null && _c !== void 0 ? _c : 0;
    console.log(`New swipes today: ${newAttractionSwipesTodayLength}`);
    const newAttractionSwipesByAuthorId = newAttractionSwipesToday.reduce((acc, swipe) => {
        var _a;
        if (swipe === null || swipe === void 0 ? void 0 : swipe.userId) {
            return Object.assign(Object.assign({}, acc), { [swipe.userId]: ((_a = acc[swipe.userId]) !== null && _a !== void 0 ? _a : 0) + 1 });
        }
        else {
            return acc;
        }
    }, {});
    const newAttractionSwipesByDestinationId = newAttractionSwipesToday.reduce((acc, swipe) => {
        var _a, _b, _c, _d;
        if (swipe === null || swipe === void 0 ? void 0 : swipe.destinationId) {
            return Object.assign(Object.assign({}, acc), { [swipe.destinationId]: {
                    destinationName: (_b = (_a = swipe.destination) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
                    swipeCount: ((_d = (_c = acc[swipe.destinationId]) === null || _c === void 0 ? void 0 : _c.swipeCount) !== null && _d !== void 0 ? _d : 0) + 1,
                } });
        }
        else {
            return acc;
        }
    }, {});
    const newAttractionSwipesCsv = Object.entries(newAttractionSwipesByAuthorId)
        .map(([id, count]) => `${id},${count}`)
        .join('\n');
    const newAttractionSwipesByDestinationCsv = Object.entries(newAttractionSwipesByDestinationId)
        .map(([id, { destinationName, swipeCount }]) => `${id},${destinationName},${swipeCount}`)
        .join('\n');
    // new attractions created
    const newAttractionsCreatedToday = yield getAllPastDay_1.getAllAttractionsCreatedPastDay();
    const newAttractionsCreatedTodayLength = (_d = newAttractionsCreatedToday === null || newAttractionsCreatedToday === void 0 ? void 0 : newAttractionsCreatedToday.length) !== null && _d !== void 0 ? _d : 0;
    console.log(`New attractions created today: ${newAttractionsCreatedTodayLength}`);
    const adminAttractions = newAttractionsCreatedToday.filter((attraction) => (attraction === null || attraction === void 0 ? void 0 : attraction.authorType) === API_1.AUTHOR_TYPE.ADMIN);
    const userAttractions = newAttractionsCreatedToday.filter((attraction) => (attraction === null || attraction === void 0 ? void 0 : attraction.authorType) === API_1.AUTHOR_TYPE.USER);
    // assemble dictionary of authorIds to number of attractions created from userAttractions
    const userAttractionsByAuthorId = userAttractions.reduce((acc, attraction) => {
        var _a;
        if (attraction === null || attraction === void 0 ? void 0 : attraction.authorId) {
            return Object.assign(Object.assign({}, acc), { [attraction.authorId]: ((_a = acc[attraction.authorId]) !== null && _a !== void 0 ? _a : 0) + 1 });
        }
        else {
            return acc;
        }
    }, {});
    // assemble a dictionary of destinationIds to number of attractions created, one col for userAttractions and one col for adminAttractions. So like: destinationId, userAttractions, adminAttractions
    const destinationIdsToAttractionsCreated = newAttractionsCreatedToday.reduce((acc, attraction) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (attraction === null || attraction === void 0 ? void 0 : attraction.destinationId) {
            const { userAttractions, adminAttractions } = (_a = acc[attraction.destinationId]) !== null && _a !== void 0 ? _a : {
                destinationName: (_c = (_b = attraction.destination) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '',
                userAttractions: 0,
                adminAttractions: 0,
            };
            if (attraction.authorType === API_1.AUTHOR_TYPE.USER) {
                return Object.assign(Object.assign({}, acc), { [attraction.destinationId]: {
                        destinationName: (_e = (_d = attraction.destination) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : '',
                        userAttractions: userAttractions + 1,
                        adminAttractions,
                    } });
            }
            else {
                return Object.assign(Object.assign({}, acc), { [attraction.destinationId]: {
                        destinationName: (_g = (_f = attraction.destination) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : '',
                        userAttractions,
                        adminAttractions: adminAttractions + 1,
                    } });
            }
        }
        else {
            return acc;
        }
    }, {});
    const attractionsCreatedByUserCsv = Object.entries(userAttractionsByAuthorId)
        .map(([id, count]) => `${id},${count}`)
        .join('\n');
    const attractionsCreatedByDestinationCsv = Object.entries(destinationIdsToAttractionsCreated)
        .map(([id, { destinationName, userAttractions, adminAttractions }]) => `${id},${destinationName},${userAttractions},${adminAttractions}`)
        .join('\n');
    // new itinerary views
    const tripDestinationUserViewingItineraryInPastDay = yield getAllPastDay_1.getAllItineraryViewsPastDay();
    const tripDestinationUserViewingItineraryInPastDayLength = (_e = tripDestinationUserViewingItineraryInPastDay === null || tripDestinationUserViewingItineraryInPastDay === void 0 ? void 0 : tripDestinationUserViewingItineraryInPastDay.length) !== null && _e !== void 0 ? _e : 0;
    const itineraryFirstTimeViewsCsv = tripDestinationUserViewingItineraryInPastDay
        .map((user) => `${user === null || user === void 0 ? void 0 : user.userId},${user === null || user === void 0 ? void 0 : user.tripId},${user === null || user === void 0 ? void 0 : user.destinationId},${user === null || user === void 0 ? void 0 : user.tripPlanViewedAt}`)
        .join('\n');
    // assemble message
    const message = `Metrics Report for ${formattedDate}:\n- New Users: ${newUsersTodayLength}\n- App sessions: ${userSessionsTodayLength} sessions from ${numberOfUsersOpeningApp} different users\n- New Swipes: ${newAttractionSwipesTodayLength} swipes from ${(_g = (_f = Object.keys(newAttractionSwipesByAuthorId)) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0} different users\n- New Attractions (Admin): ${adminAttractions.length}\n- New Attractions (User): ${userAttractions.length} attractions from ${(_j = (_h = Object.keys(userAttractionsByAuthorId)) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0} different users\n- Users who viewed a new itinerary: ${tripDestinationUserViewingItineraryInPastDayLength}\n--------------------------------------------------------------------------------------------------------------------------------------------------\n`;
    // Send Slack message
    yield sendSlackMessage_1.sendSlackMessage({
        text: message,
        newUsersCsv,
        userSessionsCsv,
        newAttractionSwipesCsv,
        newAttractionSwipesByDestinationCsv,
        attractionsCreatedByDestinationCsv,
        attractionsCreatedByUserCsv,
        itineraryFirstTimeViewsCsv,
    });
    console.log('Finished key metrics report function');
});
exports.handler = handler;
