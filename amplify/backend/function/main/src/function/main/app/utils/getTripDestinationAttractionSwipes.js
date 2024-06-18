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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const MAX_ITERATIONS_AMOUNT = 20;
function getTripDestinationAttractionSwipes(variables) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    return __awaiter(this, void 0, void 0, function* () {
        let response = undefined;
        let lastNextToken = undefined;
        for (let i = 0; i < MAX_ITERATIONS_AMOUNT && (lastNextToken !== null || i === 0); ++i) {
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaGetTripDestinationAttractionSwipes,
                variables: Object.assign(Object.assign({}, variables), { attractionSwipesLimit: 1, attractionSwipesNextToken: lastNextToken }),
            });
            // TODO unified error handler
            if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
                // TODO handle error message parsing:
                throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
            }
            if (!response) {
                response = Object.assign({}, res);
            }
            else {
                const items = (_g = (_f = (_e = (_d = (_c = (_b = res.data.getUser) === null || _b === void 0 ? void 0 : _b.userTrips) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.trip) === null || _f === void 0 ? void 0 : _f.attractionSwipes) === null || _g === void 0 ? void 0 : _g.items;
                if (items) {
                    (_p = (_o = (_m = (_l = (_k = (_j = (_h = response.data.getUser) === null || _h === void 0 ? void 0 : _h.userTrips) === null || _j === void 0 ? void 0 : _j.items) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.trip) === null || _m === void 0 ? void 0 : _m.attractionSwipes) === null || _o === void 0 ? void 0 : _o.items) === null || _p === void 0 ? void 0 : _p.push(...items);
                }
            }
            lastNextToken = (_v = (_u = (_t = (_s = (_r = (_q = res.data.getUser) === null || _q === void 0 ? void 0 : _q.userTrips) === null || _r === void 0 ? void 0 : _r.items) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.trip) === null || _u === void 0 ? void 0 : _u.attractionSwipes) === null || _v === void 0 ? void 0 : _v.nextToken;
        }
        return (_1 = (_0 = (_z = (_y = (_x = (_w = response === null || response === void 0 ? void 0 : response.data.getUser) === null || _w === void 0 ? void 0 : _w.userTrips) === null || _x === void 0 ? void 0 : _x.items) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.trip) === null || _0 === void 0 ? void 0 : _0.attractionSwipes) === null || _1 === void 0 ? void 0 : _1.items;
    });
}
exports.default = getTripDestinationAttractionSwipes;
