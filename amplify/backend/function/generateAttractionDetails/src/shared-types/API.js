"use strict";
/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchableDestinationAggregateField = exports.SearchableDestinationSortableFields = exports.SearchableAttractionAggregateField = exports.SearchableAttractionSortableFields = exports.SHARED_POST_ERROR_TYPE = exports.Parity = exports.UpdateType = exports.MinimumVersionName = exports.FeatureFlagName = exports.OPERATION_TYPE = exports.BACKEND_ENV_NAME = exports.TeaRexEventLabel = exports.TeaRexLabel = exports.LIKE_DISLIKE_ACTION_INPUT = exports.BUCKET_LIST_ACTION_INPUT = exports.SearchableUserAggregateField = exports.SearchableAggregateType = exports.SearchableSortDirection = exports.SearchableUserSortableFields = exports.NOTIFICATION_TYPE = exports.PLATFORM = exports.UserSessionLabel = exports.ModelSortDirection = exports.ModelAttributeTypes = exports.REFERRAL_TYPES = exports.PRIVACY = exports.MEDIA_TYPES = exports.TimelineEntryType = exports.UserTripStatus = exports.TripDestinationTime = exports.AttractionSwipeLabel = exports.Status = exports.GenerationStep = exports.AttractionLabel = exports.ATTRACTION_PRIVACY = exports.BusinessStatus = exports.ATTRACTION_RESERVATION = exports.ATTRACTION_DURATION = exports.ATTRACTION_COST_TYPE = exports.CURRENCY_TYPE = exports.ATTRACTION_BEST_VISIT_TIME = exports.AUTHOR_TYPE = exports.ATTRACTION_TARGET_GROUP = exports.AttractionSwipeResult = exports.BADGES = exports.ATTRACTION_COST = exports.DistanceType = exports.ATTRACTION_CUISINE_TYPE = exports.ATTRACTION_CATEGORY_TYPE = exports.ATTRACTION_TYPE = void 0;
exports.PROVIDER = void 0;
var ATTRACTION_TYPE;
(function (ATTRACTION_TYPE) {
    ATTRACTION_TYPE["DO"] = "DO";
    ATTRACTION_TYPE["EAT"] = "EAT";
})(ATTRACTION_TYPE || (exports.ATTRACTION_TYPE = ATTRACTION_TYPE = {}));
var ATTRACTION_CATEGORY_TYPE;
(function (ATTRACTION_CATEGORY_TYPE) {
    ATTRACTION_CATEGORY_TYPE["ACTION_AND_ADVENTURE"] = "ACTION_AND_ADVENTURE";
    ATTRACTION_CATEGORY_TYPE["ARTS_AND_CULTURE"] = "ARTS_AND_CULTURE";
    ATTRACTION_CATEGORY_TYPE["ENTERTAINMENT"] = "ENTERTAINMENT";
    ATTRACTION_CATEGORY_TYPE["LEISURE"] = "LEISURE";
    ATTRACTION_CATEGORY_TYPE["NATURE"] = "NATURE";
    ATTRACTION_CATEGORY_TYPE["NIGHTLIFE_AND_DRINKING"] = "NIGHTLIFE_AND_DRINKING";
    ATTRACTION_CATEGORY_TYPE["NON_APPLICABLE"] = "NON_APPLICABLE";
    ATTRACTION_CATEGORY_TYPE["SHOPPING"] = "SHOPPING";
    ATTRACTION_CATEGORY_TYPE["SIGHTS_AND_LANDMARKS"] = "SIGHTS_AND_LANDMARKS";
})(ATTRACTION_CATEGORY_TYPE || (exports.ATTRACTION_CATEGORY_TYPE = ATTRACTION_CATEGORY_TYPE = {}));
var ATTRACTION_CUISINE_TYPE;
(function (ATTRACTION_CUISINE_TYPE) {
    ATTRACTION_CUISINE_TYPE["AFRICAN"] = "AFRICAN";
    ATTRACTION_CUISINE_TYPE["AMERICAN_NEW"] = "AMERICAN_NEW";
    ATTRACTION_CUISINE_TYPE["AMERICAN_TRADITIONAL"] = "AMERICAN_TRADITIONAL";
    ATTRACTION_CUISINE_TYPE["BAKERY"] = "BAKERY";
    ATTRACTION_CUISINE_TYPE["BARBEQUE"] = "BARBEQUE";
    ATTRACTION_CUISINE_TYPE["BREAKFAST"] = "BREAKFAST";
    ATTRACTION_CUISINE_TYPE["BRUNCH"] = "BRUNCH";
    ATTRACTION_CUISINE_TYPE["BURGERS"] = "BURGERS";
    ATTRACTION_CUISINE_TYPE["CAJUN_CREOLE"] = "CAJUN_CREOLE";
    ATTRACTION_CUISINE_TYPE["CARIBBEAN"] = "CARIBBEAN";
    ATTRACTION_CUISINE_TYPE["CHINESE"] = "CHINESE";
    ATTRACTION_CUISINE_TYPE["COFFEE_AND_TEA"] = "COFFEE_AND_TEA";
    ATTRACTION_CUISINE_TYPE["CUBAN"] = "CUBAN";
    ATTRACTION_CUISINE_TYPE["EUROPEAN"] = "EUROPEAN";
    ATTRACTION_CUISINE_TYPE["FARMERS_MARKET"] = "FARMERS_MARKET";
    ATTRACTION_CUISINE_TYPE["FAST_FOOD"] = "FAST_FOOD";
    ATTRACTION_CUISINE_TYPE["FINE_DINING"] = "FINE_DINING";
    ATTRACTION_CUISINE_TYPE["FOOD_HALL"] = "FOOD_HALL";
    ATTRACTION_CUISINE_TYPE["FRENCH"] = "FRENCH";
    ATTRACTION_CUISINE_TYPE["FUSION"] = "FUSION";
    ATTRACTION_CUISINE_TYPE["GERMAN"] = "GERMAN";
    ATTRACTION_CUISINE_TYPE["GREEK"] = "GREEK";
    ATTRACTION_CUISINE_TYPE["HAWAIIAN"] = "HAWAIIAN";
    ATTRACTION_CUISINE_TYPE["ICE_CREAM_AND_DESSERTS"] = "ICE_CREAM_AND_DESSERTS";
    ATTRACTION_CUISINE_TYPE["INDIAN"] = "INDIAN";
    ATTRACTION_CUISINE_TYPE["ITALIAN"] = "ITALIAN";
    ATTRACTION_CUISINE_TYPE["JAPANESE"] = "JAPANESE";
    ATTRACTION_CUISINE_TYPE["KOREAN"] = "KOREAN";
    ATTRACTION_CUISINE_TYPE["LATIN_AMERICAN"] = "LATIN_AMERICAN";
    ATTRACTION_CUISINE_TYPE["MEDITERRANEAN"] = "MEDITERRANEAN";
    ATTRACTION_CUISINE_TYPE["MEXICAN"] = "MEXICAN";
    ATTRACTION_CUISINE_TYPE["MIDDLE_EASTERN"] = "MIDDLE_EASTERN";
    ATTRACTION_CUISINE_TYPE["MODERN"] = "MODERN";
    ATTRACTION_CUISINE_TYPE["OTHER"] = "OTHER";
    ATTRACTION_CUISINE_TYPE["PERUVIAN"] = "PERUVIAN";
    ATTRACTION_CUISINE_TYPE["PIZZA"] = "PIZZA";
    ATTRACTION_CUISINE_TYPE["PUB"] = "PUB";
    ATTRACTION_CUISINE_TYPE["SANDWICHES"] = "SANDWICHES";
    ATTRACTION_CUISINE_TYPE["SEAFOOD"] = "SEAFOOD";
    ATTRACTION_CUISINE_TYPE["SOUL"] = "SOUL";
    ATTRACTION_CUISINE_TYPE["SOUTHERN"] = "SOUTHERN";
    ATTRACTION_CUISINE_TYPE["SOUTHWESTERN"] = "SOUTHWESTERN";
    ATTRACTION_CUISINE_TYPE["STEAKHOUSE"] = "STEAKHOUSE";
    ATTRACTION_CUISINE_TYPE["SUSHI"] = "SUSHI";
    ATTRACTION_CUISINE_TYPE["SPANISH"] = "SPANISH";
    ATTRACTION_CUISINE_TYPE["TAPAS_AND_SMALL_PLATES"] = "TAPAS_AND_SMALL_PLATES";
    ATTRACTION_CUISINE_TYPE["TEX"] = "TEX";
    ATTRACTION_CUISINE_TYPE["THAI"] = "THAI";
    ATTRACTION_CUISINE_TYPE["VEGAN"] = "VEGAN";
    ATTRACTION_CUISINE_TYPE["VEGETARIAN"] = "VEGETARIAN";
    ATTRACTION_CUISINE_TYPE["VIETNAMESE"] = "VIETNAMESE";
})(ATTRACTION_CUISINE_TYPE || (exports.ATTRACTION_CUISINE_TYPE = ATTRACTION_CUISINE_TYPE = {}));
var DistanceType;
(function (DistanceType) {
    DistanceType["NEARBY"] = "NEARBY";
    DistanceType["FARTHER_AWAY"] = "FARTHER_AWAY";
})(DistanceType || (exports.DistanceType = DistanceType = {}));
var ATTRACTION_COST;
(function (ATTRACTION_COST) {
    ATTRACTION_COST["FREE"] = "FREE";
    ATTRACTION_COST["UNDER_TEN"] = "UNDER_TEN";
    ATTRACTION_COST["UNDER_TWENTY_FIVE"] = "UNDER_TWENTY_FIVE";
    ATTRACTION_COST["TEN_TO_THIRTY"] = "TEN_TO_THIRTY";
    ATTRACTION_COST["TWENTY_FIVE_TO_FIFTY"] = "TWENTY_FIVE_TO_FIFTY";
    ATTRACTION_COST["THIRTY_TO_SIXTY"] = "THIRTY_TO_SIXTY";
    ATTRACTION_COST["FIFTY_TO_SEVENTY_FIVE"] = "FIFTY_TO_SEVENTY_FIVE";
    ATTRACTION_COST["OVER_SIXTY"] = "OVER_SIXTY";
    ATTRACTION_COST["OVER_SEVENTY_FIVE"] = "OVER_SEVENTY_FIVE";
})(ATTRACTION_COST || (exports.ATTRACTION_COST = ATTRACTION_COST = {}));
var BADGES;
(function (BADGES) {
    BADGES["MICHELIN_BIB_GOURMAND"] = "MICHELIN_BIB_GOURMAND";
    BADGES["MICHELIN_ONE_STAR"] = "MICHELIN_ONE_STAR";
    BADGES["MICHELIN_TWO_STAR"] = "MICHELIN_TWO_STAR";
    BADGES["MICHELIN_THREE_STAR"] = "MICHELIN_THREE_STAR";
    BADGES["TIMEOUT"] = "TIMEOUT";
    BADGES["EATER"] = "EATER";
    BADGES["INFATUATION"] = "INFATUATION";
    BADGES["THRILLIST"] = "THRILLIST";
    BADGES["CONDE_NAST"] = "CONDE_NAST";
    BADGES["TRIP_ADVISOR"] = "TRIP_ADVISOR";
    BADGES["TRAVAS_CHOICE"] = "TRAVAS_CHOICE";
})(BADGES || (exports.BADGES = BADGES = {}));
var AttractionSwipeResult;
(function (AttractionSwipeResult) {
    AttractionSwipeResult["LIKE"] = "LIKE";
    AttractionSwipeResult["DISLIKE"] = "DISLIKE";
})(AttractionSwipeResult || (exports.AttractionSwipeResult = AttractionSwipeResult = {}));
var ATTRACTION_TARGET_GROUP;
(function (ATTRACTION_TARGET_GROUP) {
    ATTRACTION_TARGET_GROUP["RAINY"] = "RAINY";
    ATTRACTION_TARGET_GROUP["COUPLE"] = "COUPLE";
    ATTRACTION_TARGET_GROUP["LARGE_GROUP"] = "LARGE_GROUP";
    ATTRACTION_TARGET_GROUP["KID"] = "KID";
    ATTRACTION_TARGET_GROUP["PET"] = "PET";
    ATTRACTION_TARGET_GROUP["BACHELOR"] = "BACHELOR";
    ATTRACTION_TARGET_GROUP["OUTDOOR"] = "OUTDOOR";
    ATTRACTION_TARGET_GROUP["VEGETARIAN"] = "VEGETARIAN";
})(ATTRACTION_TARGET_GROUP || (exports.ATTRACTION_TARGET_GROUP = ATTRACTION_TARGET_GROUP = {}));
var AUTHOR_TYPE;
(function (AUTHOR_TYPE) {
    AUTHOR_TYPE["ADMIN"] = "ADMIN";
    AUTHOR_TYPE["USER"] = "USER";
})(AUTHOR_TYPE || (exports.AUTHOR_TYPE = AUTHOR_TYPE = {}));
var ATTRACTION_BEST_VISIT_TIME;
(function (ATTRACTION_BEST_VISIT_TIME) {
    ATTRACTION_BEST_VISIT_TIME["AFTERNOON"] = "AFTERNOON";
    ATTRACTION_BEST_VISIT_TIME["BREAKFAST"] = "BREAKFAST";
    ATTRACTION_BEST_VISIT_TIME["DINNER"] = "DINNER";
    ATTRACTION_BEST_VISIT_TIME["EVENING"] = "EVENING";
    ATTRACTION_BEST_VISIT_TIME["LUNCH"] = "LUNCH";
    ATTRACTION_BEST_VISIT_TIME["MORNING"] = "MORNING";
    ATTRACTION_BEST_VISIT_TIME["NON_APPLICABLE"] = "NON_APPLICABLE";
    ATTRACTION_BEST_VISIT_TIME["SNACK"] = "SNACK";
})(ATTRACTION_BEST_VISIT_TIME || (exports.ATTRACTION_BEST_VISIT_TIME = ATTRACTION_BEST_VISIT_TIME = {}));
var CURRENCY_TYPE;
(function (CURRENCY_TYPE) {
    CURRENCY_TYPE["USD"] = "USD";
})(CURRENCY_TYPE || (exports.CURRENCY_TYPE = CURRENCY_TYPE = {}));
var ATTRACTION_COST_TYPE;
(function (ATTRACTION_COST_TYPE) {
    ATTRACTION_COST_TYPE["GROUP"] = "GROUP";
    ATTRACTION_COST_TYPE["PERSON"] = "PERSON";
})(ATTRACTION_COST_TYPE || (exports.ATTRACTION_COST_TYPE = ATTRACTION_COST_TYPE = {}));
var ATTRACTION_DURATION;
(function (ATTRACTION_DURATION) {
    ATTRACTION_DURATION["LESS_THAN_AN_HOUR"] = "LESS_THAN_AN_HOUR";
    ATTRACTION_DURATION["ONE_TWO_HOURS"] = "ONE_TWO_HOURS";
    ATTRACTION_DURATION["TWO_THREE_HOURS"] = "TWO_THREE_HOURS";
    ATTRACTION_DURATION["MORE_THAN_THREE_HOURS"] = "MORE_THAN_THREE_HOURS";
})(ATTRACTION_DURATION || (exports.ATTRACTION_DURATION = ATTRACTION_DURATION = {}));
var ATTRACTION_RESERVATION;
(function (ATTRACTION_RESERVATION) {
    ATTRACTION_RESERVATION["REQUIRED"] = "REQUIRED";
    ATTRACTION_RESERVATION["RECOMMENDED"] = "RECOMMENDED";
    ATTRACTION_RESERVATION["OPTIONAL"] = "OPTIONAL";
    ATTRACTION_RESERVATION["NOT_TAKEN"] = "NOT_TAKEN";
})(ATTRACTION_RESERVATION || (exports.ATTRACTION_RESERVATION = ATTRACTION_RESERVATION = {}));
var BusinessStatus;
(function (BusinessStatus) {
    BusinessStatus["OPERATIONAL"] = "OPERATIONAL";
    BusinessStatus["CLOSED_TEMPORARILY"] = "CLOSED_TEMPORARILY";
    BusinessStatus["CLOSED_PERMANENTLY"] = "CLOSED_PERMANENTLY";
})(BusinessStatus || (exports.BusinessStatus = BusinessStatus = {}));
var ATTRACTION_PRIVACY;
(function (ATTRACTION_PRIVACY) {
    ATTRACTION_PRIVACY["PUBLIC"] = "PUBLIC";
    ATTRACTION_PRIVACY["PRIVATE"] = "PRIVATE";
})(ATTRACTION_PRIVACY || (exports.ATTRACTION_PRIVACY = ATTRACTION_PRIVACY = {}));
var AttractionLabel;
(function (AttractionLabel) {
    AttractionLabel["ATTRACTION"] = "ATTRACTION";
})(AttractionLabel || (exports.AttractionLabel = AttractionLabel = {}));
var GenerationStep;
(function (GenerationStep) {
    GenerationStep["GET_PHOTOS"] = "GET_PHOTOS";
    GenerationStep["GET_DETAILS"] = "GET_DETAILS";
})(GenerationStep || (exports.GenerationStep = GenerationStep = {}));
var Status;
(function (Status) {
    Status["PENDING"] = "PENDING";
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["SUCCEEDED"] = "SUCCEEDED";
    Status["FAILED"] = "FAILED";
})(Status || (exports.Status = Status = {}));
var AttractionSwipeLabel;
(function (AttractionSwipeLabel) {
    AttractionSwipeLabel["SWIPE"] = "SWIPE";
})(AttractionSwipeLabel || (exports.AttractionSwipeLabel = AttractionSwipeLabel = {}));
var TripDestinationTime;
(function (TripDestinationTime) {
    TripDestinationTime["MORNING"] = "MORNING";
    TripDestinationTime["AFTERNOON"] = "AFTERNOON";
    TripDestinationTime["EVENING"] = "EVENING";
})(TripDestinationTime || (exports.TripDestinationTime = TripDestinationTime = {}));
var UserTripStatus;
(function (UserTripStatus) {
    UserTripStatus["PENDING"] = "PENDING";
    UserTripStatus["APPROVED"] = "APPROVED";
})(UserTripStatus || (exports.UserTripStatus = UserTripStatus = {}));
var TimelineEntryType;
(function (TimelineEntryType) {
    TimelineEntryType["FLIGHT"] = "FLIGHT";
    TimelineEntryType["RENTAL_PICKUP"] = "RENTAL_PICKUP";
    TimelineEntryType["RENTAL_DROPOFF"] = "RENTAL_DROPOFF";
    TimelineEntryType["LODGING_ARRIVAL"] = "LODGING_ARRIVAL";
    TimelineEntryType["LODGING_DEPARTURE"] = "LODGING_DEPARTURE";
})(TimelineEntryType || (exports.TimelineEntryType = TimelineEntryType = {}));
var MEDIA_TYPES;
(function (MEDIA_TYPES) {
    MEDIA_TYPES["IMAGE"] = "IMAGE";
    MEDIA_TYPES["VIDEO"] = "VIDEO";
})(MEDIA_TYPES || (exports.MEDIA_TYPES = MEDIA_TYPES = {}));
var PRIVACY;
(function (PRIVACY) {
    PRIVACY["PUBLIC"] = "PUBLIC";
    PRIVACY["PRIVATE"] = "PRIVATE";
})(PRIVACY || (exports.PRIVACY = PRIVACY = {}));
var REFERRAL_TYPES;
(function (REFERRAL_TYPES) {
    REFERRAL_TYPES["TRIP_INVITE"] = "TRIP_INVITE";
    REFERRAL_TYPES["PLATFORM_INVITE"] = "PLATFORM_INVITE";
    REFERRAL_TYPES["ATTRACTION_SHARE"] = "ATTRACTION_SHARE";
    REFERRAL_TYPES["POST_SHARE"] = "POST_SHARE";
})(REFERRAL_TYPES || (exports.REFERRAL_TYPES = REFERRAL_TYPES = {}));
var ModelAttributeTypes;
(function (ModelAttributeTypes) {
    ModelAttributeTypes["binary"] = "binary";
    ModelAttributeTypes["binarySet"] = "binarySet";
    ModelAttributeTypes["bool"] = "bool";
    ModelAttributeTypes["list"] = "list";
    ModelAttributeTypes["map"] = "map";
    ModelAttributeTypes["number"] = "number";
    ModelAttributeTypes["numberSet"] = "numberSet";
    ModelAttributeTypes["string"] = "string";
    ModelAttributeTypes["stringSet"] = "stringSet";
    ModelAttributeTypes["_null"] = "_null";
})(ModelAttributeTypes || (exports.ModelAttributeTypes = ModelAttributeTypes = {}));
var ModelSortDirection;
(function (ModelSortDirection) {
    ModelSortDirection["ASC"] = "ASC";
    ModelSortDirection["DESC"] = "DESC";
})(ModelSortDirection || (exports.ModelSortDirection = ModelSortDirection = {}));
var UserSessionLabel;
(function (UserSessionLabel) {
    UserSessionLabel["SESSION"] = "SESSION";
})(UserSessionLabel || (exports.UserSessionLabel = UserSessionLabel = {}));
var PLATFORM;
(function (PLATFORM) {
    PLATFORM["IOS"] = "IOS";
    PLATFORM["ANDROID"] = "ANDROID";
})(PLATFORM || (exports.PLATFORM = PLATFORM = {}));
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
    NOTIFICATION_TYPE["NEW_FOLLOW"] = "NEW_FOLLOW";
    NOTIFICATION_TYPE["FOLLOW_REQUEST_ACCEPTED"] = "FOLLOW_REQUEST_ACCEPTED";
    NOTIFICATION_TYPE["FOLLOW_REQUEST_SENT"] = "FOLLOW_REQUEST_SENT";
    NOTIFICATION_TYPE["TRIP_INVITATION_SENT"] = "TRIP_INVITATION_SENT";
    NOTIFICATION_TYPE["TRIP_INVITATION_ACCEPTED"] = "TRIP_INVITATION_ACCEPTED";
    NOTIFICATION_TYPE["JOIN_TRIP"] = "JOIN_TRIP";
    NOTIFICATION_TYPE["CREATE_CALENDAR"] = "CREATE_CALENDAR";
    NOTIFICATION_TYPE["EDIT_CALENDAR"] = "EDIT_CALENDAR";
    NOTIFICATION_TYPE["EDIT_DATES"] = "EDIT_DATES";
    NOTIFICATION_TYPE["RENAME_TRIP"] = "RENAME_TRIP";
    NOTIFICATION_TYPE["ADD_DESTINATION"] = "ADD_DESTINATION";
    NOTIFICATION_TYPE["REMOVE_DESTINATION"] = "REMOVE_DESTINATION";
    NOTIFICATION_TYPE["ADD_FLIGHT"] = "ADD_FLIGHT";
    NOTIFICATION_TYPE["ADD_LODGING"] = "ADD_LODGING";
    NOTIFICATION_TYPE["ADD_CAR_RENTAL"] = "ADD_CAR_RENTAL";
    NOTIFICATION_TYPE["REMOVE_FLIGHT"] = "REMOVE_FLIGHT";
    NOTIFICATION_TYPE["REMOVE_LODGING"] = "REMOVE_LODGING";
    NOTIFICATION_TYPE["REMOVE_CAR_RENTAL"] = "REMOVE_CAR_RENTAL";
    NOTIFICATION_TYPE["RECALCULATE_CALENDAR"] = "RECALCULATE_CALENDAR";
    NOTIFICATION_TYPE["INVITE_MEMBER"] = "INVITE_MEMBER";
    NOTIFICATION_TYPE["REMOVE_MEMBER"] = "REMOVE_MEMBER";
    NOTIFICATION_TYPE["LEAVE_TRIP"] = "LEAVE_TRIP";
    NOTIFICATION_TYPE["USER_MESSAGE"] = "USER_MESSAGE";
    NOTIFICATION_TYPE["LIKE_POST"] = "LIKE_POST";
    NOTIFICATION_TYPE["COMMENT_POST"] = "COMMENT_POST";
    NOTIFICATION_TYPE["BUCKET_LIST_ATTRACTION"] = "BUCKET_LIST_ATTRACTION";
    NOTIFICATION_TYPE["REFERRAL_JOINED"] = "REFERRAL_JOINED";
    NOTIFICATION_TYPE["REFERRAL_ONBOARDING"] = "REFERRAL_ONBOARDING";
})(NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE = {}));
var SearchableUserSortableFields;
(function (SearchableUserSortableFields) {
    SearchableUserSortableFields["id"] = "id";
    SearchableUserSortableFields["appleId"] = "appleId";
    SearchableUserSortableFields["dateOfBirth"] = "dateOfBirth";
    SearchableUserSortableFields["description"] = "description";
    SearchableUserSortableFields["email"] = "email";
    SearchableUserSortableFields["contactEmail"] = "contactEmail";
    SearchableUserSortableFields["facebookId"] = "facebookId";
    SearchableUserSortableFields["fcmToken"] = "fcmToken";
    SearchableUserSortableFields["googleId"] = "googleId";
    SearchableUserSortableFields["location"] = "location";
    SearchableUserSortableFields["name"] = "name";
    SearchableUserSortableFields["phone"] = "phone";
    SearchableUserSortableFields["pushNotifications"] = "pushNotifications";
    SearchableUserSortableFields["referralLink"] = "referralLink";
    SearchableUserSortableFields["username"] = "username";
    SearchableUserSortableFields["createdAt"] = "createdAt";
    SearchableUserSortableFields["updatedAt"] = "updatedAt";
})(SearchableUserSortableFields || (exports.SearchableUserSortableFields = SearchableUserSortableFields = {}));
var SearchableSortDirection;
(function (SearchableSortDirection) {
    SearchableSortDirection["asc"] = "asc";
    SearchableSortDirection["desc"] = "desc";
})(SearchableSortDirection || (exports.SearchableSortDirection = SearchableSortDirection = {}));
var SearchableAggregateType;
(function (SearchableAggregateType) {
    SearchableAggregateType["terms"] = "terms";
    SearchableAggregateType["avg"] = "avg";
    SearchableAggregateType["min"] = "min";
    SearchableAggregateType["max"] = "max";
    SearchableAggregateType["sum"] = "sum";
})(SearchableAggregateType || (exports.SearchableAggregateType = SearchableAggregateType = {}));
var SearchableUserAggregateField;
(function (SearchableUserAggregateField) {
    SearchableUserAggregateField["id"] = "id";
    SearchableUserAggregateField["appleId"] = "appleId";
    SearchableUserAggregateField["dateOfBirth"] = "dateOfBirth";
    SearchableUserAggregateField["description"] = "description";
    SearchableUserAggregateField["email"] = "email";
    SearchableUserAggregateField["contactEmail"] = "contactEmail";
    SearchableUserAggregateField["facebookId"] = "facebookId";
    SearchableUserAggregateField["fcmToken"] = "fcmToken";
    SearchableUserAggregateField["googleId"] = "googleId";
    SearchableUserAggregateField["location"] = "location";
    SearchableUserAggregateField["name"] = "name";
    SearchableUserAggregateField["phone"] = "phone";
    SearchableUserAggregateField["privacy"] = "privacy";
    SearchableUserAggregateField["pushNotifications"] = "pushNotifications";
    SearchableUserAggregateField["referralLink"] = "referralLink";
    SearchableUserAggregateField["username"] = "username";
    SearchableUserAggregateField["createdAt"] = "createdAt";
    SearchableUserAggregateField["updatedAt"] = "updatedAt";
})(SearchableUserAggregateField || (exports.SearchableUserAggregateField = SearchableUserAggregateField = {}));
var BUCKET_LIST_ACTION_INPUT;
(function (BUCKET_LIST_ACTION_INPUT) {
    BUCKET_LIST_ACTION_INPUT["ADD"] = "ADD";
    BUCKET_LIST_ACTION_INPUT["REMOVE"] = "REMOVE";
})(BUCKET_LIST_ACTION_INPUT || (exports.BUCKET_LIST_ACTION_INPUT = BUCKET_LIST_ACTION_INPUT = {}));
var LIKE_DISLIKE_ACTION_INPUT;
(function (LIKE_DISLIKE_ACTION_INPUT) {
    LIKE_DISLIKE_ACTION_INPUT["ADD"] = "ADD";
    LIKE_DISLIKE_ACTION_INPUT["REMOVE"] = "REMOVE";
})(LIKE_DISLIKE_ACTION_INPUT || (exports.LIKE_DISLIKE_ACTION_INPUT = LIKE_DISLIKE_ACTION_INPUT = {}));
var TeaRexLabel;
(function (TeaRexLabel) {
    TeaRexLabel["User"] = "User";
    TeaRexLabel["Post"] = "Post";
    TeaRexLabel["Attraction"] = "Attraction";
})(TeaRexLabel || (exports.TeaRexLabel = TeaRexLabel = {}));
var TeaRexEventLabel;
(function (TeaRexEventLabel) {
    TeaRexEventLabel["WATCHED"] = "WATCHED";
    TeaRexEventLabel["SWIPE"] = "SWIPE";
})(TeaRexEventLabel || (exports.TeaRexEventLabel = TeaRexEventLabel = {}));
var BACKEND_ENV_NAME;
(function (BACKEND_ENV_NAME) {
    BACKEND_ENV_NAME["RN"] = "RN";
    BACKEND_ENV_NAME["DIMA"] = "DIMA";
    BACKEND_ENV_NAME["NICK"] = "NICK";
    BACKEND_ENV_NAME["NEAL"] = "NEAL";
    BACKEND_ENV_NAME["ANAY"] = "ANAY";
    BACKEND_ENV_NAME["DEV"] = "DEV";
    BACKEND_ENV_NAME["STAGING"] = "STAGING";
    BACKEND_ENV_NAME["PROD"] = "PROD";
})(BACKEND_ENV_NAME || (exports.BACKEND_ENV_NAME = BACKEND_ENV_NAME = {}));
var OPERATION_TYPE;
(function (OPERATION_TYPE) {
    OPERATION_TYPE["INSERT"] = "INSERT";
    OPERATION_TYPE["PUT"] = "PUT";
})(OPERATION_TYPE || (exports.OPERATION_TYPE = OPERATION_TYPE = {}));
var FeatureFlagName;
(function (FeatureFlagName) {
    FeatureFlagName["MAINTENANCE_MODE"] = "MAINTENANCE_MODE";
})(FeatureFlagName || (exports.FeatureFlagName = FeatureFlagName = {}));
var MinimumVersionName;
(function (MinimumVersionName) {
    MinimumVersionName["MINIMUM_VERSION_REQUIRED"] = "MINIMUM_VERSION_REQUIRED";
})(MinimumVersionName || (exports.MinimumVersionName = MinimumVersionName = {}));
var UpdateType;
(function (UpdateType) {
    UpdateType["DESTINATION_NEARBY_ATTRACTION_COUNT"] = "DESTINATION_NEARBY_ATTRACTION_COUNT";
})(UpdateType || (exports.UpdateType = UpdateType = {}));
var Parity;
(function (Parity) {
    Parity["ODD"] = "ODD";
    Parity["EVEN"] = "EVEN";
    Parity["ALL"] = "ALL";
})(Parity || (exports.Parity = Parity = {}));
var SHARED_POST_ERROR_TYPE;
(function (SHARED_POST_ERROR_TYPE) {
    SHARED_POST_ERROR_TYPE["PRIVATE_POST"] = "PRIVATE_POST";
    SHARED_POST_ERROR_TYPE["POST_DELETED"] = "POST_DELETED";
    SHARED_POST_ERROR_TYPE["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    SHARED_POST_ERROR_TYPE["BLOCKED_USER"] = "BLOCKED_USER";
    SHARED_POST_ERROR_TYPE["BLOCKED_AUTHOR"] = "BLOCKED_AUTHOR";
})(SHARED_POST_ERROR_TYPE || (exports.SHARED_POST_ERROR_TYPE = SHARED_POST_ERROR_TYPE = {}));
var SearchableAttractionSortableFields;
(function (SearchableAttractionSortableFields) {
    SearchableAttractionSortableFields["id"] = "id";
    SearchableAttractionSortableFields["authorId"] = "authorId";
    SearchableAttractionSortableFields["costNote"] = "costNote";
    SearchableAttractionSortableFields["descriptionLong"] = "descriptionLong";
    SearchableAttractionSortableFields["descriptionShort"] = "descriptionShort";
    SearchableAttractionSortableFields["destinationId"] = "destinationId";
    SearchableAttractionSortableFields["name"] = "name";
    SearchableAttractionSortableFields["reservationNote"] = "reservationNote";
    SearchableAttractionSortableFields["isTravaCreated"] = "isTravaCreated";
    SearchableAttractionSortableFields["deletedAt"] = "deletedAt";
    SearchableAttractionSortableFields["bucketListCount"] = "bucketListCount";
    SearchableAttractionSortableFields["rank"] = "rank";
    SearchableAttractionSortableFields["createdAt"] = "createdAt";
    SearchableAttractionSortableFields["updatedAt"] = "updatedAt";
    SearchableAttractionSortableFields["pendingMigration"] = "pendingMigration";
})(SearchableAttractionSortableFields || (exports.SearchableAttractionSortableFields = SearchableAttractionSortableFields = {}));
var SearchableAttractionAggregateField;
(function (SearchableAttractionAggregateField) {
    SearchableAttractionAggregateField["id"] = "id";
    SearchableAttractionAggregateField["attractionCategories"] = "attractionCategories";
    SearchableAttractionAggregateField["attractionCuisine"] = "attractionCuisine";
    SearchableAttractionAggregateField["attractionTargetGroups"] = "attractionTargetGroups";
    SearchableAttractionAggregateField["authorId"] = "authorId";
    SearchableAttractionAggregateField["authorType"] = "authorType";
    SearchableAttractionAggregateField["bestVisited"] = "bestVisited";
    SearchableAttractionAggregateField["costCurrency"] = "costCurrency";
    SearchableAttractionAggregateField["cost"] = "cost";
    SearchableAttractionAggregateField["costNote"] = "costNote";
    SearchableAttractionAggregateField["costType"] = "costType";
    SearchableAttractionAggregateField["descriptionLong"] = "descriptionLong";
    SearchableAttractionAggregateField["descriptionShort"] = "descriptionShort";
    SearchableAttractionAggregateField["destinationId"] = "destinationId";
    SearchableAttractionAggregateField["duration"] = "duration";
    SearchableAttractionAggregateField["reservation"] = "reservation";
    SearchableAttractionAggregateField["name"] = "name";
    SearchableAttractionAggregateField["reservationNote"] = "reservationNote";
    SearchableAttractionAggregateField["type"] = "type";
    SearchableAttractionAggregateField["isTravaCreated"] = "isTravaCreated";
    SearchableAttractionAggregateField["deletedAt"] = "deletedAt";
    SearchableAttractionAggregateField["privacy"] = "privacy";
    SearchableAttractionAggregateField["bucketListCount"] = "bucketListCount";
    SearchableAttractionAggregateField["rank"] = "rank";
    SearchableAttractionAggregateField["label"] = "label";
    SearchableAttractionAggregateField["createdAt"] = "createdAt";
    SearchableAttractionAggregateField["updatedAt"] = "updatedAt";
    SearchableAttractionAggregateField["recommendationBadges"] = "recommendationBadges";
    SearchableAttractionAggregateField["pendingMigration"] = "pendingMigration";
})(SearchableAttractionAggregateField || (exports.SearchableAttractionAggregateField = SearchableAttractionAggregateField = {}));
var SearchableDestinationSortableFields;
(function (SearchableDestinationSortableFields) {
    SearchableDestinationSortableFields["id"] = "id";
    SearchableDestinationSortableFields["authorId"] = "authorId";
    SearchableDestinationSortableFields["name"] = "name";
    SearchableDestinationSortableFields["icon"] = "icon";
    SearchableDestinationSortableFields["timezone"] = "timezone";
    SearchableDestinationSortableFields["nearbyThingsToDoCount"] = "nearbyThingsToDoCount";
    SearchableDestinationSortableFields["nearbyPlacesToEatCount"] = "nearbyPlacesToEatCount";
    SearchableDestinationSortableFields["nearbyTravaThingsToDoCount"] = "nearbyTravaThingsToDoCount";
    SearchableDestinationSortableFields["nearbyTravaPlacesToEatCount"] = "nearbyTravaPlacesToEatCount";
    SearchableDestinationSortableFields["state"] = "state";
    SearchableDestinationSortableFields["country"] = "country";
    SearchableDestinationSortableFields["continent"] = "continent";
    SearchableDestinationSortableFields["deletedAt"] = "deletedAt";
    SearchableDestinationSortableFields["isTravaCreated"] = "isTravaCreated";
    SearchableDestinationSortableFields["googlePlaceId"] = "googlePlaceId";
    SearchableDestinationSortableFields["featured"] = "featured";
    SearchableDestinationSortableFields["altName"] = "altName";
    SearchableDestinationSortableFields["label"] = "label";
    SearchableDestinationSortableFields["pendingMigration"] = "pendingMigration";
    SearchableDestinationSortableFields["createdAt"] = "createdAt";
    SearchableDestinationSortableFields["updatedAt"] = "updatedAt";
})(SearchableDestinationSortableFields || (exports.SearchableDestinationSortableFields = SearchableDestinationSortableFields = {}));
var SearchableDestinationAggregateField;
(function (SearchableDestinationAggregateField) {
    SearchableDestinationAggregateField["id"] = "id";
    SearchableDestinationAggregateField["authorId"] = "authorId";
    SearchableDestinationAggregateField["name"] = "name";
    SearchableDestinationAggregateField["icon"] = "icon";
    SearchableDestinationAggregateField["timezone"] = "timezone";
    SearchableDestinationAggregateField["nearbyThingsToDoCount"] = "nearbyThingsToDoCount";
    SearchableDestinationAggregateField["nearbyPlacesToEatCount"] = "nearbyPlacesToEatCount";
    SearchableDestinationAggregateField["nearbyTravaThingsToDoCount"] = "nearbyTravaThingsToDoCount";
    SearchableDestinationAggregateField["nearbyTravaPlacesToEatCount"] = "nearbyTravaPlacesToEatCount";
    SearchableDestinationAggregateField["state"] = "state";
    SearchableDestinationAggregateField["country"] = "country";
    SearchableDestinationAggregateField["continent"] = "continent";
    SearchableDestinationAggregateField["deletedAt"] = "deletedAt";
    SearchableDestinationAggregateField["isTravaCreated"] = "isTravaCreated";
    SearchableDestinationAggregateField["googlePlaceId"] = "googlePlaceId";
    SearchableDestinationAggregateField["featured"] = "featured";
    SearchableDestinationAggregateField["altName"] = "altName";
    SearchableDestinationAggregateField["label"] = "label";
    SearchableDestinationAggregateField["pendingMigration"] = "pendingMigration";
    SearchableDestinationAggregateField["createdAt"] = "createdAt";
    SearchableDestinationAggregateField["updatedAt"] = "updatedAt";
})(SearchableDestinationAggregateField || (exports.SearchableDestinationAggregateField = SearchableDestinationAggregateField = {}));
var PROVIDER;
(function (PROVIDER) {
    PROVIDER["NONE"] = "NONE";
    PROVIDER["FACEBOOK"] = "FACEBOOK";
    PROVIDER["GOOGLE"] = "GOOGLE";
    PROVIDER["APPLE"] = "APPLE";
})(PROVIDER || (exports.PROVIDER = PROVIDER = {}));
