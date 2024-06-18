"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTHER_DESTINATION_ID = exports.UNKNOWN = exports.AboutBusinessInputKeys = exports.EMBEDDINGS_MODELS = exports.CHAT_MODELS = void 0;
var CHAT_MODELS;
(function (CHAT_MODELS) {
    CHAT_MODELS["GPT_3"] = "gpt-3.5-turbo";
    CHAT_MODELS["GPT_4"] = "gpt-4";
    CHAT_MODELS["NEW_GPT_3"] = "gpt-3.5-turbo-1106";
    CHAT_MODELS["NEW_GPT_4"] = "gpt-4-1106-preview";
})(CHAT_MODELS || (exports.CHAT_MODELS = CHAT_MODELS = {}));
var EMBEDDINGS_MODELS;
(function (EMBEDDINGS_MODELS) {
    EMBEDDINGS_MODELS["ADA_2"] = "text-embedding-ada-002";
    EMBEDDINGS_MODELS["SMALL"] = "text-embedding-3-small";
    EMBEDDINGS_MODELS["LARGE"] = "text-embedding-3-large";
})(EMBEDDINGS_MODELS || (exports.EMBEDDINGS_MODELS = EMBEDDINGS_MODELS = {}));
var AboutBusinessInputKeys;
(function (AboutBusinessInputKeys) {
    AboutBusinessInputKeys["FROM_THE_BUSINESS"] = "fromTheBusiness";
    AboutBusinessInputKeys["SERVICE_OPTIONS"] = "serviceOptions";
    AboutBusinessInputKeys["HIGHLIGHTS"] = "highlights";
    AboutBusinessInputKeys["POPULAR_FOR"] = "popularFor";
    AboutBusinessInputKeys["ACCESSIBILITY"] = "accessibility";
    AboutBusinessInputKeys["OFFERINGS"] = "offerings";
    AboutBusinessInputKeys["DINING_OPTIONS"] = "diningOptions";
    AboutBusinessInputKeys["AMENITIES"] = "amenities";
    AboutBusinessInputKeys["ATMOSPHERE"] = "atmosphere";
    AboutBusinessInputKeys["CROWD"] = "crowd";
    AboutBusinessInputKeys["CHILDREN"] = "children";
    AboutBusinessInputKeys["PLANNING"] = "planning";
    AboutBusinessInputKeys["PAYMENTS"] = "payments";
})(AboutBusinessInputKeys || (exports.AboutBusinessInputKeys = AboutBusinessInputKeys = {}));
exports.UNKNOWN = 'UNKNOWN';
exports.OTHER_DESTINATION_ID = '7cd39ab7-f703-45a0-8d4d-3732410f711f';
