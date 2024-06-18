"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputToCreateTripDestinationAttraction = void 0;
const Yup = __importStar(require("yup"));
function getInputToCreateTripDestinationAttraction({ tripId, destinationId, attractionId, isTravaCreated, }) {
    // assemble the input
    const createTripDestinationAttractionInput = {
        tripId,
        destinationId,
        attractionId,
        isTravaCreated,
    };
    const errors = validateTripDestinationAttractionSchema(createTripDestinationAttractionInput);
    if (errors.length) {
        throw new Error(`Invalid trip destination attraction input: ${errors.join(', ')}`);
    }
    return createTripDestinationAttractionInput;
}
exports.getInputToCreateTripDestinationAttraction = getInputToCreateTripDestinationAttraction;
function validateTripDestinationAttractionSchema(input) {
    const errors = [];
    try {
        TripDestinationAttractionSchema.validateSync(input, { abortEarly: false });
    }
    catch (err) {
        if (err instanceof Yup.ValidationError) {
            for (const error of err.errors) {
                errors.push(error);
            }
        }
        else {
            throw new Error(`Unexpected validation error: ${err}`);
        }
    }
    return errors;
}
const TripDestinationAttractionSchema = Yup.object({
    tripId: Yup.string().required(),
    destinationId: Yup.string().required(),
    attractionId: Yup.string().required(),
    isTravaCreated: Yup.number().required(),
});
