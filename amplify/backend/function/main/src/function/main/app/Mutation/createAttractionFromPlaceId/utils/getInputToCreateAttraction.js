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
exports.getInputToCreateAttraction = void 0;
const API_1 = require("shared-types/API");
const classifyDoOrEat_1 = require("./classifyDoOrEat");
const getBestVisited_1 = require("./getBestVisited");
const getTimezoneFromCoords_1 = require("../../../utils/getTimezoneFromCoords");
const uuid_1 = require("uuid");
const Yup = __importStar(require("yup"));
const checkIfValidTimestamp_1 = require("./checkIfValidTimestamp");
function getInputToCreateAttraction({ business, authorType, authorId, destinationId, recommendationBadges, }) {
    var _a, _b;
    // categorize attractionType
    const attractionType = (0, classifyDoOrEat_1.classifyDoOrEat)({
        mealServices: business.mealServices,
    });
    const bestVisited = (0, getBestVisited_1.getBestVisited)({
        periods: (_a = business.hours) === null || _a === void 0 ? void 0 : _a.periods,
        mealServices: business.mealServices,
        attractionType,
    });
    // currently, TPG only considers the duration variable when scheduling type DO attractions.
    const duration = API_1.ATTRACTION_DURATION.ONE_TWO_HOURS; // hardcode, just for initialization of card.
    const timezone = (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(business.coords);
    const locations = getLocations({ googlePlaceId: business.googlePlaceId, timezone });
    const now = new Date().toISOString();
    const getDescriptions = (editorialSummary) => {
        if (editorialSummary) {
            return {
                descriptionShort: editorialSummary,
                descriptionLong: `${'Generating description and details. This usually takes a few minutes...'}`,
            };
        }
        else {
            return {
                descriptionShort: 'Generating description and details',
                descriptionLong: 'This usually takes a few minutes...',
            };
        }
    };
    // assemble the input
    const createAttractionInput = Object.assign(Object.assign(Object.assign(Object.assign({ id: (0, uuid_1.v4)(), type: attractionType, bestVisited,
        duration,
        destinationId,
        locations,
        authorType, isTravaCreated: 1, bucketListCount: 0, costCurrency: API_1.CURRENCY_TYPE.USD, costType: API_1.ATTRACTION_COST_TYPE.PERSON, name: (_b = business.name) !== null && _b !== void 0 ? _b : 'Error adding name. Contact Support.' }, getDescriptions(business.editorialSummary)), { privacy: API_1.ATTRACTION_PRIVACY.PUBLIC, label: API_1.AttractionLabel.ATTRACTION, createdAt: now, updatedAt: now, generation: {
            step: API_1.GenerationStep.GET_PHOTOS,
            status: API_1.Status.PENDING,
            failureCount: 0,
            lastUpdatedAt: now,
        } }), (authorType === API_1.AUTHOR_TYPE.USER && { authorId })), (recommendationBadges && { recommendationBadges }));
    // validate the input
    const attractionErrors = validateAttractionSchema(createAttractionInput);
    if (attractionErrors.length) {
        throw new Error(`Error validating attraction input: ${attractionErrors.join(', ')}`);
    }
    return createAttractionInput;
}
exports.getInputToCreateAttraction = getInputToCreateAttraction;
function getLocations({ googlePlaceId, timezone }) {
    return [
        {
            id: (0, uuid_1.v4)(),
            displayOrder: 0,
            deleted: false,
            startLoc: {
                id: (0, uuid_1.v4)(),
                googlePlaceId,
                timezone,
            },
            endLoc: {
                id: (0, uuid_1.v4)(),
                googlePlaceId,
                timezone,
            },
        },
    ];
}
var ATTRACTION_BEST_VISIT_TIME_DO;
(function (ATTRACTION_BEST_VISIT_TIME_DO) {
    ATTRACTION_BEST_VISIT_TIME_DO["MORNING"] = "MORNING";
    ATTRACTION_BEST_VISIT_TIME_DO["AFTERNOON"] = "AFTERNOON";
    ATTRACTION_BEST_VISIT_TIME_DO["EVENING"] = "EVENING";
})(ATTRACTION_BEST_VISIT_TIME_DO || (ATTRACTION_BEST_VISIT_TIME_DO = {}));
var ATTRACTION_BEST_VISIT_TIME_EAT;
(function (ATTRACTION_BEST_VISIT_TIME_EAT) {
    ATTRACTION_BEST_VISIT_TIME_EAT["BREAKFAST"] = "BREAKFAST";
    ATTRACTION_BEST_VISIT_TIME_EAT["LUNCH"] = "LUNCH";
    ATTRACTION_BEST_VISIT_TIME_EAT["DINNER"] = "DINNER";
    ATTRACTION_BEST_VISIT_TIME_EAT["SNACK"] = "SNACK";
})(ATTRACTION_BEST_VISIT_TIME_EAT || (ATTRACTION_BEST_VISIT_TIME_EAT = {}));
function validateAttractionSchema(attraction) {
    const attractionErrors = [];
    try {
        AttractionSchema.validateSync(attraction, { abortEarly: false });
    }
    catch (err) {
        if (err instanceof Yup.ValidationError) {
            for (const error of err.errors) {
                attractionErrors.push(error);
            }
        }
        else {
            throw new Error(`Unexpected validation error: ${err}`);
        }
    }
    return attractionErrors;
}
// Create a validation schema with yup that validates each of the input fields listed:
// id, type, bestVisited, duration, destinationId, locations, authorType, isTravaCreated, bucketListCount, costCurrency, costType, name, descriptionShort, descriptionLong, privacy, authorId
// Reference @API.ts for the types and requirements of each field
const AttractionSchema = Yup.object({
    id: Yup.string()
        .required('Attraction ID is required')
        // add assertion for uuid v4 format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where: x represents a hexadecimal digit (0-9a-f) y represents a hexadecimal digit that is either 8, 9, A, or B.
        .test('is-uuid-v4', 'Attraction ID must be uiud v4, which follows a precise format. See here for details on format: https://www.uuidgenerator.net/', (value) => {
        if (!value)
            return false;
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
        return regex.test(value);
    }),
    type: Yup.mixed().oneOf(Object.values(API_1.ATTRACTION_TYPE)).required(),
    bestVisited: Yup.array()
        .min(1, 'At least one best visited time is required')
        .required('At least one best visited time is required')
        .when('type', {
        is: API_1.ATTRACTION_TYPE.DO,
        then: (schema) => schema.of(Yup.mixed().oneOf(Object.values(ATTRACTION_BEST_VISIT_TIME_DO))),
        otherwise: (schema) => schema.of(Yup.mixed().oneOf(Object.values(ATTRACTION_BEST_VISIT_TIME_EAT))),
    }),
    duration: Yup.mixed().oneOf(Object.values(API_1.ATTRACTION_DURATION)).required(),
    destinationId: Yup.string()
        .required()
        // add assertion for uuid v4 format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where: x represents a hexadecimal digit (0-9a-f) y represents a hexadecimal digit that is either 8, 9, A, or B.
        .test('is-uuid-v4', 'Destination ID must be uiud v4, which follows a precise format. See here for details on format: https://www.uuidgenerator.net/', (value) => {
        if (!value)
            return false;
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
        return regex.test(value);
    }),
    locations: Yup.array()
        .of(Yup.object().shape({
        id: Yup.string().required(),
        displayOrder: Yup.number().required(),
        deleted: Yup.boolean().required(),
        startLoc: Yup.object()
            .shape({
            id: Yup.string().required(),
            googlePlaceId: Yup.string().required(),
            timezone: Yup.string().required(),
        })
            .required(),
        endLoc: Yup.object()
            .shape({
            id: Yup.string().required(),
            googlePlaceId: Yup.string().required(),
            timezone: Yup.string().required(),
        })
            .required(),
    }))
        .required(),
    authorType: Yup.mixed().oneOf(Object.values(API_1.AUTHOR_TYPE)).required(),
    authorId: Yup.string().when('authorType', (authorType, schema) => {
        return authorType === API_1.AUTHOR_TYPE.USER ? schema.required() : schema.nullable();
    }),
    isTravaCreated: Yup.number().oneOf([0, 1]).required(),
    bucketListCount: Yup.number().integer().required(),
    costCurrency: Yup.mixed().oneOf(Object.values(API_1.CURRENCY_TYPE)).required(),
    costType: Yup.mixed().oneOf(Object.values(API_1.ATTRACTION_COST_TYPE)).required(),
    name: Yup.string().required(),
    descriptionShort: Yup.string().required(),
    descriptionLong: Yup.string().required(),
    privacy: Yup.mixed().oneOf(Object.values(API_1.ATTRACTION_PRIVACY)).required(),
    label: Yup.mixed().oneOf(Object.values(API_1.AttractionLabel)).required(),
    createdAt: Yup.string().required().test('is-iso-8601', 'createdAt must be in ISO 8601 format', checkIfValidTimestamp_1.checkIfValidTimestamp),
    updatedAt: Yup.string().required().test('is-iso-8601', 'updatedAt must be in ISO 8601 format', checkIfValidTimestamp_1.checkIfValidTimestamp),
    generation: Yup.object()
        .shape({
        step: Yup.mixed().oneOf(Object.values(API_1.GenerationStep)).required(),
        status: Yup.mixed().oneOf(Object.values(API_1.Status)).required(),
        lastUpdatedAt: Yup.string()
            .required()
            .test('is-iso-8601', 'lastUpdatedAt must be in ISO 8601 format', checkIfValidTimestamp_1.checkIfValidTimestamp),
        failureCount: Yup.number().integer(),
        lastFailureReason: Yup.string().nullable(),
    })
        .nullable(),
});
