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
Object.defineProperty(exports, "__esModule", { value: true });
const checkForExistingCards_1 = require("../../utils/checkForExistingCards");
const checkForExistingCards = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('User is not authorized');
    }
    const { googlePlaceId, destinationDates } = event.arguments.input;
    if (!googlePlaceId) {
        throw new Error('GooglePlaceId is required');
    }
    const { existingAttractions } = yield (0, checkForExistingCards_1.checkForExistingCards)({
        googlePlaceId,
        userId: event.identity.sub,
        destinationDates: destinationDates || undefined,
    });
    return {
        __typename: 'CheckForExistingCardsResponse',
        attractions: existingAttractions,
    };
});
exports.default = checkForExistingCards;
