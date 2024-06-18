"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyDoOrEat = void 0;
const API_1 = require("shared-types/API");
// quick heuristic with 97.5% accuracy on our generated cards
function classifyDoOrEat({ mealServices }) {
    if (!mealServices)
        return API_1.ATTRACTION_TYPE.DO;
    const sum = [
        mealServices.servesBreakfast ? 1 : 0,
        mealServices.servesBrunch ? 1 : 0,
        mealServices.servesLunch ? 1 : 0,
        mealServices.servesDinner ? 1 : 0,
        mealServices.dineIn ? 1 : 0,
        mealServices.takeout ? 1 : 0,
        mealServices.delivery ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
    return sum >= 2 ? API_1.ATTRACTION_TYPE.EAT : API_1.ATTRACTION_TYPE.DO;
}
exports.classifyDoOrEat = classifyDoOrEat;
