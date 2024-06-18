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
function getAllPaginatedData(request, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let iterations = 0;
        let res = yield request();
        callback(res.data);
        while (res.nextToken) {
            iterations += 1;
            if (iterations >= 300) {
                // too many iterations - stop infinite loop - targetIRR not reached
                throw new Error('Failed to calculate the IRR in 300 iterations. Please change the input parameters');
            }
            res = yield request(res.nextToken);
            callback(res.data);
        }
    });
}
exports.default = getAllPaginatedData;
