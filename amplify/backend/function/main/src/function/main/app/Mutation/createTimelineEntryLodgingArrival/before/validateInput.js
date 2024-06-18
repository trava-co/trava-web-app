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
const timelineValidation_1 = require("../../../utils/timelineValidation");
const validateInput = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    if (!event.arguments.input) {
        throw new Error('No arguments specified');
    }
    (0, timelineValidation_1.validateNotes)(event.arguments.input.notes);
    (0, timelineValidation_1.validateDate)(event.arguments.input.date);
    (0, timelineValidation_1.validateTime)(event.arguments.input.time);
    (0, timelineValidation_1.validateLodgingArrivalNameAndAddress)(event.arguments.input.lodgingArrivalNameAndAddress);
    return null;
});
exports.default = validateInput;
