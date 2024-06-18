/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GetExploreVotingListInput = {
  tripId: string,
  destinationId: string,
  destinationCoords: CoordsInput,
  searchString?: string | null,
  attractionType?: ATTRACTION_TYPE | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  distanceType: DistanceType,
  isViewingMyRecentVotes: boolean,
  destinationDates?: Array< string > | null,
  excludeAttractionIds?: Array< string | null > | null,
  selectedAttractionId?: string | null,
  pageSize?: number | null,
};

export type CoordsInput = {
  long: number,
  lat: number,
};

export enum ATTRACTION_TYPE {
  DO = "DO",
  EAT = "EAT",
}


export enum ATTRACTION_CATEGORY_TYPE {
  ACTION_AND_ADVENTURE = "ACTION_AND_ADVENTURE",
  ARTS_AND_CULTURE = "ARTS_AND_CULTURE",
  ENTERTAINMENT = "ENTERTAINMENT",
  LEISURE = "LEISURE",
  NATURE = "NATURE",
  NIGHTLIFE_AND_DRINKING = "NIGHTLIFE_AND_DRINKING",
  NON_APPLICABLE = "NON_APPLICABLE",
  SHOPPING = "SHOPPING",
  SIGHTS_AND_LANDMARKS = "SIGHTS_AND_LANDMARKS",
}


export enum ATTRACTION_CUISINE_TYPE {
  AFRICAN = "AFRICAN",
  AMERICAN_NEW = "AMERICAN_NEW",
  AMERICAN_TRADITIONAL = "AMERICAN_TRADITIONAL",
  BAKERY = "BAKERY",
  BARBEQUE = "BARBEQUE",
  BREAKFAST = "BREAKFAST",
  BRUNCH = "BRUNCH",
  BURGERS = "BURGERS",
  CAJUN_CREOLE = "CAJUN_CREOLE",
  CARIBBEAN = "CARIBBEAN",
  CHINESE = "CHINESE",
  COFFEE_AND_TEA = "COFFEE_AND_TEA",
  CUBAN = "CUBAN",
  EUROPEAN = "EUROPEAN",
  FARMERS_MARKET = "FARMERS_MARKET",
  FAST_FOOD = "FAST_FOOD",
  FINE_DINING = "FINE_DINING",
  FOOD_HALL = "FOOD_HALL",
  FRENCH = "FRENCH",
  FUSION = "FUSION",
  GERMAN = "GERMAN",
  GREEK = "GREEK",
  HAWAIIAN = "HAWAIIAN",
  ICE_CREAM_AND_DESSERTS = "ICE_CREAM_AND_DESSERTS",
  INDIAN = "INDIAN",
  ITALIAN = "ITALIAN",
  JAPANESE = "JAPANESE",
  KOREAN = "KOREAN",
  LATIN_AMERICAN = "LATIN_AMERICAN",
  MEDITERRANEAN = "MEDITERRANEAN",
  MEXICAN = "MEXICAN",
  MIDDLE_EASTERN = "MIDDLE_EASTERN",
  MODERN = "MODERN",
  OTHER = "OTHER",
  PERUVIAN = "PERUVIAN",
  PIZZA = "PIZZA",
  PUB = "PUB",
  SANDWICHES = "SANDWICHES",
  SEAFOOD = "SEAFOOD",
  SOUL = "SOUL",
  SOUTHERN = "SOUTHERN",
  SOUTHWESTERN = "SOUTHWESTERN",
  STEAKHOUSE = "STEAKHOUSE",
  SUSHI = "SUSHI",
  SPANISH = "SPANISH",
  TAPAS_AND_SMALL_PLATES = "TAPAS_AND_SMALL_PLATES",
  TEX = "TEX",
  THAI = "THAI",
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  VIETNAMESE = "VIETNAMESE",
}


export enum DistanceType {
  NEARBY = "NEARBY",
  FARTHER_AWAY = "FARTHER_AWAY",
}


export type GetExploreVotingListResponse = {
  __typename: "GetExploreVotingListResponse",
  attractions:  Array<ExploreVotingListItem >,
  nextPageExists: boolean,
  votedOnAttractionIds: Array< string >,
};

export type ExploreVotingListItem = {
  __typename: "ExploreVotingListItem",
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  cost?: ATTRACTION_COST | null,
  descriptionShort: string,
  id: string,
  image?: S3Object | null,
  inMyBucketList: boolean,
  inSeason: boolean,
  name: string,
  rating?: Rating | null,
  recommendationBadges?: Array< BADGES | null > | null,
  swipes?:  Array<ExploreVotingListSwipe | null > | null,
  type: ATTRACTION_TYPE,
};

export enum ATTRACTION_COST {
  FREE = "FREE",
  UNDER_TEN = "UNDER_TEN",
  UNDER_TWENTY_FIVE = "UNDER_TWENTY_FIVE",
  TEN_TO_THIRTY = "TEN_TO_THIRTY",
  TWENTY_FIVE_TO_FIFTY = "TWENTY_FIVE_TO_FIFTY",
  THIRTY_TO_SIXTY = "THIRTY_TO_SIXTY",
  FIFTY_TO_SEVENTY_FIVE = "FIFTY_TO_SEVENTY_FIVE",
  OVER_SIXTY = "OVER_SIXTY",
  OVER_SEVENTY_FIVE = "OVER_SEVENTY_FIVE",
}


export type S3Object = {
  __typename: "S3Object",
  bucket: string,
  region: string,
  key: string,
  googlePhotoReference?: string | null,
};

export type Rating = {
  __typename: "Rating",
  score?: number | null,
  count?: number | null,
};

export enum BADGES {
  MICHELIN_BIB_GOURMAND = "MICHELIN_BIB_GOURMAND",
  MICHELIN_ONE_STAR = "MICHELIN_ONE_STAR",
  MICHELIN_TWO_STAR = "MICHELIN_TWO_STAR",
  MICHELIN_THREE_STAR = "MICHELIN_THREE_STAR",
  TIMEOUT = "TIMEOUT",
  EATER = "EATER",
  INFATUATION = "INFATUATION",
  THRILLIST = "THRILLIST",
  CONDE_NAST = "CONDE_NAST",
  TRIP_ADVISOR = "TRIP_ADVISOR",
  TRAVAS_CHOICE = "TRAVAS_CHOICE",
}


export type ExploreVotingListSwipe = {
  __typename: "ExploreVotingListSwipe",
  result: AttractionSwipeResult,
  createdAt: string,
  authorAvatar?: S3Object | null,
  authorId: string,
};

export enum AttractionSwipeResult {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}


export type User = {
  __typename: "User",
  id: string,
  appleId?: string | null,
  avatar?: S3Object | null,
  dateOfBirth?: string | null,
  description?: string | null,
  email?: string | null,
  contactEmail?: string | null,
  facebookId?: string | null,
  fcmToken?: string | null,
  followedBy?: ModelUserFollowConnection | null,
  follows?: ModelUserFollowConnection | null,
  blocks?: ModelUserBlockConnection | null,
  blockedBy?: ModelUserBlockConnection | null,
  posts?: ModelPostConnection | null,
  viewedPosts?: ModelUserPostConnection | null,
  googleId?: string | null,
  location?: string | null,
  name?: string | null,
  phone?: string | null,
  privacy?: PRIVACY | null,
  pushNotifications?: boolean | null,
  referralLink?: string | null,
  referrals?: ModelUserReferralConnection | null,
  userFollowByMe?: UserFollow | null,
  username?: string | null,
  userTrips?: ModelUserTripConnection | null,
  myCards?: ModelAttractionConnection | null,
  bucketList?: ModelUserAttractionConnection | null,
  likedPosts?: ModelUserPostLikeConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserFollowConnection = {
  __typename: "ModelUserFollowConnection",
  items:  Array<UserFollow | null >,
  nextToken?: string | null,
};

export type UserFollow = {
  __typename: "UserFollow",
  userId: string,
  user?: User | null,
  followedUserId: string,
  followedUser?: User | null,
  approved: boolean,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserBlockConnection = {
  __typename: "ModelUserBlockConnection",
  items:  Array<UserBlock | null >,
  nextToken?: string | null,
};

export type UserBlock = {
  __typename: "UserBlock",
  userId: string,
  user?: User | null,
  blockedUserId: string,
  blockedUser?: User | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
};

export type Post = {
  __typename: "Post",
  id: string,
  userId: string,
  user?: User | null,
  tripId: string,
  trip?: Trip | null,
  destinationId?: string | null,
  destination?: Destination | null,
  attractionId?: string | null,
  attraction?: Attraction | null,
  description?: string | null,
  commentsCount: number,
  comments?: ModelCommentConnection | null,
  mediaType: MEDIA_TYPES,
  cloudinaryUrl: string,
  width: number,
  height: number,
  format?: string | null,
  videoDuration?: number | null,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string | null,
  likesCount: number,
};

export type Trip = {
  __typename: "Trip",
  id: string,
  name: string,
  tripDestinations?: ModelTripDestinationConnection | null,
  members?: ModelUserTripConnection | null,
  attractionSwipes?: ModelAttractionSwipeConnection | null,
  attractionSwipesByUser?: ModelAttractionSwipeConnection | null,
  timelineEntries?: ModelTimelineEntryConnection | null,
  completed?: boolean | null,
  messages?: ModelMessageConnection | null,
  link?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTripDestinationConnection = {
  __typename: "ModelTripDestinationConnection",
  items:  Array<TripDestination | null >,
  nextToken?: string | null,
};

export type TripDestination = {
  __typename: "TripDestination",
  tripId: string,
  destinationId: string,
  attractionSwipes?: ModelAttractionSwipeConnection | null,
  destination?: Destination | null,
  startDate?: number | null,
  endDate?: number | null,
  startTime?: TripDestinationTime | null,
  endTime?: TripDestinationTime | null,
  tripPlan?:  Array<TripPlanDay | null > | null,
  tripDestinationUsers?: ModelTripDestinationUserConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelAttractionSwipeConnection = {
  __typename: "ModelAttractionSwipeConnection",
  items:  Array<AttractionSwipe | null >,
  nextToken?: string | null,
};

export type AttractionSwipe = {
  __typename: "AttractionSwipe",
  userId: string,
  user?: User | null,
  tripId: string,
  destinationId: string,
  destination?: Destination | null,
  attractionId: string,
  attraction?: Attraction | null,
  swipe: AttractionSwipeResult,
  label: AttractionSwipeLabel,
  createdAt: string,
  updatedAt: string,
};

export type Destination = {
  __typename: "Destination",
  id: string,
  author?: User | null,
  authorId?: string | null,
  name: string,
  icon?: string | null,
  coverImage?: S3Object | null,
  timezone?: string | null,
  attractions?: ModelAttractionConnection | null,
  nearbyThingsToDoCount?: number | null,
  nearbyPlacesToEatCount?: number | null,
  nearbyTravaThingsToDoCount?: number | null,
  nearbyTravaPlacesToEatCount?: number | null,
  coords: Coords,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  deletedAt?: string | null,
  isTravaCreated: number,
  googlePlaceId?: string | null,
  featured?: boolean | null,
  altName?: string | null,
  label: string,
  pendingMigration?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelAttractionConnection = {
  __typename: "ModelAttractionConnection",
  items:  Array<Attraction | null >,
  nextToken?: string | null,
};

export type Attraction = {
  __typename: "Attraction",
  id: string,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
  author?: User | null,
  authorId?: string | null,
  authorType: AUTHOR_TYPE,
  bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  costCurrency: CURRENCY_TYPE,
  cost?: ATTRACTION_COST | null,
  costNote?: string | null,
  costType: ATTRACTION_COST_TYPE,
  descriptionLong: string,
  descriptionShort: string,
  destination?: Destination | null,
  destinationId: string,
  duration?: ATTRACTION_DURATION | null,
  images?:  Array<S3Object | null > | null,
  reservation?: ATTRACTION_RESERVATION | null,
  locations?:  Array<StartEndLocation | null > | null,
  name: string,
  reservationNote?: string | null,
  type: ATTRACTION_TYPE,
  isTravaCreated: number,
  deletedAt?: string | null,
  privacy: ATTRACTION_PRIVACY,
  bucketListCount: number,
  rank?: number | null,
  seasons?:  Array<AttractionSeason | null > | null,
  label: AttractionLabel,
  createdAt: string,
  updatedAt?: string | null,
  recommendationBadges?: Array< BADGES | null > | null,
  generation?: Generation | null,
  pendingMigration?: boolean | null,
  viatorProducts?: ModelViatorProductConnection | null,
};

export enum ATTRACTION_TARGET_GROUP {
  RAINY = "RAINY",
  COUPLE = "COUPLE",
  LARGE_GROUP = "LARGE_GROUP",
  KID = "KID",
  PET = "PET",
  BACHELOR = "BACHELOR",
  OUTDOOR = "OUTDOOR",
  VEGETARIAN = "VEGETARIAN",
}


export enum AUTHOR_TYPE {
  ADMIN = "ADMIN",
  USER = "USER",
}


export enum ATTRACTION_BEST_VISIT_TIME {
  AFTERNOON = "AFTERNOON",
  BREAKFAST = "BREAKFAST",
  DINNER = "DINNER",
  EVENING = "EVENING",
  LUNCH = "LUNCH",
  MORNING = "MORNING",
  NON_APPLICABLE = "NON_APPLICABLE",
  SNACK = "SNACK",
}


export enum CURRENCY_TYPE {
  USD = "USD",
}


export enum ATTRACTION_COST_TYPE {
  GROUP = "GROUP",
  PERSON = "PERSON",
}


export enum ATTRACTION_DURATION {
  LESS_THAN_AN_HOUR = "LESS_THAN_AN_HOUR",
  ONE_TWO_HOURS = "ONE_TWO_HOURS",
  TWO_THREE_HOURS = "TWO_THREE_HOURS",
  MORE_THAN_THREE_HOURS = "MORE_THAN_THREE_HOURS",
}


export enum ATTRACTION_RESERVATION {
  REQUIRED = "REQUIRED",
  RECOMMENDED = "RECOMMENDED",
  OPTIONAL = "OPTIONAL",
  NOT_TAKEN = "NOT_TAKEN",
}


export type StartEndLocation = {
  __typename: "StartEndLocation",
  id: string,
  displayOrder: number,
  deleted?: boolean | null,
  startLoc: Location,
  endLoc: Location,
};

export type Location = {
  __typename: "Location",
  id: string,
  googlePlaceId: string,
  googlePlace: GooglePlace,
  timezone?: string | null,
};

export type GooglePlace = {
  __typename: "GooglePlace",
  id: string,
  isValid: number,
  data: PlaceData,
  consecutiveFailedRequests?: number | null,
  dataLastCheckedAt?: string | null,
  dataLastUpdatedAt?: string | null,
  webData?: PlaceWebData | null,
  yelpData?: YelpData | null,
  generatedSummary?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type PlaceData = {
  __typename: "PlaceData",
  coords: Coords,
  city?: string | null,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  name?: string | null,
  formattedAddress?: string | null,
  googlePlacePageLink?: string | null,
  websiteLink?: string | null,
  phone?: string | null,
  hours?: Hours | null,
  businessStatus?: BusinessStatus | null,
  rating?: Rating | null,
  mealServices?: MealServices | null,
  photos?:  Array<PlacePhoto | null > | null,
  reservable?: boolean | null,
  price?: number | null,
  reviews?:  Array<Review | null > | null,
  editorialSummary?: string | null,
  types?: Array< string | null > | null,
};

export type Coords = {
  __typename: "Coords",
  long: number,
  lat: number,
};

export type Hours = {
  __typename: "Hours",
  weekdayText: Array< string >,
  periods:  Array<Period >,
};

export type Period = {
  __typename: "Period",
  open: OpenCloseTime,
  close?: OpenCloseTime | null,
};

export type OpenCloseTime = {
  __typename: "OpenCloseTime",
  day: number,
  time: string,
};

export enum BusinessStatus {
  OPERATIONAL = "OPERATIONAL",
  CLOSED_TEMPORARILY = "CLOSED_TEMPORARILY",
  CLOSED_PERMANENTLY = "CLOSED_PERMANENTLY",
}


export type MealServices = {
  __typename: "MealServices",
  servesBreakfast?: boolean | null,
  servesBrunch?: boolean | null,
  servesLunch?: boolean | null,
  servesDinner?: boolean | null,
  dineIn?: boolean | null,
  takeout?: boolean | null,
  delivery?: boolean | null,
  servesBeer?: boolean | null,
  servesWine?: boolean | null,
  servesVegetarianFood?: boolean | null,
};

export type PlacePhoto = {
  __typename: "PlacePhoto",
  photo_reference?: string | null,
  height?: number | null,
  width?: number | null,
  html_attributions?: Array< string | null > | null,
};

export type Review = {
  __typename: "Review",
  authorName?: string | null,
  authorUrl?: string | null,
  language?: string | null,
  originalLanguage?: string | null,
  profilePhotoUrl?: string | null,
  rating?: number | null,
  relativeTimeDescription?: string | null,
  text?: string | null,
  time?: string | null,
  translated?: boolean | null,
};

export type PlaceWebData = {
  __typename: "PlaceWebData",
  menuLink?: string | null,
  reservationLink?: string | null,
  popularTimes?: DayData | null,
  bestVisitedByPopularTimes?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  aboutBusiness?: AboutBusiness | null,
  reviews?:  Array<Review | null > | null,
};

export type DayData = {
  __typename: "DayData",
  Sunday?: HourlyData | null,
  Monday?: HourlyData | null,
  Tuesday?: HourlyData | null,
  Wednesday?: HourlyData | null,
  Thursday?: HourlyData | null,
  Friday?: HourlyData | null,
  Saturday?: HourlyData | null,
};

export type HourlyData = {
  __typename: "HourlyData",
  hours:  Array<HourData >,
};

export type HourData = {
  __typename: "HourData",
  hour: number,
  value: number,
};

export type AboutBusiness = {
  __typename: "AboutBusiness",
  fromTheBusiness?:  Array<InfoItem | null > | null,
  serviceOptions?:  Array<InfoItem | null > | null,
  highlights?:  Array<InfoItem | null > | null,
  popularFor?:  Array<InfoItem | null > | null,
  accessibility?:  Array<InfoItem | null > | null,
  offerings?:  Array<InfoItem | null > | null,
  diningOptions?:  Array<InfoItem | null > | null,
  amenities?:  Array<InfoItem | null > | null,
  atmosphere?:  Array<InfoItem | null > | null,
  crowd?:  Array<InfoItem | null > | null,
  children?:  Array<InfoItem | null > | null,
  planning?:  Array<InfoItem | null > | null,
  payments?:  Array<InfoItem | null > | null,
};

export type InfoItem = {
  __typename: "InfoItem",
  name: string,
  affirmative?: boolean | null,
  negative?: boolean | null,
};

export type YelpData = {
  __typename: "YelpData",
  id?: string | null,
  url?: string | null,
  amenities?:  Array<InfoItem | null > | null,
  price?: number | null,
  categories?: Array< string | null > | null,
  reviews?:  Array<Review | null > | null,
};

export enum ATTRACTION_PRIVACY {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}


export type AttractionSeason = {
  __typename: "AttractionSeason",
  startMonth?: number | null,
  startDay?: number | null,
  endMonth?: number | null,
  endDay?: number | null,
};

export enum AttractionLabel {
  ATTRACTION = "ATTRACTION",
}


export type Generation = {
  __typename: "Generation",
  step: GenerationStep,
  status: Status,
  lastUpdatedAt: string,
  failureCount?: number | null,
  lastFailureReason?: string | null,
};

export enum GenerationStep {
  GET_PHOTOS = "GET_PHOTOS",
  GET_DETAILS = "GET_DETAILS",
}


export enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}


export type ModelViatorProductConnection = {
  __typename: "ModelViatorProductConnection",
  items:  Array<ViatorProduct | null >,
  nextToken?: string | null,
};

export type ViatorProduct = {
  __typename: "ViatorProduct",
  id: string,
  attractionId: string,
  viatorLink: string,
  name: string,
  priceText: string,
  rating: Rating,
  coverImageUrl: string,
  displayOrder: number,
  duration?: string | null,
  pricing?: string | null,
  currency?: string | null,
  createdAt: string,
  updatedAt: string,
};

export enum AttractionSwipeLabel {
  SWIPE = "SWIPE",
}


export enum TripDestinationTime {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
}


export type TripPlanDay = {
  __typename: "TripPlanDay",
  dayOfYear: number,
  tripPlanDayItems:  Array<TripPlanDayItem | null >,
};

export type TripPlanDayItem = {
  __typename: "TripPlanDayItem",
  attractionId: string,
  locId: string,
  attraction?: Attraction | null,
};

export type ModelTripDestinationUserConnection = {
  __typename: "ModelTripDestinationUserConnection",
  items:  Array<TripDestinationUser | null >,
  nextToken?: string | null,
};

export type TripDestinationUser = {
  __typename: "TripDestinationUser",
  tripId: string,
  destinationId: string,
  destination?: Destination | null,
  userId: string,
  user?: User | null,
  isReady: boolean,
  tripPlanViewedAt?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserTripConnection = {
  __typename: "ModelUserTripConnection",
  items:  Array<UserTrip | null >,
  nextToken?: string | null,
};

export type UserTrip = {
  __typename: "UserTrip",
  userId: string,
  user?: User | null,
  tripId: string,
  trip?: Trip | null,
  status: UserTripStatus,
  invitedByUserId: string,
  invitedByUser?: User | null,
  inviteLink?: string | null,
  lastMessageReadDate?: string | null,
  createdAt: string,
  updatedAt: string,
};

export enum UserTripStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}


export type ModelTimelineEntryConnection = {
  __typename: "ModelTimelineEntryConnection",
  items:  Array<TimelineEntry | null >,
  nextToken?: string | null,
};

export type TimelineEntry = {
  __typename: "TimelineEntry",
  id: string,
  tripId: string,
  members?: ModelTimelineEntryMemberConnection | null,
  timelineEntryType: TimelineEntryType,
  notes?: string | null,
  date: number,
  time: number,
  flightDetails?: FlightStatsScheduleDetails | null,
  rentalPickupLocation?: string | null,
  rentalDropoffLocation?: string | null,
  lodgingArrivalNameAndAddress?: string | null,
  lodgingDepartureNameAndAddress?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTimelineEntryMemberConnection = {
  __typename: "ModelTimelineEntryMemberConnection",
  items:  Array<TimelineEntryMember | null >,
  nextToken?: string | null,
};

export type TimelineEntryMember = {
  __typename: "TimelineEntryMember",
  timelineEntryId: string,
  userId: string,
  user?: User | null,
  createdAt: string,
  updatedAt: string,
};

export enum TimelineEntryType {
  FLIGHT = "FLIGHT",
  RENTAL_PICKUP = "RENTAL_PICKUP",
  RENTAL_DROPOFF = "RENTAL_DROPOFF",
  LODGING_ARRIVAL = "LODGING_ARRIVAL",
  LODGING_DEPARTURE = "LODGING_DEPARTURE",
}


export type FlightStatsScheduleDetails = {
  __typename: "FlightStatsScheduleDetails",
  appendix?: FlightStatsAppendix | null,
  scheduledFlights?:  Array<FlightStatsScheduledFlights | null > | null,
  request?: FlightStatsRequest | null,
};

export type FlightStatsAppendix = {
  __typename: "FlightStatsAppendix",
  equipments?:  Array<FlightStatsEquipments | null > | null,
  airports?:  Array<FlightStatsAirports | null > | null,
  airlines?:  Array<FlightStatsAirlines | null > | null,
};

export type FlightStatsEquipments = {
  __typename: "FlightStatsEquipments",
  iata?: string | null,
  name?: string | null,
  turboProp?: boolean | null,
  jet?: boolean | null,
  widebody?: boolean | null,
  regional?: boolean | null,
};

export type FlightStatsAirports = {
  __typename: "FlightStatsAirports",
  fs?: string | null,
  iata?: string | null,
  icao?: string | null,
  faa?: string | null,
  name?: string | null,
  city?: string | null,
  cityCode?: string | null,
  stateCode?: string | null,
  postalCode?: string | null,
  countryCode?: string | null,
  countryName?: string | null,
  regionName?: string | null,
  timeZoneRegionName?: string | null,
  weatherZone?: string | null,
  localTime?: string | null,
  utcOffsetHours?: number | null,
  latitude?: number | null,
  longitude?: number | null,
  elevationFeet?: number | null,
  classification?: number | null,
  active?: boolean | null,
};

export type FlightStatsAirlines = {
  __typename: "FlightStatsAirlines",
  fs?: string | null,
  iata?: string | null,
  icao?: string | null,
  name?: string | null,
  active?: boolean | null,
};

export type FlightStatsScheduledFlights = {
  __typename: "FlightStatsScheduledFlights",
  carrierFsCode?: string | null,
  flightNumber?: string | null,
  departureAirportFsCode?: string | null,
  arrivalAirportFsCode?: string | null,
  departureTime?: string | null,
  arrivalTime?: string | null,
  stops?: number | null,
  departureTerminal?: string | null,
  arrivalTerminal?: string | null,
  flightEquipmentIataCode?: string | null,
  isCodeshare?: boolean | null,
  isWetlease?: boolean | null,
  serviceType?: string | null,
  referenceCode?: string | null,
  codeshares?:  Array<FlightStatsCodeshares | null > | null,
  trafficRestrictions?: Array< string | null > | null,
  serviceClasses?: Array< string | null > | null,
};

export type FlightStatsCodeshares = {
  __typename: "FlightStatsCodeshares",
  carrierFsCode?: string | null,
  flightNumber?: string | null,
  serviceType?: string | null,
  referenceCode?: number | null,
  trafficRestrictions?: Array< string | null > | null,
  serviceClasses?: Array< string | null > | null,
};

export type FlightStatsRequest = {
  __typename: "FlightStatsRequest",
  departing?: boolean | null,
  url?: string | null,
  date?: FlightStatsDate | null,
  codeType?: FlightStatsCodeType | null,
  flightNumber?: FlightStatsFlightNumber | null,
  carrier?: FlightStatsCarrier | null,
};

export type FlightStatsDate = {
  __typename: "FlightStatsDate",
  year?: string | null,
  month?: string | null,
  day?: string | null,
  interpreted?: string | null,
};

export type FlightStatsCodeType = {
  __typename: "FlightStatsCodeType",
  requested?: string | null,
  interpreted?: string | null,
};

export type FlightStatsFlightNumber = {
  __typename: "FlightStatsFlightNumber",
  requested?: string | null,
  interpreted?: string | null,
};

export type FlightStatsCarrier = {
  __typename: "FlightStatsCarrier",
  requestedCode?: string | null,
  fsCode?: string | null,
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
};

export type Message = {
  __typename: "Message",
  id: string,
  tripId: string,
  userId: string,
  user?: User | null,
  text?: string | null,
  system?: boolean | null,
  image?: S3Object | null,
  sent: boolean,
  createdAt: string,
  updatedAt: string,
};

export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items:  Array<Comment | null >,
  nextToken?: string | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  postId: string,
  userId: string,
  user?: User | null,
  text: string,
  createdAt: string,
  updatedAt: string,
};

export enum MEDIA_TYPES {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}


export type ModelUserPostConnection = {
  __typename: "ModelUserPostConnection",
  items:  Array<UserPost | null >,
  nextToken?: string | null,
};

export type UserPost = {
  __typename: "UserPost",
  userId: string,
  postId: string,
  post?: Post | null,
  createdAt: string,
  updatedAt: string,
};

export enum PRIVACY {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}


export type ModelUserReferralConnection = {
  __typename: "ModelUserReferralConnection",
  items:  Array<UserReferral | null >,
  nextToken?: string | null,
};

export type UserReferral = {
  __typename: "UserReferral",
  userId: string,
  user?: User | null,
  referredUserId: string,
  referredUser?: User | null,
  referralType: REFERRAL_TYPES,
  sourceOS?: string | null,
  matchGuaranteed?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export enum REFERRAL_TYPES {
  TRIP_INVITE = "TRIP_INVITE",
  PLATFORM_INVITE = "PLATFORM_INVITE",
  ATTRACTION_SHARE = "ATTRACTION_SHARE",
  POST_SHARE = "POST_SHARE",
}


export type ModelUserAttractionConnection = {
  __typename: "ModelUserAttractionConnection",
  items:  Array<UserAttraction | null >,
  nextToken?: string | null,
};

export type UserAttraction = {
  __typename: "UserAttraction",
  userId: string,
  attractionId: string,
  attraction?: Attraction | null,
  authorId?: string | null,
  createdAt?: string | null,
  updatedAt: string,
};

export type ModelUserPostLikeConnection = {
  __typename: "ModelUserPostLikeConnection",
  items:  Array<UserPostLike | null >,
  nextToken?: string | null,
};

export type UserPostLike = {
  __typename: "UserPostLike",
  userId: string,
  postId: string,
  createdAt: string,
  updatedAt: string,
};

export type ExploreSearchAttractionsInput = {
  searchString?: string | null,
  attractionType?: ATTRACTION_TYPE | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  insideBoundingBox?: BoundingBoxInput | null,
  outsideBoundingBox?: BoundingBoxInput | null,
  centerCoords?: CoordsInput | null,
  selectedAttractionId?: string | null,
  sortByDistance: boolean,
  excludeAttractionIds?: Array< string | null > | null,
};

export type BoundingBoxInput = {
  topLeftCoords: CoordsInput,
  bottomRightCoords: CoordsInput,
};

export type ExploreSearchAttractionsResponse = {
  __typename: "ExploreSearchAttractionsResponse",
  attractions?:  Array<ExploreSearchAttractionItem | null > | null,
  nextPageExists: boolean,
};

export type ExploreSearchAttractionItem = {
  __typename: "ExploreSearchAttractionItem",
  id: string,
  name: string,
  locations?:  Array<SearchStartEndLocation | null > | null,
  distance?: number | null,
  isTravaCreated: number,
  images?:  Array<S3Object | null > | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  author?: SearchAttractionAuthorItem | null,
  bucketListCount: number,
  duration?: ATTRACTION_DURATION | null,
  type: ATTRACTION_TYPE,
  recommendationBadges?: Array< BADGES | null > | null,
};

export type SearchStartEndLocation = {
  __typename: "SearchStartEndLocation",
  id: string,
  displayOrder?: number | null,
  deleted?: boolean | null,
  startLoc: SearchLocation,
  endLoc: SearchLocation,
};

export type SearchLocation = {
  __typename: "SearchLocation",
  id: string,
  googlePlaceId: string,
  timezone?: string | null,
  googlePlace?: SearchGooglePlace | null,
};

export type SearchGooglePlace = {
  __typename: "SearchGooglePlace",
  data: SearchGooglePlaceData,
};

export type SearchGooglePlaceData = {
  __typename: "SearchGooglePlaceData",
  coords: Coords,
  name?: string | null,
  city?: string | null,
  formattedAddress?: string | null,
  businessStatus?: BusinessStatus | null,
  rating?: Rating | null,
  hours?: Hours | null,
};

export type SearchAttractionAuthorItem = {
  __typename: "SearchAttractionAuthorItem",
  id: string,
  name?: string | null,
  username: string,
  avatar?: S3Object | null,
};

export type ExploreMapSearchAttractionsInput = {
  searchString?: string | null,
  attractionType?: ATTRACTION_TYPE | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  boundingBox: BoundingBoxInput,
  centerCoords: CoordsInput,
  selectedAttractionId?: string | null,
  sortByDistance: boolean,
};

export type ExploreMapSearchAttractionsResponse = {
  __typename: "ExploreMapSearchAttractionsResponse",
  attractions?:  Array<ExploreSearchAttractionItem | null > | null,
};

export type AddToItinerarySearchInput = {
  tripId: string,
  destinationId: string,
  insideBoundingBox: BoundingBoxInput,
  outsideBoundingBox?: BoundingBoxInput | null,
  centerCoords: CoordsInput,
  destinationDates: Array< string >,
  searchString?: string | null,
  attractionType?: ATTRACTION_TYPE | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  selectedAttractionId?: string | null,
  attractionVotingResults?: Array< AttractionVotingResultsInput > | null,
  excludeAttractionIds?: Array< string | null > | null,
};

export type AttractionVotingResultsInput = {
  attractionId: string,
  votingResults: VotingResultsInput,
};

export type VotingResultsInput = {
  yesVotes: number,
  noVotes: number,
};

export type AddToItinerarySearchResponse = {
  __typename: "AddToItinerarySearchResponse",
  attractions:  Array<ItinerarySearchAttractionItem >,
  nextPageExists: boolean,
};

export type ItinerarySearchAttractionItem = {
  __typename: "ItinerarySearchAttractionItem",
  id: string,
  name: string,
  locations?:  Array<SearchStartEndLocation | null > | null,
  isTravaCreated: number,
  images?:  Array<S3Object | null > | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  author?: SearchAttractionAuthorItem | null,
  bucketListCount: number,
  duration?: ATTRACTION_DURATION | null,
  type: ATTRACTION_TYPE,
  distance: number,
  inSeason: boolean,
  inMyBucketList: boolean,
  onItinerary: boolean,
  yesVotes: number,
  noVotes: number,
  recommendationBadges?: Array< BADGES | null > | null,
};

export type AddToItineraryMapSearchInput = {
  tripId: string,
  destinationId: string,
  boundingBox: BoundingBoxInput,
  centerCoords: CoordsInput,
  destinationDates: Array< string >,
  attractionType?: ATTRACTION_TYPE | null,
  searchString?: string | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  selectedAttractionId?: string | null,
  attractionVotingResults?: Array< AttractionVotingResultsInput > | null,
};

export type AddToItineraryMapSearchResponse = {
  __typename: "AddToItineraryMapSearchResponse",
  attractions?:  Array<ItinerarySearchAttractionItem | null > | null,
};

export type CustomDeleteAttractionInput = {
  id: string,
};

export type OpenSearchListNearbyAttractionsInput = {
  centerCoords: CoordsInput,
  radius: number,
};

export type OpenSearchListNearbyAttractionsResponse = {
  __typename: "OpenSearchListNearbyAttractionsResponse",
  attractions:  Array<OpenSearchListAttractionItem | null >,
};

export type OpenSearchListAttractionItem = {
  __typename: "OpenSearchListAttractionItem",
  id: string,
  name: string,
  type: ATTRACTION_TYPE,
  bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  duration?: ATTRACTION_DURATION | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  locations?:  Array<SearchStartEndLocation | null > | null,
  seasons?:  Array<AttractionSeason | null > | null,
  isTravaCreated: number,
  authorType: AUTHOR_TYPE,
  deletedAt?: string | null,
};

export type GetAttractionsForScheduler = {
  centerCoords: CoordsInput,
  radius: number,
  tripId: string,
  destinationId: string,
};

export type GetAttractionsForSchedulerResponse = {
  __typename: "GetAttractionsForSchedulerResponse",
  attractions?:  Array<OpenSearchListAttractionItem | null > | null,
};

export type CheckForExistingCardsInput = {
  googlePlaceId: string,
  destinationDates?: Array< string | null > | null,
};

export type CheckForExistingCardsResponse = {
  __typename: "CheckForExistingCardsResponse",
  attractions?:  Array<AttractionExistsItem | null > | null,
};

export type AttractionExistsItem = {
  __typename: "AttractionExistsItem",
  id: string,
  name: string,
  destinationName?: string | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  bucketListCount: number,
  isTravaCreated: number,
  locations?:  Array<SearchStartEndLocation | null > | null,
  duration?: ATTRACTION_DURATION | null,
  recommendationBadges?: Array< BADGES | null > | null,
  images?:  Array<S3Object | null > | null,
  author?: SearchAttractionAuthorItem | null,
  type: ATTRACTION_TYPE,
  deletedAt?: string | null,
  outOfSeason?: boolean | null,
};

export type CreateAttractionFromPlaceIdInput = {
  googlePlaceId: string,
  destinationDates?: Array< string | null > | null,
  authorType: AUTHOR_TYPE,
  recommendationBadges?: Array< BADGES > | null,
};

export type CreateAttractionFromPlaceIdResponse = {
  __typename: "CreateAttractionFromPlaceIdResponse",
  existingAttractions?:  Array<AttractionExistsItem | null > | null,
  createdAttraction?: AttractionExistsItem | null,
};

export type FederatedSignUpInput = {
  appleId?: string | null,
  dateOfBirth: string,
  email?: string | null,
  facebookId?: string | null,
  googleId?: string | null,
  name: string,
  phone?: string | null,
  privacy: string,
  sub: string,
  username: string,
};

export type FederatedSignUpResponse = {
  __typename: "FederatedSignUpResponse",
  id?: string | null,
};

export type SignOutInput = {
  id?: string | null,
  fcmToken?: string | null,
};

export type SignOutResponse = {
  __typename: "SignOutResponse",
  id?: string | null,
};

export type SettingsSendReportInput = {
  message: string,
  userEmail?: string | null,
  userContactEmail?: string | null,
};

export type SettingsSendReportResponse = {
  __typename: "SettingsSendReportResponse",
  messageId: string,
};

export type CustomCreateTripInput = {
  id?: string | null,
  link?: string | null,
  name: string,
  completed?: boolean | null,
  userIds: Array< string >,
  destinationIdsWithDates: Array< destinationIdWithDates >,
};

export type destinationIdWithDates = {
  id: string,
  startDate?: number | null,
  endDate?: number | null,
};

export type UpdateTripInput = {
  id: string,
  name?: string | null,
  completed?: boolean | null,
};

export type CreateUserTripInput = {
  userId: string,
  tripId: string,
  status: UserTripStatus,
  invitedByUserId: string,
  inviteLink?: string | null,
};

export type UpdateUserTripInput = {
  userId: string,
  tripId: string,
  status?: UserTripStatus | null,
  invitedByUserId?: string | null,
  lastMessageReadDate?: string | null,
  inviteLink?: string | null,
};

export type DeleteUserTripInput = {
  userId: string,
  tripId: string,
};

export type CreateTripDestinationInput = {
  tripId: string,
  destinationId: string,
  startDate?: number | null,
  endDate?: number | null,
  startTime?: TripDestinationTime | null,
  endTime?: TripDestinationTime | null,
  tripPlan?: Array< TripPlanDayInput | null > | null,
};

export type TripPlanDayInput = {
  dayOfYear: number,
  tripPlanDayItems?: Array< TripPlanDayItemInput | null > | null,
};

export type TripPlanDayItemInput = {
  locId: string,
  attractionId: string,
};

export type UpdateTripDestinationInput = {
  tripId: string,
  destinationId: string,
  startDate?: number | null,
  endDate?: number | null,
  startTime?: TripDestinationTime | null,
  endTime?: TripDestinationTime | null,
  tripPlan?: Array< TripPlanDayInput | null > | null,
};

export type DeleteTripDestinationInput = {
  tripId: string,
  destinationId: string,
};

export type CreateUserFollowInput = {
  userId: string,
  followedUserId: string,
  approved: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
  userFollowUserId?: string | null,
};

export type UpdateUserFollowInput = {
  userId: string,
  followedUserId: string,
  approved?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  userFollowUserId?: string | null,
};

export type CreateUserReferralInput = {
  userId: string,
  referredUserId: string,
  referralType: REFERRAL_TYPES,
  sourceOS?: string | null,
  matchGuaranteed?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type PutAttractionSwipeInput = {
  userId: string,
  tripId: string,
  destinationId: string,
  attractionId: string,
  swipe: AttractionSwipeResult,
};

export type CreateAttractionInput = {
  id?: string | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
  authorId?: string | null,
  authorType: AUTHOR_TYPE,
  bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  bucketListCount: number,
  costCurrency: CURRENCY_TYPE,
  cost?: ATTRACTION_COST | null,
  costNote?: string | null,
  costType: ATTRACTION_COST_TYPE,
  createdAt?: string | null,
  deletedAt?: string | null,
  descriptionLong: string,
  descriptionShort: string,
  destinationId?: string | null,
  duration?: ATTRACTION_DURATION | null,
  images?: Array< S3ObjectInput | null > | null,
  isTravaCreated: number,
  rank?: number | null,
  reservation?: ATTRACTION_RESERVATION | null,
  locations?: Array< StartEndLocationInput | null > | null,
  name: string,
  reservationNote?: string | null,
  seasons?: Array< AttractionSeasonInput | null > | null,
  type: ATTRACTION_TYPE,
  label: AttractionLabel,
  updatedAt?: string | null,
  privacy: ATTRACTION_PRIVACY,
  recommendationBadges?: Array< BADGES | null > | null,
  generation?: GenerationInput | null,
};

export type S3ObjectInput = {
  bucket: string,
  region: string,
  key: string,
};

export type StartEndLocationInput = {
  id?: string | null,
  displayOrder: number,
  deleted?: boolean | null,
  startLoc: LocationInput,
  endLoc: LocationInput,
};

export type LocationInput = {
  id?: string | null,
  googlePlaceId: string,
  timezone?: string | null,
};

export type AttractionSeasonInput = {
  startMonth?: number | null,
  startDay?: number | null,
  endMonth?: number | null,
  endDay?: number | null,
};

export type GenerationInput = {
  step: GenerationStep,
  status: Status,
  lastUpdatedAt: string,
  failureCount?: number | null,
  lastFailureReason?: string | null,
};

export type UpdateAttractionInput = {
  id: string,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
  authorId?: string | null,
  authorType?: AUTHOR_TYPE | null,
  bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  bucketListCount?: number | null,
  costCurrency?: CURRENCY_TYPE | null,
  cost?: ATTRACTION_COST | null,
  costNote?: string | null,
  costType?: ATTRACTION_COST_TYPE | null,
  createdAt?: string | null,
  deletedAt?: string | null,
  descriptionLong?: string | null,
  descriptionShort?: string | null,
  destinationId?: string | null,
  duration?: ATTRACTION_DURATION | null,
  images?: Array< S3ObjectInput | null > | null,
  isTravaCreated?: number | null,
  rank?: number | null,
  reservation?: ATTRACTION_RESERVATION | null,
  locations?: Array< StartEndLocationInput | null > | null,
  name?: string | null,
  reservationNote?: string | null,
  seasons?: Array< AttractionSeasonInput | null > | null,
  type?: ATTRACTION_TYPE | null,
  updatedAt?: string | null,
  privacy?: ATTRACTION_PRIVACY | null,
  recommendationBadges?: Array< BADGES | null > | null,
  generation?: GenerationInput | null,
};

export type CustomDeleteUserInput = {
  id: string,
};

export type AdminCreateViatorProductInput = {
  id: string,
  url: string,
  attractionId: string,
  displayOrder: number,
};

export type CreateTimelineEntryFlightInput = {
  tripId: string,
  notes?: string | null,
  date: number,
  time: number,
  memberIds: Array< string >,
  flightDetails: FlightStatsScheduleDetailsInput,
};

export type FlightStatsScheduleDetailsInput = {
  appendix?: FlightStatsAppendixInput | null,
  scheduledFlights?: Array< FlightStatsScheduledFlightsInput | null > | null,
  request?: FlightStatsRequestInput | null,
};

export type FlightStatsAppendixInput = {
  equipments?: Array< FlightStatsEquipmentsInput | null > | null,
  airports?: Array< FlightStatsAirportsInput | null > | null,
  airlines?: Array< FlightStatsAirlinesInput | null > | null,
};

export type FlightStatsEquipmentsInput = {
  iata?: string | null,
  name?: string | null,
  turboProp?: boolean | null,
  jet?: boolean | null,
  widebody?: boolean | null,
  regional?: boolean | null,
};

export type FlightStatsAirportsInput = {
  fs?: string | null,
  iata?: string | null,
  icao?: string | null,
  faa?: string | null,
  name?: string | null,
  city?: string | null,
  cityCode?: string | null,
  stateCode?: string | null,
  postalCode?: string | null,
  countryCode?: string | null,
  countryName?: string | null,
  regionName?: string | null,
  timeZoneRegionName?: string | null,
  weatherZone?: string | null,
  localTime?: string | null,
  utcOffsetHours?: number | null,
  latitude?: number | null,
  longitude?: number | null,
  elevationFeet?: number | null,
  classification?: number | null,
  active?: boolean | null,
};

export type FlightStatsAirlinesInput = {
  fs?: string | null,
  iata?: string | null,
  icao?: string | null,
  name?: string | null,
  active?: boolean | null,
};

export type FlightStatsScheduledFlightsInput = {
  carrierFsCode?: string | null,
  flightNumber?: string | null,
  departureAirportFsCode?: string | null,
  arrivalAirportFsCode?: string | null,
  departureTime?: string | null,
  arrivalTime?: string | null,
  stops?: number | null,
  departureTerminal?: string | null,
  arrivalTerminal?: string | null,
  flightEquipmentIataCode?: string | null,
  isCodeshare?: boolean | null,
  isWetlease?: boolean | null,
  serviceType?: string | null,
  referenceCode?: string | null,
  codeshares?: Array< FlightStatsCodesharesInput | null > | null,
  trafficRestrictions?: Array< string | null > | null,
  serviceClasses?: Array< string | null > | null,
};

export type FlightStatsCodesharesInput = {
  carrierFsCode?: string | null,
  flightNumber?: string | null,
  serviceType?: string | null,
  referenceCode?: number | null,
  trafficRestrictions?: Array< string | null > | null,
  serviceClasses?: Array< string | null > | null,
};

export type FlightStatsRequestInput = {
  departing?: boolean | null,
  url?: string | null,
  date?: FlightStatsDateInput | null,
  codeType?: FlightStatsCodeTypeInput | null,
  flightNumber?: FlightStatsFlightNumberInput | null,
  carrier?: FlightStatsCarrierInput | null,
};

export type FlightStatsDateInput = {
  year?: string | null,
  month?: string | null,
  day?: string | null,
  interpreted?: string | null,
};

export type FlightStatsCodeTypeInput = {
  requested?: string | null,
  interpreted?: string | null,
};

export type FlightStatsFlightNumberInput = {
  requested?: string | null,
  interpreted?: string | null,
};

export type FlightStatsCarrierInput = {
  requestedCode?: string | null,
  fsCode?: string | null,
};

export type CreateTimelineEntryRentalPickupInput = {
  tripId: string,
  notes?: string | null,
  date: number,
  time: number,
  memberIds: Array< string >,
  rentalPickupLocation: string,
};

export type CreateTimelineEntryRentalDropoffInput = {
  tripId: string,
  notes?: string | null,
  date: number,
  time: number,
  memberIds: Array< string >,
  rentalDropoffLocation: string,
};

export type CreateTimelineEntryLodgingArrivalInput = {
  tripId: string,
  notes?: string | null,
  date: number,
  time: number,
  memberIds: Array< string >,
  lodgingArrivalNameAndAddress: string,
};

export type CreateTimelineEntryLodgingDepartureInput = {
  tripId: string,
  notes?: string | null,
  date: number,
  time: number,
  memberIds: Array< string >,
  lodgingDepartureNameAndAddress: string,
};

export type UpdateTimelineEntryFlightInput = {
  id: string,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  memberIds: Array< string >,
  flightDetails?: FlightStatsScheduleDetailsInput | null,
};

export type UpdateTimelineEntryRentalPickupInput = {
  id: string,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  memberIds: Array< string >,
  rentalPickupLocation?: string | null,
};

export type UpdateTimelineEntryRentalDropoffInput = {
  id: string,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  memberIds: Array< string >,
  rentalDropoffLocation?: string | null,
};

export type UpdateTimelineEntryLodgingArrivalInput = {
  id: string,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  memberIds: Array< string >,
  lodgingArrivalNameAndAddress?: string | null,
};

export type UpdateTimelineEntryLodgingDepartureInput = {
  id: string,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  memberIds: Array< string >,
  lodgingDepartureNameAndAddress?: string | null,
};

export type DeleteTimelineEntryInput = {
  id: string,
};

export type CreateDestinationInput = {
  id?: string | null,
  name?: string | null,
  icon?: string | null,
  coverImage?: S3ObjectInput | null,
  timezone?: string | null,
  isTravaCreated: number,
  coords: CoordsInput,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  googlePlaceId?: string | null,
  featured?: boolean | null,
  authorId?: string | null,
  label?: string | null,
};

export type addRemoveFromBucketListInput = {
  userId: string,
  attractionId: string,
  action: BUCKET_LIST_ACTION_INPUT,
};

export enum BUCKET_LIST_ACTION_INPUT {
  ADD = "ADD",
  REMOVE = "REMOVE",
}


export type CustomCreatePostInput = {
  id?: string | null,
  userId: string,
  tripId: string,
  destinationId?: string | null,
  attractionId?: string | null,
  description?: string | null,
  mediaType: MEDIA_TYPES,
  width?: number | null,
  height?: number | null,
  format?: string | null,
  bufferItem?: S3ObjectInput | null,
  cloudinaryInput?: CloudinaryInput | null,
};

export type CloudinaryInput = {
  cloudinaryUrl: string,
  videoDuration?: number | null,
  width: number,
  height: number,
  format: string,
};

export type CustomDeletePostInput = {
  id: string,
};

export type likeDislikePostInput = {
  userId: string,
  postId: string,
  action: LIKE_DISLIKE_ACTION_INPUT,
};

export enum LIKE_DISLIKE_ACTION_INPUT {
  ADD = "ADD",
  REMOVE = "REMOVE",
}


export type CustomCreateComment = {
  postId: string,
  text: string,
};

export type UpdateUserInput = {
  id: string,
  appleId?: string | null,
  avatar?: S3ObjectInput | null,
  dateOfBirth?: string | null,
  description?: string | null,
  email?: string | null,
  contactEmail?: string | null,
  facebookId?: string | null,
  fcmToken?: string | null,
  googleId?: string | null,
  location?: string | null,
  name?: string | null,
  phone?: string | null,
  privacy?: PRIVACY | null,
  pushNotifications?: boolean | null,
  username?: string | null,
  referralLink?: string | null,
};

export type SyncContactsInput = {
  contacts: Array< PhoneBookContact >,
};

export type PhoneBookContact = {
  recordId: string,
  name?: string | null,
  email: Array< string | null >,
  phone: Array< string | null >,
};

export type CreateTripMessageNotificationsInput = {
  tripId: string,
  type: NOTIFICATION_TYPE,
  text?: string | null,
};

export enum NOTIFICATION_TYPE {
  NEW_FOLLOW = "NEW_FOLLOW",
  FOLLOW_REQUEST_ACCEPTED = "FOLLOW_REQUEST_ACCEPTED",
  FOLLOW_REQUEST_SENT = "FOLLOW_REQUEST_SENT",
  TRIP_INVITATION_SENT = "TRIP_INVITATION_SENT",
  TRIP_INVITATION_ACCEPTED = "TRIP_INVITATION_ACCEPTED",
  JOIN_TRIP = "JOIN_TRIP",
  CREATE_CALENDAR = "CREATE_CALENDAR",
  EDIT_CALENDAR = "EDIT_CALENDAR",
  EDIT_DATES = "EDIT_DATES",
  RENAME_TRIP = "RENAME_TRIP",
  ADD_DESTINATION = "ADD_DESTINATION",
  REMOVE_DESTINATION = "REMOVE_DESTINATION",
  ADD_FLIGHT = "ADD_FLIGHT",
  ADD_LODGING = "ADD_LODGING",
  ADD_CAR_RENTAL = "ADD_CAR_RENTAL",
  REMOVE_FLIGHT = "REMOVE_FLIGHT",
  REMOVE_LODGING = "REMOVE_LODGING",
  REMOVE_CAR_RENTAL = "REMOVE_CAR_RENTAL",
  RECALCULATE_CALENDAR = "RECALCULATE_CALENDAR",
  INVITE_MEMBER = "INVITE_MEMBER",
  REMOVE_MEMBER = "REMOVE_MEMBER",
  LEAVE_TRIP = "LEAVE_TRIP",
  USER_MESSAGE = "USER_MESSAGE",
  LIKE_POST = "LIKE_POST",
  COMMENT_POST = "COMMENT_POST",
  BUCKET_LIST_ATTRACTION = "BUCKET_LIST_ATTRACTION",
  REFERRAL_JOINED = "REFERRAL_JOINED",
  REFERRAL_ONBOARDING = "REFERRAL_ONBOARDING",
}


export type TeaRexCreateEntityInput = {
  teaRexEntity: TeaRexEntityInput,
};

export type TeaRexEntityInput = {
  id: string,
  label: TeaRexLabel,
};

export enum TeaRexLabel {
  User = "User",
  Post = "Post",
  Attraction = "Attraction",
}


export type TeaRexDeleteEntityInput = {
  teaRexEntity: TeaRexEntityInput,
};

export type TeaRexCreateEventInput = {
  inEventEntity: TeaRexEntityInput,
  teaRexEvent: TeaRexEventInput,
  outEventEntity: TeaRexEntityInput,
};

export type TeaRexEventInput = {
  label: TeaRexEventLabel,
  weight: number,
};

export enum TeaRexEventLabel {
  WATCHED = "WATCHED",
  SWIPE = "SWIPE",
}


export type TeaRexDeleteEventInput = {
  inEventEntity: TeaRexEntityInput,
  teaRexEvent: TeaRexEventInput,
  outEventEntity: TeaRexEntityInput,
};

export type CreateUserBlockInput = {
  userId: string,
  blockedUserId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UploadToCloudinaryInput = {
  bufferItem: S3ObjectInput,
  resource_type: string,
  mediaType: MEDIA_TYPES,
};

export type UploadToCloudinaryResponse = {
  __typename: "UploadToCloudinaryResponse",
  cloudinaryUrl: string,
  videoDuration?: number | null,
  width: number,
  height: number,
  format: string,
};

export type TableMigrationInput = {
  tableName: string,
  sourceEnv: BACKEND_ENV_NAME,
  targetEnv: BACKEND_ENV_NAME,
  operationType: OPERATION_TYPE,
};

export enum BACKEND_ENV_NAME {
  RN = "RN",
  DIMA = "DIMA",
  NICK = "NICK",
  NEAL = "NEAL",
  ANAY = "ANAY",
  DEV = "DEV",
  STAGING = "STAGING",
  PROD = "PROD",
}


export enum OPERATION_TYPE {
  INSERT = "INSERT",
  PUT = "PUT",
}


export type TableMigrationResponse = {
  __typename: "TableMigrationResponse",
  mainTableResult: MigrationResult,
  imageResult: MigrationResult,
};

export type MigrationResult = {
  __typename: "MigrationResult",
  success: number,
  fail: number,
  skipped: number,
  remaining: number,
};

export type MigrateSingleAttractionInput = {
  attractionId: string,
  sourceEnv: BACKEND_ENV_NAME,
  targetEnv: BACKEND_ENV_NAME,
};

export type AddMigrationFlagInput = {
  tableName: string,
  sourceEnv: BACKEND_ENV_NAME,
};

export type AddMigrationFlagResponse = {
  __typename: "AddMigrationFlagResponse",
  success: number,
  fail: number,
};

export type UpdateGoogleAPIKeyInput = {
  googleAPIKey: string,
  platform: PLATFORM,
  isDev: boolean,
};

export enum PLATFORM {
  IOS = "IOS",
  ANDROID = "ANDROID",
}


export type UpdateGoogleAPIKeyResponse = {
  __typename: "UpdateGoogleAPIKeyResponse",
  envsUpdated: Array< BACKEND_ENV_NAME >,
  envsFailed: Array< BACKEND_ENV_NAME >,
};

export type ModelAttractionConditionInput = {
  attractionCategories?: ModelATTRACTION_CATEGORY_TYPEListInput | null,
  attractionCuisine?: ModelATTRACTION_CUISINE_TYPEListInput | null,
  attractionTargetGroups?: ModelATTRACTION_TARGET_GROUPListInput | null,
  authorId?: ModelIDInput | null,
  authorType?: ModelAUTHOR_TYPEInput | null,
  bestVisited?: ModelATTRACTION_BEST_VISIT_TIMEListInput | null,
  costCurrency?: ModelCURRENCY_TYPEInput | null,
  cost?: ModelATTRACTION_COSTInput | null,
  costNote?: ModelStringInput | null,
  costType?: ModelATTRACTION_COST_TYPEInput | null,
  descriptionLong?: ModelStringInput | null,
  descriptionShort?: ModelStringInput | null,
  destinationId?: ModelIDInput | null,
  duration?: ModelATTRACTION_DURATIONInput | null,
  reservation?: ModelATTRACTION_RESERVATIONInput | null,
  name?: ModelStringInput | null,
  reservationNote?: ModelStringInput | null,
  type?: ModelATTRACTION_TYPEInput | null,
  isTravaCreated?: ModelIntInput | null,
  deletedAt?: ModelStringInput | null,
  privacy?: ModelATTRACTION_PRIVACYInput | null,
  bucketListCount?: ModelIntInput | null,
  rank?: ModelIntInput | null,
  label?: ModelAttractionLabelInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  recommendationBadges?: ModelBADGESListInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelAttractionConditionInput | null > | null,
  or?: Array< ModelAttractionConditionInput | null > | null,
  not?: ModelAttractionConditionInput | null,
};

export type ModelATTRACTION_CATEGORY_TYPEListInput = {
  eq?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  ne?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  contains?: ATTRACTION_CATEGORY_TYPE | null,
  notContains?: ATTRACTION_CATEGORY_TYPE | null,
};

export type ModelATTRACTION_CUISINE_TYPEListInput = {
  eq?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  ne?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
  contains?: ATTRACTION_CUISINE_TYPE | null,
  notContains?: ATTRACTION_CUISINE_TYPE | null,
};

export type ModelATTRACTION_TARGET_GROUPListInput = {
  eq?: Array< ATTRACTION_TARGET_GROUP | null > | null,
  ne?: Array< ATTRACTION_TARGET_GROUP | null > | null,
  contains?: ATTRACTION_TARGET_GROUP | null,
  notContains?: ATTRACTION_TARGET_GROUP | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelAUTHOR_TYPEInput = {
  eq?: AUTHOR_TYPE | null,
  ne?: AUTHOR_TYPE | null,
};

export type ModelATTRACTION_BEST_VISIT_TIMEListInput = {
  eq?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  ne?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  contains?: ATTRACTION_BEST_VISIT_TIME | null,
  notContains?: ATTRACTION_BEST_VISIT_TIME | null,
};

export type ModelCURRENCY_TYPEInput = {
  eq?: CURRENCY_TYPE | null,
  ne?: CURRENCY_TYPE | null,
};

export type ModelATTRACTION_COSTInput = {
  eq?: ATTRACTION_COST | null,
  ne?: ATTRACTION_COST | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelATTRACTION_COST_TYPEInput = {
  eq?: ATTRACTION_COST_TYPE | null,
  ne?: ATTRACTION_COST_TYPE | null,
};

export type ModelATTRACTION_DURATIONInput = {
  eq?: ATTRACTION_DURATION | null,
  ne?: ATTRACTION_DURATION | null,
};

export type ModelATTRACTION_RESERVATIONInput = {
  eq?: ATTRACTION_RESERVATION | null,
  ne?: ATTRACTION_RESERVATION | null,
};

export type ModelATTRACTION_TYPEInput = {
  eq?: ATTRACTION_TYPE | null,
  ne?: ATTRACTION_TYPE | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelATTRACTION_PRIVACYInput = {
  eq?: ATTRACTION_PRIVACY | null,
  ne?: ATTRACTION_PRIVACY | null,
};

export type ModelAttractionLabelInput = {
  eq?: AttractionLabel | null,
  ne?: AttractionLabel | null,
};

export type ModelBADGESListInput = {
  eq?: Array< BADGES | null > | null,
  ne?: Array< BADGES | null > | null,
  contains?: BADGES | null,
  notContains?: BADGES | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type CreateAttractionSwipeInput = {
  userId: string,
  tripId: string,
  destinationId: string,
  attractionId: string,
  swipe: AttractionSwipeResult,
  label: AttractionSwipeLabel,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAttractionSwipeConditionInput = {
  destinationId?: ModelIDInput | null,
  swipe?: ModelAttractionSwipeResultInput | null,
  label?: ModelAttractionSwipeLabelInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAttractionSwipeConditionInput | null > | null,
  or?: Array< ModelAttractionSwipeConditionInput | null > | null,
  not?: ModelAttractionSwipeConditionInput | null,
};

export type ModelAttractionSwipeResultInput = {
  eq?: AttractionSwipeResult | null,
  ne?: AttractionSwipeResult | null,
};

export type ModelAttractionSwipeLabelInput = {
  eq?: AttractionSwipeLabel | null,
  ne?: AttractionSwipeLabel | null,
};

export type UpdateAttractionSwipeInput = {
  userId: string,
  tripId: string,
  destinationId?: string | null,
  attractionId: string,
  swipe?: AttractionSwipeResult | null,
  label?: AttractionSwipeLabel | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteAttractionSwipeInput = {
  userId: string,
  tripId: string,
  attractionId: string,
};

export type ModelDestinationConditionInput = {
  authorId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  timezone?: ModelStringInput | null,
  nearbyThingsToDoCount?: ModelIntInput | null,
  nearbyPlacesToEatCount?: ModelIntInput | null,
  nearbyTravaThingsToDoCount?: ModelIntInput | null,
  nearbyTravaPlacesToEatCount?: ModelIntInput | null,
  state?: ModelStringInput | null,
  country?: ModelStringInput | null,
  continent?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  isTravaCreated?: ModelIntInput | null,
  googlePlaceId?: ModelStringInput | null,
  featured?: ModelBooleanInput | null,
  altName?: ModelStringInput | null,
  label?: ModelStringInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelDestinationConditionInput | null > | null,
  or?: Array< ModelDestinationConditionInput | null > | null,
  not?: ModelDestinationConditionInput | null,
};

export type UpdateDestinationInput = {
  id: string,
  authorId?: string | null,
  name?: string | null,
  icon?: string | null,
  coverImage?: S3ObjectInput | null,
  timezone?: string | null,
  nearbyThingsToDoCount?: number | null,
  nearbyPlacesToEatCount?: number | null,
  nearbyTravaThingsToDoCount?: number | null,
  nearbyTravaPlacesToEatCount?: number | null,
  coords?: CoordsInput | null,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  deletedAt?: string | null,
  isTravaCreated?: number | null,
  googlePlaceId?: string | null,
  featured?: boolean | null,
  altName?: string | null,
  label?: string | null,
  pendingMigration?: boolean | null,
};

export type CreateDistanceInput = {
  key: string,
  value: number,
};

export type ModelDistanceConditionInput = {
  value?: ModelFloatInput | null,
  and?: Array< ModelDistanceConditionInput | null > | null,
  or?: Array< ModelDistanceConditionInput | null > | null,
  not?: ModelDistanceConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Distance = {
  __typename: "Distance",
  key: string,
  value: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFeatureFlagInput = {
  id: FeatureFlagName,
  isEnabled?: boolean | null,
};

export enum FeatureFlagName {
  MAINTENANCE_MODE = "MAINTENANCE_MODE",
}


export type ModelFeatureFlagConditionInput = {
  id?: ModelFeatureFlagNameInput | null,
  isEnabled?: ModelBooleanInput | null,
  and?: Array< ModelFeatureFlagConditionInput | null > | null,
  or?: Array< ModelFeatureFlagConditionInput | null > | null,
  not?: ModelFeatureFlagConditionInput | null,
};

export type ModelFeatureFlagNameInput = {
  eq?: FeatureFlagName | null,
  ne?: FeatureFlagName | null,
};

export type FeatureFlag = {
  __typename: "FeatureFlag",
  id: FeatureFlagName,
  isEnabled: boolean,
  createdAt: string,
  updatedAt: string,
};

export type CreateGooglePlaceInput = {
  id?: string | null,
  isValid: number,
  data: PlaceDataInput,
  consecutiveFailedRequests?: number | null,
  dataLastCheckedAt?: string | null,
  dataLastUpdatedAt?: string | null,
  webData?: PlaceWebDataInput | null,
  yelpData?: YelpDataInput | null,
  generatedSummary?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type PlaceDataInput = {
  coords: CoordsInput,
  city?: string | null,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  name?: string | null,
  formattedAddress?: string | null,
  googlePlacePageLink?: string | null,
  websiteLink?: string | null,
  phone?: string | null,
  hours?: HoursInput | null,
  businessStatus?: BusinessStatus | null,
  rating?: RatingInput | null,
  mealServices?: MealServicesInput | null,
  photos?: Array< PlacePhotoInput | null > | null,
  reservable?: boolean | null,
  price?: number | null,
  reviews?: Array< ReviewInput | null > | null,
  editorialSummary?: string | null,
  types?: Array< string | null > | null,
};

export type HoursInput = {
  weekdayText: Array< string >,
  periods: Array< PeriodInput >,
};

export type PeriodInput = {
  open: OpenCloseTimeInput,
  close?: OpenCloseTimeInput | null,
};

export type OpenCloseTimeInput = {
  day: number,
  time: string,
};

export type RatingInput = {
  score?: number | null,
  count?: number | null,
};

export type MealServicesInput = {
  servesBreakfast?: boolean | null,
  servesBrunch?: boolean | null,
  servesLunch?: boolean | null,
  servesDinner?: boolean | null,
  dineIn?: boolean | null,
  takeout?: boolean | null,
  delivery?: boolean | null,
  servesBeer?: boolean | null,
  servesWine?: boolean | null,
  servesVegetarianFood?: boolean | null,
};

export type PlacePhotoInput = {
  photo_reference?: string | null,
  height?: number | null,
  width?: number | null,
  html_attributions?: Array< string | null > | null,
};

export type ReviewInput = {
  authorName?: string | null,
  authorUrl?: string | null,
  language?: string | null,
  originalLanguage?: string | null,
  profilePhotoUrl?: string | null,
  rating?: number | null,
  relativeTimeDescription?: string | null,
  text?: string | null,
  time?: string | null,
  translated?: boolean | null,
};

export type PlaceWebDataInput = {
  menuLink?: string | null,
  reservationLink?: string | null,
  popularTimes?: DayDataInput | null,
  bestVisitedByPopularTimes?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
  aboutBusiness?: AboutBusinessInput | null,
  reviews?: Array< ReviewInput | null > | null,
};

export type DayDataInput = {
  Sunday?: HourlyDataInput | null,
  Monday?: HourlyDataInput | null,
  Tuesday?: HourlyDataInput | null,
  Wednesday?: HourlyDataInput | null,
  Thursday?: HourlyDataInput | null,
  Friday?: HourlyDataInput | null,
  Saturday?: HourlyDataInput | null,
};

export type HourlyDataInput = {
  hours: Array< HourDataInput >,
};

export type HourDataInput = {
  hour: number,
  value: number,
};

export type AboutBusinessInput = {
  fromTheBusiness?: Array< InfoItemInput | null > | null,
  serviceOptions?: Array< InfoItemInput | null > | null,
  highlights?: Array< InfoItemInput | null > | null,
  popularFor?: Array< InfoItemInput | null > | null,
  accessibility?: Array< InfoItemInput | null > | null,
  offerings?: Array< InfoItemInput | null > | null,
  diningOptions?: Array< InfoItemInput | null > | null,
  amenities?: Array< InfoItemInput | null > | null,
  atmosphere?: Array< InfoItemInput | null > | null,
  crowd?: Array< InfoItemInput | null > | null,
  children?: Array< InfoItemInput | null > | null,
  planning?: Array< InfoItemInput | null > | null,
  payments?: Array< InfoItemInput | null > | null,
};

export type InfoItemInput = {
  name: string,
  affirmative?: boolean | null,
  negative?: boolean | null,
};

export type YelpDataInput = {
  id?: string | null,
  url?: string | null,
  amenities?: Array< InfoItemInput | null > | null,
  price?: number | null,
  categories?: Array< string | null > | null,
  reviews?: Array< ReviewInput | null > | null,
};

export type ModelGooglePlaceConditionInput = {
  isValid?: ModelIntInput | null,
  consecutiveFailedRequests?: ModelIntInput | null,
  dataLastCheckedAt?: ModelStringInput | null,
  dataLastUpdatedAt?: ModelStringInput | null,
  generatedSummary?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGooglePlaceConditionInput | null > | null,
  or?: Array< ModelGooglePlaceConditionInput | null > | null,
  not?: ModelGooglePlaceConditionInput | null,
};

export type UpdateGooglePlaceInput = {
  id: string,
  isValid?: number | null,
  data?: PlaceDataInput | null,
  consecutiveFailedRequests?: number | null,
  dataLastCheckedAt?: string | null,
  dataLastUpdatedAt?: string | null,
  webData?: PlaceWebDataInput | null,
  yelpData?: YelpDataInput | null,
  generatedSummary?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type CreateMessageInput = {
  id?: string | null,
  tripId: string,
  userId: string,
  text?: string | null,
  system?: boolean | null,
  image?: S3ObjectInput | null,
  sent: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelMessageConditionInput = {
  tripId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  text?: ModelStringInput | null,
  system?: ModelBooleanInput | null,
  sent?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessageConditionInput | null > | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  not?: ModelMessageConditionInput | null,
};

export type UpdateMessageInput = {
  id: string,
  tripId?: string | null,
  userId?: string | null,
  text?: string | null,
  system?: boolean | null,
  image?: S3ObjectInput | null,
  sent?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMessageInput = {
  id: string,
};

export type UpdateMinimumVersionInput = {
  id: MinimumVersionName,
  minimumVersion?: string | null,
};

export enum MinimumVersionName {
  MINIMUM_VERSION_REQUIRED = "MINIMUM_VERSION_REQUIRED",
}


export type ModelMinimumVersionConditionInput = {
  id?: ModelMinimumVersionNameInput | null,
  minimumVersion?: ModelStringInput | null,
  and?: Array< ModelMinimumVersionConditionInput | null > | null,
  or?: Array< ModelMinimumVersionConditionInput | null > | null,
  not?: ModelMinimumVersionConditionInput | null,
};

export type ModelMinimumVersionNameInput = {
  eq?: MinimumVersionName | null,
  ne?: MinimumVersionName | null,
};

export type MinimumVersion = {
  __typename: "MinimumVersion",
  id: MinimumVersionName,
  minimumVersion: string,
  createdAt: string,
  updatedAt: string,
};

export type CreateNotificationInput = {
  id?: string | null,
  receiverUserId: string,
  senderUserId: string,
  type: NOTIFICATION_TYPE,
  text?: string | null,
  tripId?: string | null,
  postId?: string | null,
  attractionId?: string | null,
  commentId?: string | null,
  showInApp: number,
};

export type ModelNotificationConditionInput = {
  receiverUserId?: ModelIDInput | null,
  senderUserId?: ModelIDInput | null,
  type?: ModelNOTIFICATION_TYPEInput | null,
  text?: ModelStringInput | null,
  tripId?: ModelIDInput | null,
  postId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  commentId?: ModelIDInput | null,
  showInApp?: ModelIntInput | null,
  and?: Array< ModelNotificationConditionInput | null > | null,
  or?: Array< ModelNotificationConditionInput | null > | null,
  not?: ModelNotificationConditionInput | null,
};

export type ModelNOTIFICATION_TYPEInput = {
  eq?: NOTIFICATION_TYPE | null,
  ne?: NOTIFICATION_TYPE | null,
};

export type Notification = {
  __typename: "Notification",
  id: string,
  receiverUserId: string,
  senderUser?: User | null,
  senderUserId: string,
  type: NOTIFICATION_TYPE,
  text?: string | null,
  tripId?: string | null,
  trip?: Trip | null,
  postId?: string | null,
  post?: Post | null,
  attractionId?: string | null,
  attraction?: Attraction | null,
  commentId?: string | null,
  comment?: Comment | null,
  showInApp: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateNotificationInput = {
  id: string,
  receiverUserId?: string | null,
  senderUserId?: string | null,
  type?: NOTIFICATION_TYPE | null,
  text?: string | null,
  tripId?: string | null,
  postId?: string | null,
  attractionId?: string | null,
  commentId?: string | null,
  showInApp?: number | null,
};

export type DeleteNotificationInput = {
  id: string,
};

export type CreatePhotographerInput = {
  id?: string | null,
  name: string,
  url?: string | null,
  pendingMigration?: boolean | null,
};

export type ModelPhotographerConditionInput = {
  name?: ModelStringInput | null,
  url?: ModelStringInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelPhotographerConditionInput | null > | null,
  or?: Array< ModelPhotographerConditionInput | null > | null,
  not?: ModelPhotographerConditionInput | null,
};

export type Photographer = {
  __typename: "Photographer",
  id: string,
  name: string,
  url?: string | null,
  pendingMigration?: boolean | null,
};

export type UpdatePhotographerInput = {
  id: string,
  name?: string | null,
  url?: string | null,
  pendingMigration?: boolean | null,
};

export type DeletePhotographerInput = {
  id: string,
};

export type CreatePostInput = {
  id?: string | null,
  userId: string,
  tripId: string,
  destinationId?: string | null,
  attractionId?: string | null,
  description?: string | null,
  commentsCount: number,
  mediaType: MEDIA_TYPES,
  cloudinaryUrl: string,
  width: number,
  height: number,
  format?: string | null,
  videoDuration?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
  likesCount: number,
};

export type ModelPostConditionInput = {
  userId?: ModelIDInput | null,
  tripId?: ModelIDInput | null,
  destinationId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  description?: ModelStringInput | null,
  commentsCount?: ModelIntInput | null,
  mediaType?: ModelMEDIA_TYPESInput | null,
  cloudinaryUrl?: ModelStringInput | null,
  width?: ModelIntInput | null,
  height?: ModelIntInput | null,
  format?: ModelStringInput | null,
  videoDuration?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  likesCount?: ModelIntInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
};

export type ModelMEDIA_TYPESInput = {
  eq?: MEDIA_TYPES | null,
  ne?: MEDIA_TYPES | null,
};

export type UpdatePostInput = {
  id: string,
  userId?: string | null,
  tripId?: string | null,
  destinationId?: string | null,
  attractionId?: string | null,
  description?: string | null,
  commentsCount?: number | null,
  mediaType?: MEDIA_TYPES | null,
  cloudinaryUrl?: string | null,
  width?: number | null,
  height?: number | null,
  format?: string | null,
  videoDuration?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
  likesCount?: number | null,
};

export type CreateTimelineEntryInput = {
  id?: string | null,
  tripId: string,
  timelineEntryType: TimelineEntryType,
  notes?: string | null,
  date: number,
  time: number,
  flightDetails?: FlightStatsScheduleDetailsInput | null,
  rentalPickupLocation?: string | null,
  rentalDropoffLocation?: string | null,
  lodgingArrivalNameAndAddress?: string | null,
  lodgingDepartureNameAndAddress?: string | null,
};

export type ModelTimelineEntryConditionInput = {
  tripId?: ModelIDInput | null,
  timelineEntryType?: ModelTimelineEntryTypeInput | null,
  notes?: ModelStringInput | null,
  date?: ModelIntInput | null,
  time?: ModelIntInput | null,
  rentalPickupLocation?: ModelStringInput | null,
  rentalDropoffLocation?: ModelStringInput | null,
  lodgingArrivalNameAndAddress?: ModelStringInput | null,
  lodgingDepartureNameAndAddress?: ModelStringInput | null,
  and?: Array< ModelTimelineEntryConditionInput | null > | null,
  or?: Array< ModelTimelineEntryConditionInput | null > | null,
  not?: ModelTimelineEntryConditionInput | null,
};

export type ModelTimelineEntryTypeInput = {
  eq?: TimelineEntryType | null,
  ne?: TimelineEntryType | null,
};

export type UpdateTimelineEntryInput = {
  id: string,
  tripId?: string | null,
  timelineEntryType?: TimelineEntryType | null,
  notes?: string | null,
  date?: number | null,
  time?: number | null,
  flightDetails?: FlightStatsScheduleDetailsInput | null,
  rentalPickupLocation?: string | null,
  rentalDropoffLocation?: string | null,
  lodgingArrivalNameAndAddress?: string | null,
  lodgingDepartureNameAndAddress?: string | null,
};

export type CreateTimelineEntryMemberInput = {
  timelineEntryId: string,
  userId: string,
};

export type ModelTimelineEntryMemberConditionInput = {
  and?: Array< ModelTimelineEntryMemberConditionInput | null > | null,
  or?: Array< ModelTimelineEntryMemberConditionInput | null > | null,
  not?: ModelTimelineEntryMemberConditionInput | null,
};

export type DeleteTimelineEntryMemberInput = {
  timelineEntryId: string,
  userId: string,
};

export type CreateTripInput = {
  id?: string | null,
  name: string,
  completed?: boolean | null,
  link?: string | null,
};

export type ModelTripConditionInput = {
  name?: ModelStringInput | null,
  completed?: ModelBooleanInput | null,
  link?: ModelStringInput | null,
  and?: Array< ModelTripConditionInput | null > | null,
  or?: Array< ModelTripConditionInput | null > | null,
  not?: ModelTripConditionInput | null,
};

export type ModelTripDestinationConditionInput = {
  startDate?: ModelIntInput | null,
  endDate?: ModelIntInput | null,
  startTime?: ModelTripDestinationTimeInput | null,
  endTime?: ModelTripDestinationTimeInput | null,
  and?: Array< ModelTripDestinationConditionInput | null > | null,
  or?: Array< ModelTripDestinationConditionInput | null > | null,
  not?: ModelTripDestinationConditionInput | null,
};

export type ModelTripDestinationTimeInput = {
  eq?: TripDestinationTime | null,
  ne?: TripDestinationTime | null,
};

export type CreateTripDestinationUserInput = {
  tripId: string,
  destinationId: string,
  userId: string,
  isReady: boolean,
  tripPlanViewedAt?: string | null,
};

export type ModelTripDestinationUserConditionInput = {
  isReady?: ModelBooleanInput | null,
  tripPlanViewedAt?: ModelStringInput | null,
  and?: Array< ModelTripDestinationUserConditionInput | null > | null,
  or?: Array< ModelTripDestinationUserConditionInput | null > | null,
  not?: ModelTripDestinationUserConditionInput | null,
};

export type UpdateTripDestinationUserInput = {
  tripId: string,
  destinationId: string,
  userId: string,
  isReady?: boolean | null,
  tripPlanViewedAt?: string | null,
};

export type DeleteTripDestinationUserInput = {
  tripId: string,
  destinationId: string,
  userId: string,
};

export type CreateTripPlanLogInput = {
  tripPlan: Array< TripPlanLogDayInput >,
  createdAt?: string | null,
  id?: string | null,
};

export type TripPlanLogDayInput = {
  dayOfYear: number,
  tripPlanDayItems: Array< TripPlanLogItemInput | null >,
};

export type TripPlanLogItemInput = {
  attractionId: string,
  locId: string,
};

export type ModelTripPlanLogConditionInput = {
  createdAt?: ModelStringInput | null,
  and?: Array< ModelTripPlanLogConditionInput | null > | null,
  or?: Array< ModelTripPlanLogConditionInput | null > | null,
  not?: ModelTripPlanLogConditionInput | null,
};

export type TripPlanLog = {
  __typename: "TripPlanLog",
  tripPlan:  Array<TripPlanLogDay >,
  createdAt: string,
  id: string,
  updatedAt: string,
};

export type TripPlanLogDay = {
  __typename: "TripPlanLogDay",
  dayOfYear: number,
  tripPlanDayItems:  Array<TripPlanLogItem | null >,
};

export type TripPlanLogItem = {
  __typename: "TripPlanLogItem",
  attractionId: string,
  locId: string,
};

export type CreateUpdateInput = {
  type: UpdateType,
  parityLastProcessed: Parity,
  createdAt?: string | null,
  updatedAt?: string | null,
  id?: string | null,
};

export enum UpdateType {
  DESTINATION_NEARBY_ATTRACTION_COUNT = "DESTINATION_NEARBY_ATTRACTION_COUNT",
}


export enum Parity {
  ODD = "ODD",
  EVEN = "EVEN",
  ALL = "ALL",
}


export type ModelUpdateConditionInput = {
  type?: ModelUpdateTypeInput | null,
  parityLastProcessed?: ModelParityInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUpdateConditionInput | null > | null,
  or?: Array< ModelUpdateConditionInput | null > | null,
  not?: ModelUpdateConditionInput | null,
};

export type ModelUpdateTypeInput = {
  eq?: UpdateType | null,
  ne?: UpdateType | null,
};

export type ModelParityInput = {
  eq?: Parity | null,
  ne?: Parity | null,
};

export type Update = {
  __typename: "Update",
  type: UpdateType,
  parityLastProcessed: Parity,
  createdAt: string,
  updatedAt: string,
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  appleId?: string | null,
  avatar?: S3ObjectInput | null,
  dateOfBirth?: string | null,
  description?: string | null,
  email?: string | null,
  contactEmail?: string | null,
  facebookId?: string | null,
  fcmToken?: string | null,
  googleId?: string | null,
  location?: string | null,
  name?: string | null,
  phone?: string | null,
  privacy?: PRIVACY | null,
  pushNotifications?: boolean | null,
  referralLink?: string | null,
  username?: string | null,
  createdAt?: string | null,
};

export type ModelUserConditionInput = {
  appleId?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  contactEmail?: ModelStringInput | null,
  facebookId?: ModelStringInput | null,
  fcmToken?: ModelStringInput | null,
  googleId?: ModelStringInput | null,
  location?: ModelStringInput | null,
  name?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  privacy?: ModelPRIVACYInput | null,
  pushNotifications?: ModelBooleanInput | null,
  referralLink?: ModelStringInput | null,
  username?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelPRIVACYInput = {
  eq?: PRIVACY | null,
  ne?: PRIVACY | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelUserBlockConditionInput = {
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserBlockConditionInput | null > | null,
  or?: Array< ModelUserBlockConditionInput | null > | null,
  not?: ModelUserBlockConditionInput | null,
};

export type UpdateUserBlockInput = {
  userId: string,
  blockedUserId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserBlockInput = {
  userId: string,
  blockedUserId: string,
};

export type CreateUserContactInput = {
  userId: string,
  recordId: string,
  travaUserIds?: Array< string | null > | null,
  name?: string | null,
  email?: Array< string | null > | null,
  phone?: Array< string | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelUserContactConditionInput = {
  travaUserIds?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserContactConditionInput | null > | null,
  or?: Array< ModelUserContactConditionInput | null > | null,
  not?: ModelUserContactConditionInput | null,
};

export type UserContact = {
  __typename: "UserContact",
  userId: string,
  recordId: string,
  travaUserIds?: Array< string | null > | null,
  name?: string | null,
  email?: Array< string | null > | null,
  phone?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserContactInput = {
  userId: string,
  recordId: string,
  travaUserIds?: Array< string | null > | null,
  name?: string | null,
  email?: Array< string | null > | null,
  phone?: Array< string | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserContactInput = {
  userId: string,
  recordId: string,
};

export type ModelUserFollowConditionInput = {
  approved?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFollowConditionInput | null > | null,
  or?: Array< ModelUserFollowConditionInput | null > | null,
  not?: ModelUserFollowConditionInput | null,
};

export type DeleteUserFollowInput = {
  userId: string,
  followedUserId: string,
};

export type CreateUserPostInput = {
  userId: string,
  postId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelUserPostConditionInput = {
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserPostConditionInput | null > | null,
  or?: Array< ModelUserPostConditionInput | null > | null,
  not?: ModelUserPostConditionInput | null,
};

export type ModelUserReferralConditionInput = {
  referralType?: ModelREFERRAL_TYPESInput | null,
  sourceOS?: ModelStringInput | null,
  matchGuaranteed?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserReferralConditionInput | null > | null,
  or?: Array< ModelUserReferralConditionInput | null > | null,
  not?: ModelUserReferralConditionInput | null,
};

export type ModelREFERRAL_TYPESInput = {
  eq?: REFERRAL_TYPES | null,
  ne?: REFERRAL_TYPES | null,
};

export type CreateUserSessionInput = {
  id?: string | null,
  userId: string,
  deviceType: PLATFORM,
  appVersion: string,
  label: UserSessionLabel,
  createdAt?: string | null,
};

export enum UserSessionLabel {
  SESSION = "SESSION",
}


export type ModelUserSessionConditionInput = {
  userId?: ModelIDInput | null,
  deviceType?: ModelPLATFORMInput | null,
  appVersion?: ModelStringInput | null,
  label?: ModelUserSessionLabelInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserSessionConditionInput | null > | null,
  or?: Array< ModelUserSessionConditionInput | null > | null,
  not?: ModelUserSessionConditionInput | null,
};

export type ModelPLATFORMInput = {
  eq?: PLATFORM | null,
  ne?: PLATFORM | null,
};

export type ModelUserSessionLabelInput = {
  eq?: UserSessionLabel | null,
  ne?: UserSessionLabel | null,
};

export type UserSession = {
  __typename: "UserSession",
  id: string,
  userId: string,
  user?: User | null,
  deviceType: PLATFORM,
  appVersion: string,
  label: UserSessionLabel,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserTripConditionInput = {
  status?: ModelUserTripStatusInput | null,
  invitedByUserId?: ModelIDInput | null,
  inviteLink?: ModelStringInput | null,
  lastMessageReadDate?: ModelStringInput | null,
  and?: Array< ModelUserTripConditionInput | null > | null,
  or?: Array< ModelUserTripConditionInput | null > | null,
  not?: ModelUserTripConditionInput | null,
};

export type ModelUserTripStatusInput = {
  eq?: UserTripStatus | null,
  ne?: UserTripStatus | null,
};

export type CreateViatorProductInput = {
  id?: string | null,
  attractionId: string,
  viatorLink: string,
  name: string,
  priceText: string,
  rating: RatingInput,
  coverImageUrl: string,
  displayOrder: number,
  duration?: string | null,
  pricing?: string | null,
  currency?: string | null,
  createdAt?: string | null,
};

export type ModelViatorProductConditionInput = {
  attractionId?: ModelIDInput | null,
  viatorLink?: ModelStringInput | null,
  name?: ModelStringInput | null,
  priceText?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  displayOrder?: ModelIntInput | null,
  duration?: ModelStringInput | null,
  pricing?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelViatorProductConditionInput | null > | null,
  or?: Array< ModelViatorProductConditionInput | null > | null,
  not?: ModelViatorProductConditionInput | null,
};

export type SignUpInput = {
  email?: string | null,
  phone?: string | null,
  dateOfBirth: string,
  name: string,
  username: string,
  privacy: string,
  password: string,
};

export type SignUpResponse = {
  __typename: "SignUpResponse",
  id?: string | null,
  destination?: string | null,
};

export type TripPlanAttraction = {
  attractionId: string,
  name: string,
  type?: string | null,
  locations: Array< TripPlanStartEndLocation | null >,
  duration?: number | null,
  preferredTime?: Array< string | null > | null,
  category?: string | null,
  seasons?: Array< Season | null > | null,
  travaCard?: boolean | null,
};

export type TripPlanStartEndLocation = {
  id: string,
  startLoc: TripPlanLocation,
  endLoc: TripPlanLocation,
};

export type TripPlanLocation = {
  id: string,
  googlePlaceId: string,
  coords: CoordsInput,
  hours?: TripPlanLocationHoursInput | null,
};

export type TripPlanLocationHoursInput = {
  periods: Array< PeriodInput >,
};

export type Season = {
  startMonth?: number | null,
  startDay?: number | null,
  endMonth?: number | null,
  endDay?: number | null,
};

export type TripPlanGroup = {
  ratings: Array< Array< number | null > | null >,
  nDays: number,
  startTime: string,
  endTime: string,
  startDate: number,
};

export type GenerateTripPlanConfigInput = {
  weights?: TripPlanWeights | null,
  thresholds?: TripPlanThresholds | null,
  maxPreferredTimes?: number | null,
  busyness?: number | null,
  breakfast?: boolean | null,
};

export type TripPlanWeights = {
  rating?: number | null,
  distance?: number | null,
  category?: number | null,
  dayTime?: number | null,
};

export type TripPlanThresholds = {
  rating?: number | null,
};

export type TripPlanResponse = {
  __typename: "TripPlanResponse",
  plan:  Array<TripPlanItem | null >,
};

export type TripPlanItem = {
  __typename: "TripPlanItem",
  day: number,
  order: number,
  attractionId: string,
  locId: string,
};

export type GetAttractionPhotosInput = {
  attractionId: string,
  photos?: Array< PlacePhotoInput | null > | null,
};

export type MapBoxAttractionLocationsInput = {
  locations: Array< Array< MapBoxAttractionLocationInput > >,
};

export type MapBoxAttractionLocationInput = {
  attractionId: string,
  long: number,
  lat: number,
};

export type MapboxGetDistancesResult = {
  __typename: "MapboxGetDistancesResult",
  locations:  Array<DistanceBetweenLocations >,
};

export type DistanceBetweenLocations = {
  __typename: "DistanceBetweenLocations",
  attractionId_1: string,
  attractionId_2: string,
  distance: number,
};

export type MapboxGetPlacesInput = {
  location: string,
  language?: string | null,
  bounds?: Array< number | null > | null,
  types: Array< string >,
  limit?: number | null,
};

export type MapboxGetPlacesResult = {
  __typename: "MapboxGetPlacesResult",
  location?: MapBoxGetPlacesLocation | null,
  placeName: string,
};

export type MapBoxGetPlacesLocation = {
  __typename: "MapBoxGetPlacesLocation",
  street?: string | null,
  number?: string | null,
  city?: string | null,
  state?: string | null,
  postCode?: string | null,
  coords: Coords,
  country?: string | null,
};

export type MapboxGetTokenResult = {
  __typename: "MapboxGetTokenResult",
  token: string,
};

export type GetAttractionsToTagToPostInput = {
  searchString?: string | null,
  radius?: number | null,
  destinationCoords?: CoordsInput | null,
};

export type GetAttractionsToTagToPostResponse = {
  __typename: "GetAttractionsToTagToPostResponse",
  attractions?:  Array<AttractionToTagToPostItem | null > | null,
};

export type AttractionToTagToPostItem = {
  __typename: "AttractionToTagToPostItem",
  id: string,
  name: string,
  destinationName?: string | null,
  attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
  bucketListCount: number,
  type: ATTRACTION_TYPE,
  author?: SearchAttractionAuthorItem | null,
  images?:  Array<S3Object | null > | null,
  isTravaCreated: number,
};

export type GoogleGetPlacesInput = {
  input: string,
  location?: GoogleCoordinates | null,
  radius?: number | null,
  strictbounds?: boolean | null,
  language?: string | null,
  types?: Array< string > | null,
};

export type GoogleCoordinates = {
  latitude: number,
  longitude: number,
};

export type GoogleGetPlacesResult = {
  __typename: "GoogleGetPlacesResult",
  mainText?: string | null,
  secondaryText?: string | null,
  placeId?: string | null,
  types?: Array< string | null > | null,
};

export type GoogleGetPlaceDetailsInput = {
  placeId: string,
};

export type GoogleGetPlaceDetailsResult = {
  __typename: "GoogleGetPlaceDetailsResult",
  location?: GoogleGetPlaceDetailsLocation | null,
  placeName?: string | null,
};

export type GoogleGetPlaceDetailsLocation = {
  __typename: "GoogleGetPlaceDetailsLocation",
  coords: Coords,
  city?: string | null,
  state?: string | null,
  country?: string | null,
  continent?: string | null,
  googlePlaceId: string,
  formattedAddress?: string | null,
  googlePlacePageLink?: string | null,
  websiteLink?: string | null,
  phone?: string | null,
  hours?: Hours | null,
  businessStatus?: BusinessStatus | null,
  googleRating?: Rating | null,
  timezone?: string | null,
};

export type FlightStatsGetScheduleDetailsInput = {
  carrier: string,
  flightNumber: number,
  year: number,
  month: number,
  day: number,
  codeType?: string | null,
};

export type HomeTabsFeedResponse = {
  __typename: "HomeTabsFeedResponse",
  stories?:  Array<Story | null > | null,
};

export type Story = {
  __typename: "Story",
  storyId: string,
  story:  Array<PostWithinStory | null >,
};

export type PostWithinStory = {
  __typename: "PostWithinStory",
  id: string,
  createdAt: string,
  userId: string,
  tripId: string,
  membersLength: number,
  description: string,
  cloudinaryUrl: string,
  avatar?: S3Object | null,
  username: string,
  authorPublic?: boolean | null,
  viewed: boolean,
  destinationState?: string | null,
  destinationCountry?: string | null,
  destinationIcon?: string | null,
  destinationCoverImage?: S3Object | null,
  destinationName?: string | null,
  attractionId?: string | null,
  attractionName?: string | null,
  attractionImage?: S3Object | null,
  likesCount: number,
  commentsCount: number,
  mediaType: MEDIA_TYPES,
  videoDuration?: number | null,
};

export type HomeTabsFeedPeopleOnThisTripInput = {
  userId: string,
  tripId: string,
};

export type HomeTabsFeedPeopleOnThisTripResponse = {
  __typename: "HomeTabsFeedPeopleOnThisTripResponse",
  members?:  Array<UserTrip | null > | null,
  userFollows?:  Array<UserFollow | null > | null,
};

export type HomeTabsFeedPostCommentsInput = {
  postId: string,
};

export type HomeTabsFeedPostCommentsResponse = {
  __typename: "HomeTabsFeedPostCommentsResponse",
  id: string,
  userId: string,
  tripId: string,
  avatar?: S3Object | null,
  username: string,
  membersLength: number,
  description?: string | null,
  comments?:  Array<HomeTabsFeedPostCommentsResponseComment | null > | null,
};

export type HomeTabsFeedPostCommentsResponseComment = {
  __typename: "HomeTabsFeedPostCommentsResponseComment",
  id: string,
  userId: string,
  username: string,
  avatar?: S3Object | null,
  text: string,
  updatedAt: string,
};

export type HomeTabsAccountTripsInput = {
  id: string,
};

export type HomeTabsAccountTripsResponse = {
  __typename: "HomeTabsAccountTripsResponse",
  stories?:  Array<StoryAccountTrips | null > | null,
};

export type StoryAccountTrips = {
  __typename: "StoryAccountTrips",
  storyId: string,
  story:  Array<PostWithinStoryAccountTrips | null >,
};

export type PostWithinStoryAccountTrips = {
  __typename: "PostWithinStoryAccountTrips",
  id: string,
  createdAt: string,
  userId: string,
  tripId: string,
  membersLength: number,
  description: string,
  cloudinaryUrl: string,
  avatar?: S3Object | null,
  username: string,
  authorPublic?: boolean | null,
  viewed: boolean,
  dateRange: string,
  destinations: string,
  destinationId?: string | null,
  destinationIcon?: string | null,
  destinationCoverImage?: S3Object | null,
  destinationName?: string | null,
  destinationState?: string | null,
  destinationCountry?: string | null,
  destinationGooglePlaceId?: string | null,
  attractionId?: string | null,
  attractionName?: string | null,
  attractionImage?: S3Object | null,
  likesCount: number,
  commentsCount: number,
  mediaType: MEDIA_TYPES,
  videoDuration?: number | null,
};

export type HomeTabsSuggestedFeedInput = {
  sharedPostId?: string | null,
  referringUserId?: string | null,
};

export type HomeTabsSuggestedFeedResponse = {
  __typename: "HomeTabsSuggestedFeedResponse",
  stories?:  Array<Story | null > | null,
  sharedPostError?: SharedPostError | null,
  referringUserInfo?: ReferringUserInfo | null,
};

export type SharedPostError = {
  __typename: "SharedPostError",
  type: SHARED_POST_ERROR_TYPE,
  authorId?: string | null,
  authorUsername?: string | null,
  authorAvatar?: S3Object | null,
};

export enum SHARED_POST_ERROR_TYPE {
  PRIVATE_POST = "PRIVATE_POST",
  POST_DELETED = "POST_DELETED",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  BLOCKED_USER = "BLOCKED_USER",
  BLOCKED_AUTHOR = "BLOCKED_AUTHOR",
}


export type ReferringUserInfo = {
  __typename: "ReferringUserInfo",
  id: string,
  avatar?: S3Object | null,
  username: string,
};

export type NotificationPostInput = {
  id: string,
};

export type NotificationPostResponse = {
  __typename: "NotificationPostResponse",
  post?: NotificationPost | null,
};

export type NotificationPost = {
  __typename: "NotificationPost",
  id: string,
  createdAt: string,
  userId: string,
  tripId: string,
  membersLength: number,
  description: string,
  cloudinaryUrl: string,
  avatar?: S3Object | null,
  username: string,
  authorPublic?: boolean | null,
  destinationId?: string | null,
  destinationIcon?: string | null,
  destinationCoverImage?: S3Object | null,
  destinationName?: string | null,
  destinationState?: string | null,
  destinationCountry?: string | null,
  attractionId?: string | null,
  attractionName?: string | null,
  attractionImage?: S3Object | null,
  likesCount: number,
  commentsCount: number,
  mediaType?: MEDIA_TYPES | null,
  deletedAt?: string | null,
};

export type GetUserContactsResponse = {
  __typename: "GetUserContactsResponse",
  contactsOnTrava:  Array<SearchUser >,
  contactsNotOnTrava:  Array<Contact >,
  userContactsOnTravaIds: Array< string >,
};

export type SearchUser = {
  __typename: "SearchUser",
  id: string,
  username?: string | null,
  email?: string | null,
  phone?: string | null,
  name?: string | null,
  avatar?: S3Object | null,
  createdAt: string,
  updatedAt: string,
  bucketListsCollected?: number | null,
};

export type Contact = {
  __typename: "Contact",
  emailAddresses: Array< string | null >,
  phoneNumbers: Array< string | null >,
  name?: string | null,
  id: string,
};

export type OpenSearchDestinationsInput = {
  searchString?: string | null,
  centerCoords?: CoordsInput | null,
};

export type OpenSearchDestinationsResponse = {
  __typename: "OpenSearchDestinationsResponse",
  featured?:  Array<SearchDestinationItem | null > | null,
  other?:  Array<SearchDestinationItem | null > | null,
};

export type SearchDestinationItem = {
  __typename: "SearchDestinationItem",
  id: string,
  name: string,
  icon?: string | null,
  coords: Coords,
  state?: string | null,
  country?: string | null,
  numberOfExperiences?: number | null,
};

export type ExploreTopUsersResponse = {
  __typename: "ExploreTopUsersResponse",
  users?:  Array<SearchUser | null > | null,
};

export type GetGoogleAPIKeyInput = {
  platform: PLATFORM,
  isDev: boolean,
};

export type GoogleGetAPIKeyResult = {
  __typename: "GoogleGetAPIKeyResult",
  key: string,
};

export type ModelAttractionFilterInput = {
  id?: ModelIDInput | null,
  attractionCategories?: ModelATTRACTION_CATEGORY_TYPEListInput | null,
  attractionCuisine?: ModelATTRACTION_CUISINE_TYPEListInput | null,
  attractionTargetGroups?: ModelATTRACTION_TARGET_GROUPListInput | null,
  authorId?: ModelIDInput | null,
  authorType?: ModelAUTHOR_TYPEInput | null,
  bestVisited?: ModelATTRACTION_BEST_VISIT_TIMEListInput | null,
  costCurrency?: ModelCURRENCY_TYPEInput | null,
  cost?: ModelATTRACTION_COSTInput | null,
  costNote?: ModelStringInput | null,
  costType?: ModelATTRACTION_COST_TYPEInput | null,
  descriptionLong?: ModelStringInput | null,
  descriptionShort?: ModelStringInput | null,
  destinationId?: ModelIDInput | null,
  duration?: ModelATTRACTION_DURATIONInput | null,
  reservation?: ModelATTRACTION_RESERVATIONInput | null,
  name?: ModelStringInput | null,
  reservationNote?: ModelStringInput | null,
  type?: ModelATTRACTION_TYPEInput | null,
  isTravaCreated?: ModelIntInput | null,
  deletedAt?: ModelStringInput | null,
  privacy?: ModelATTRACTION_PRIVACYInput | null,
  bucketListCount?: ModelIntInput | null,
  rank?: ModelIntInput | null,
  label?: ModelAttractionLabelInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  recommendationBadges?: ModelBADGESListInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelAttractionFilterInput | null > | null,
  or?: Array< ModelAttractionFilterInput | null > | null,
  not?: ModelAttractionFilterInput | null,
};

export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type SearchableAttractionFilterInput = {
  id?: SearchableIDFilterInput | null,
  authorId?: SearchableIDFilterInput | null,
  costNote?: SearchableStringFilterInput | null,
  descriptionLong?: SearchableStringFilterInput | null,
  descriptionShort?: SearchableStringFilterInput | null,
  destinationId?: SearchableIDFilterInput | null,
  name?: SearchableStringFilterInput | null,
  reservationNote?: SearchableStringFilterInput | null,
  isTravaCreated?: SearchableIntFilterInput | null,
  deletedAt?: SearchableStringFilterInput | null,
  bucketListCount?: SearchableIntFilterInput | null,
  rank?: SearchableIntFilterInput | null,
  createdAt?: SearchableStringFilterInput | null,
  updatedAt?: SearchableStringFilterInput | null,
  pendingMigration?: SearchableBooleanFilterInput | null,
  attractionCategories?: SearchableStringFilterInput | null,
  attractionCuisine?: SearchableStringFilterInput | null,
  attractionTargetGroups?: SearchableStringFilterInput | null,
  authorType?: SearchableStringFilterInput | null,
  bestVisited?: SearchableStringFilterInput | null,
  costCurrency?: SearchableStringFilterInput | null,
  cost?: SearchableStringFilterInput | null,
  costType?: SearchableStringFilterInput | null,
  duration?: SearchableStringFilterInput | null,
  reservation?: SearchableStringFilterInput | null,
  type?: SearchableStringFilterInput | null,
  privacy?: SearchableStringFilterInput | null,
  label?: SearchableStringFilterInput | null,
  recommendationBadges?: SearchableStringFilterInput | null,
  and?: Array< SearchableAttractionFilterInput | null > | null,
  or?: Array< SearchableAttractionFilterInput | null > | null,
  not?: SearchableAttractionFilterInput | null,
};

export type SearchableIDFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
  range?: Array< string | null > | null,
};

export type SearchableStringFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
  range?: Array< string | null > | null,
};

export type SearchableIntFilterInput = {
  ne?: number | null,
  gt?: number | null,
  lt?: number | null,
  gte?: number | null,
  lte?: number | null,
  eq?: number | null,
  range?: Array< number | null > | null,
};

export type SearchableBooleanFilterInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type SearchableAttractionSortInput = {
  field?: SearchableAttractionSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchableAttractionSortableFields {
  id = "id",
  authorId = "authorId",
  costNote = "costNote",
  descriptionLong = "descriptionLong",
  descriptionShort = "descriptionShort",
  destinationId = "destinationId",
  name = "name",
  reservationNote = "reservationNote",
  isTravaCreated = "isTravaCreated",
  deletedAt = "deletedAt",
  bucketListCount = "bucketListCount",
  rank = "rank",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  pendingMigration = "pendingMigration",
}


export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc",
}


export type SearchableAttractionAggregationInput = {
  name: string,
  type: SearchableAggregateType,
  field: SearchableAttractionAggregateField,
};

export enum SearchableAggregateType {
  terms = "terms",
  avg = "avg",
  min = "min",
  max = "max",
  sum = "sum",
}


export enum SearchableAttractionAggregateField {
  id = "id",
  attractionCategories = "attractionCategories",
  attractionCuisine = "attractionCuisine",
  attractionTargetGroups = "attractionTargetGroups",
  authorId = "authorId",
  authorType = "authorType",
  bestVisited = "bestVisited",
  costCurrency = "costCurrency",
  cost = "cost",
  costNote = "costNote",
  costType = "costType",
  descriptionLong = "descriptionLong",
  descriptionShort = "descriptionShort",
  destinationId = "destinationId",
  duration = "duration",
  reservation = "reservation",
  name = "name",
  reservationNote = "reservationNote",
  type = "type",
  isTravaCreated = "isTravaCreated",
  deletedAt = "deletedAt",
  privacy = "privacy",
  bucketListCount = "bucketListCount",
  rank = "rank",
  label = "label",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  recommendationBadges = "recommendationBadges",
  pendingMigration = "pendingMigration",
}


export type SearchableAttractionConnection = {
  __typename: "SearchableAttractionConnection",
  items:  Array<Attraction | null >,
  nextToken?: string | null,
  total?: number | null,
  aggregateItems:  Array<SearchableAggregateResult | null >,
};

export type SearchableAggregateResult = {
  __typename: "SearchableAggregateResult",
  name: string,
  result?: SearchableAggregateGenericResult | null,
};

export type SearchableAggregateGenericResult = SearchableAggregateScalarResult | SearchableAggregateBucketResult


export type SearchableAggregateScalarResult = {
  __typename: "SearchableAggregateScalarResult",
  value: number,
};

export type SearchableAggregateBucketResult = {
  __typename: "SearchableAggregateBucketResult",
  buckets?:  Array<SearchableAggregateBucketResultItem | null > | null,
};

export type SearchableAggregateBucketResultItem = {
  __typename: "SearchableAggregateBucketResultItem",
  key: string,
  doc_count: number,
};

export type ModelAttractionSwipeFilterInput = {
  userId?: ModelIDInput | null,
  tripId?: ModelIDInput | null,
  destinationId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  swipe?: ModelAttractionSwipeResultInput | null,
  label?: ModelAttractionSwipeLabelInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAttractionSwipeFilterInput | null > | null,
  or?: Array< ModelAttractionSwipeFilterInput | null > | null,
  not?: ModelAttractionSwipeFilterInput | null,
};

export type ModelDestinationFilterInput = {
  id?: ModelIDInput | null,
  authorId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  timezone?: ModelStringInput | null,
  nearbyThingsToDoCount?: ModelIntInput | null,
  nearbyPlacesToEatCount?: ModelIntInput | null,
  nearbyTravaThingsToDoCount?: ModelIntInput | null,
  nearbyTravaPlacesToEatCount?: ModelIntInput | null,
  state?: ModelStringInput | null,
  country?: ModelStringInput | null,
  continent?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  isTravaCreated?: ModelIntInput | null,
  googlePlaceId?: ModelStringInput | null,
  featured?: ModelBooleanInput | null,
  altName?: ModelStringInput | null,
  label?: ModelStringInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelDestinationFilterInput | null > | null,
  or?: Array< ModelDestinationFilterInput | null > | null,
  not?: ModelDestinationFilterInput | null,
};

export type ModelDestinationConnection = {
  __typename: "ModelDestinationConnection",
  items:  Array<Destination | null >,
  nextToken?: string | null,
};

export type SearchableDestinationFilterInput = {
  id?: SearchableIDFilterInput | null,
  authorId?: SearchableIDFilterInput | null,
  name?: SearchableStringFilterInput | null,
  icon?: SearchableStringFilterInput | null,
  timezone?: SearchableStringFilterInput | null,
  nearbyThingsToDoCount?: SearchableIntFilterInput | null,
  nearbyPlacesToEatCount?: SearchableIntFilterInput | null,
  nearbyTravaThingsToDoCount?: SearchableIntFilterInput | null,
  nearbyTravaPlacesToEatCount?: SearchableIntFilterInput | null,
  state?: SearchableStringFilterInput | null,
  country?: SearchableStringFilterInput | null,
  continent?: SearchableStringFilterInput | null,
  deletedAt?: SearchableStringFilterInput | null,
  isTravaCreated?: SearchableIntFilterInput | null,
  googlePlaceId?: SearchableStringFilterInput | null,
  featured?: SearchableBooleanFilterInput | null,
  altName?: SearchableStringFilterInput | null,
  label?: SearchableStringFilterInput | null,
  pendingMigration?: SearchableBooleanFilterInput | null,
  createdAt?: SearchableStringFilterInput | null,
  updatedAt?: SearchableStringFilterInput | null,
  and?: Array< SearchableDestinationFilterInput | null > | null,
  or?: Array< SearchableDestinationFilterInput | null > | null,
  not?: SearchableDestinationFilterInput | null,
};

export type SearchableDestinationSortInput = {
  field?: SearchableDestinationSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchableDestinationSortableFields {
  id = "id",
  authorId = "authorId",
  name = "name",
  icon = "icon",
  timezone = "timezone",
  nearbyThingsToDoCount = "nearbyThingsToDoCount",
  nearbyPlacesToEatCount = "nearbyPlacesToEatCount",
  nearbyTravaThingsToDoCount = "nearbyTravaThingsToDoCount",
  nearbyTravaPlacesToEatCount = "nearbyTravaPlacesToEatCount",
  state = "state",
  country = "country",
  continent = "continent",
  deletedAt = "deletedAt",
  isTravaCreated = "isTravaCreated",
  googlePlaceId = "googlePlaceId",
  featured = "featured",
  altName = "altName",
  label = "label",
  pendingMigration = "pendingMigration",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}


export type SearchableDestinationAggregationInput = {
  name: string,
  type: SearchableAggregateType,
  field: SearchableDestinationAggregateField,
};

export enum SearchableDestinationAggregateField {
  id = "id",
  authorId = "authorId",
  name = "name",
  icon = "icon",
  timezone = "timezone",
  nearbyThingsToDoCount = "nearbyThingsToDoCount",
  nearbyPlacesToEatCount = "nearbyPlacesToEatCount",
  nearbyTravaThingsToDoCount = "nearbyTravaThingsToDoCount",
  nearbyTravaPlacesToEatCount = "nearbyTravaPlacesToEatCount",
  state = "state",
  country = "country",
  continent = "continent",
  deletedAt = "deletedAt",
  isTravaCreated = "isTravaCreated",
  googlePlaceId = "googlePlaceId",
  featured = "featured",
  altName = "altName",
  label = "label",
  pendingMigration = "pendingMigration",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}


export type SearchableDestinationConnection = {
  __typename: "SearchableDestinationConnection",
  items:  Array<Destination | null >,
  nextToken?: string | null,
  total?: number | null,
  aggregateItems:  Array<SearchableAggregateResult | null >,
};

export type ModelFeatureFlagFilterInput = {
  id?: ModelFeatureFlagNameInput | null,
  isEnabled?: ModelBooleanInput | null,
  and?: Array< ModelFeatureFlagFilterInput | null > | null,
  or?: Array< ModelFeatureFlagFilterInput | null > | null,
  not?: ModelFeatureFlagFilterInput | null,
};

export type ModelFeatureFlagConnection = {
  __typename: "ModelFeatureFlagConnection",
  items:  Array<FeatureFlag | null >,
  nextToken?: string | null,
};

export type ModelGooglePlaceFilterInput = {
  id?: ModelIDInput | null,
  isValid?: ModelIntInput | null,
  consecutiveFailedRequests?: ModelIntInput | null,
  dataLastCheckedAt?: ModelStringInput | null,
  dataLastUpdatedAt?: ModelStringInput | null,
  generatedSummary?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGooglePlaceFilterInput | null > | null,
  or?: Array< ModelGooglePlaceFilterInput | null > | null,
  not?: ModelGooglePlaceFilterInput | null,
};

export type ModelGooglePlaceConnection = {
  __typename: "ModelGooglePlaceConnection",
  items:  Array<GooglePlace | null >,
  nextToken?: string | null,
};

export type ModelNotificationFilterInput = {
  id?: ModelIDInput | null,
  receiverUserId?: ModelIDInput | null,
  senderUserId?: ModelIDInput | null,
  type?: ModelNOTIFICATION_TYPEInput | null,
  text?: ModelStringInput | null,
  tripId?: ModelIDInput | null,
  postId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  commentId?: ModelIDInput | null,
  showInApp?: ModelIntInput | null,
  and?: Array< ModelNotificationFilterInput | null > | null,
  or?: Array< ModelNotificationFilterInput | null > | null,
  not?: ModelNotificationFilterInput | null,
};

export type ModelNotificationConnection = {
  __typename: "ModelNotificationConnection",
  items:  Array<Notification | null >,
  nextToken?: string | null,
};

export type ModelPhotographerFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  url?: ModelStringInput | null,
  pendingMigration?: ModelBooleanInput | null,
  and?: Array< ModelPhotographerFilterInput | null > | null,
  or?: Array< ModelPhotographerFilterInput | null > | null,
  not?: ModelPhotographerFilterInput | null,
};

export type ModelPhotographerConnection = {
  __typename: "ModelPhotographerConnection",
  items:  Array<Photographer | null >,
  nextToken?: string | null,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  tripId?: ModelIDInput | null,
  destinationId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  description?: ModelStringInput | null,
  commentsCount?: ModelIntInput | null,
  mediaType?: ModelMEDIA_TYPESInput | null,
  cloudinaryUrl?: ModelStringInput | null,
  width?: ModelIntInput | null,
  height?: ModelIntInput | null,
  format?: ModelStringInput | null,
  videoDuration?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  likesCount?: ModelIntInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
};

export type ModelTripDestinationUserPrimaryCompositeKeyConditionInput = {
  eq?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
  le?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
  lt?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
  ge?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
  gt?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
  between?: Array< ModelTripDestinationUserPrimaryCompositeKeyInput | null > | null,
  beginsWith?: ModelTripDestinationUserPrimaryCompositeKeyInput | null,
};

export type ModelTripDestinationUserPrimaryCompositeKeyInput = {
  destinationId?: string | null,
  userId?: string | null,
};

export type ModelTripDestinationUserFilterInput = {
  tripId?: ModelIDInput | null,
  destinationId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  isReady?: ModelBooleanInput | null,
  tripPlanViewedAt?: ModelStringInput | null,
  and?: Array< ModelTripDestinationUserFilterInput | null > | null,
  or?: Array< ModelTripDestinationUserFilterInput | null > | null,
  not?: ModelTripDestinationUserFilterInput | null,
};

export type ModelUpdateFilterInput = {
  type?: ModelUpdateTypeInput | null,
  parityLastProcessed?: ModelParityInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUpdateFilterInput | null > | null,
  or?: Array< ModelUpdateFilterInput | null > | null,
  not?: ModelUpdateFilterInput | null,
};

export type ModelUpdateConnection = {
  __typename: "ModelUpdateConnection",
  items:  Array<Update | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  appleId?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  contactEmail?: ModelStringInput | null,
  facebookId?: ModelStringInput | null,
  fcmToken?: ModelStringInput | null,
  googleId?: ModelStringInput | null,
  location?: ModelStringInput | null,
  name?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  privacy?: ModelPRIVACYInput | null,
  pushNotifications?: ModelBooleanInput | null,
  referralLink?: ModelStringInput | null,
  username?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type SearchableUserFilterInput = {
  id?: SearchableIDFilterInput | null,
  appleId?: SearchableStringFilterInput | null,
  dateOfBirth?: SearchableStringFilterInput | null,
  description?: SearchableStringFilterInput | null,
  email?: SearchableStringFilterInput | null,
  contactEmail?: SearchableStringFilterInput | null,
  facebookId?: SearchableStringFilterInput | null,
  fcmToken?: SearchableStringFilterInput | null,
  googleId?: SearchableStringFilterInput | null,
  location?: SearchableStringFilterInput | null,
  name?: SearchableStringFilterInput | null,
  phone?: SearchableStringFilterInput | null,
  pushNotifications?: SearchableBooleanFilterInput | null,
  referralLink?: SearchableStringFilterInput | null,
  username?: SearchableStringFilterInput | null,
  createdAt?: SearchableStringFilterInput | null,
  updatedAt?: SearchableStringFilterInput | null,
  privacy?: SearchableStringFilterInput | null,
  and?: Array< SearchableUserFilterInput | null > | null,
  or?: Array< SearchableUserFilterInput | null > | null,
  not?: SearchableUserFilterInput | null,
};

export type SearchableUserSortInput = {
  field?: SearchableUserSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchableUserSortableFields {
  id = "id",
  appleId = "appleId",
  dateOfBirth = "dateOfBirth",
  description = "description",
  email = "email",
  contactEmail = "contactEmail",
  facebookId = "facebookId",
  fcmToken = "fcmToken",
  googleId = "googleId",
  location = "location",
  name = "name",
  phone = "phone",
  pushNotifications = "pushNotifications",
  referralLink = "referralLink",
  username = "username",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}


export type SearchableUserAggregationInput = {
  name: string,
  type: SearchableAggregateType,
  field: SearchableUserAggregateField,
};

export enum SearchableUserAggregateField {
  id = "id",
  appleId = "appleId",
  dateOfBirth = "dateOfBirth",
  description = "description",
  email = "email",
  contactEmail = "contactEmail",
  facebookId = "facebookId",
  fcmToken = "fcmToken",
  googleId = "googleId",
  location = "location",
  name = "name",
  phone = "phone",
  privacy = "privacy",
  pushNotifications = "pushNotifications",
  referralLink = "referralLink",
  username = "username",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}


export type SearchableUserConnection = {
  __typename: "SearchableUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
  total?: number | null,
  aggregateItems:  Array<SearchableAggregateResult | null >,
};

export type ModelUserAttractionFilterInput = {
  userId?: ModelIDInput | null,
  attractionId?: ModelIDInput | null,
  authorId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserAttractionFilterInput | null > | null,
  or?: Array< ModelUserAttractionFilterInput | null > | null,
  not?: ModelUserAttractionFilterInput | null,
};

export type ModelUserBlockFilterInput = {
  userId?: ModelIDInput | null,
  blockedUserId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserBlockFilterInput | null > | null,
  or?: Array< ModelUserBlockFilterInput | null > | null,
  not?: ModelUserBlockFilterInput | null,
};

export type ModelUserContactFilterInput = {
  userId?: ModelIDInput | null,
  recordId?: ModelStringInput | null,
  travaUserIds?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserContactFilterInput | null > | null,
  or?: Array< ModelUserContactFilterInput | null > | null,
  not?: ModelUserContactFilterInput | null,
};

export type ModelUserContactConnection = {
  __typename: "ModelUserContactConnection",
  items:  Array<UserContact | null >,
  nextToken?: string | null,
};

export type ModelUserFollowFilterInput = {
  userId?: ModelIDInput | null,
  followedUserId?: ModelIDInput | null,
  approved?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFollowFilterInput | null > | null,
  or?: Array< ModelUserFollowFilterInput | null > | null,
  not?: ModelUserFollowFilterInput | null,
};

export type ModelUserReferralFilterInput = {
  userId?: ModelIDInput | null,
  referredUserId?: ModelIDInput | null,
  referralType?: ModelREFERRAL_TYPESInput | null,
  sourceOS?: ModelStringInput | null,
  matchGuaranteed?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserReferralFilterInput | null > | null,
  or?: Array< ModelUserReferralFilterInput | null > | null,
  not?: ModelUserReferralFilterInput | null,
};

export type ModelUserSessionFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  deviceType?: ModelPLATFORMInput | null,
  appVersion?: ModelStringInput | null,
  label?: ModelUserSessionLabelInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserSessionFilterInput | null > | null,
  or?: Array< ModelUserSessionFilterInput | null > | null,
  not?: ModelUserSessionFilterInput | null,
};

export type ModelUserSessionConnection = {
  __typename: "ModelUserSessionConnection",
  items:  Array<UserSession | null >,
  nextToken?: string | null,
};

export type ModelUserTripFilterInput = {
  userId?: ModelIDInput | null,
  tripId?: ModelIDInput | null,
  status?: ModelUserTripStatusInput | null,
  invitedByUserId?: ModelIDInput | null,
  inviteLink?: ModelStringInput | null,
  lastMessageReadDate?: ModelStringInput | null,
  and?: Array< ModelUserTripFilterInput | null > | null,
  or?: Array< ModelUserTripFilterInput | null > | null,
  not?: ModelUserTripFilterInput | null,
};

export type SignInErrorCheckIfUsernameExistsResponse = {
  __typename: "SignInErrorCheckIfUsernameExistsResponse",
  provider?: PROVIDER | null,
};

export enum PROVIDER {
  NONE = "NONE",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}


export type CustomGetExploreVotingListQueryVariables = {
  input: GetExploreVotingListInput,
};

export type CustomGetExploreVotingListQuery = {
  getExploreVotingList?:  {
    __typename: "GetExploreVotingListResponse",
    attractions:  Array< {
      __typename: "ExploreVotingListItem",
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      cost?: ATTRACTION_COST | null,
      descriptionShort: string,
      id: string,
      image?:  {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null,
      inMyBucketList: boolean,
      inSeason: boolean,
      name: string,
      rating?:  {
        __typename: "Rating",
        score?: number | null,
        count?: number | null,
      } | null,
      recommendationBadges?: Array< BADGES | null > | null,
      swipes?:  Array< {
        __typename: "ExploreVotingListSwipe",
        result: AttractionSwipeResult,
        createdAt: string,
        authorAvatar?:  {
          __typename: "S3Object",
          key: string,
          bucket: string,
          region: string,
        } | null,
        authorId: string,
      } | null > | null,
      type: ATTRACTION_TYPE,
    } >,
    nextPageExists: boolean,
    votedOnAttractionIds: Array< string >,
  } | null,
};

export type CustomGetAttractionQueryVariables = {
  id: string,
  userId: string,
  referrerId: string,
};

export type CustomGetAttractionQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      items:  Array< {
        __typename: "UserFollow",
        followedUserId: string,
        approved: boolean,
      } | null >,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      items:  Array< {
        __typename: "UserAttraction",
        attractionId: string,
      } | null >,
    } | null,
  } | null,
  getReferrer?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    avatar?:  {
      __typename: "S3Object",
      key: string,
      bucket: string,
      region: string,
    } | null,
  } | null,
  getAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    authorId?: string | null,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null > | null,
    isTravaCreated: number,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
      startLoc:  {
        __typename: "Location",
        googlePlace:  {
          __typename: "GooglePlace",
          id: string,
          isValid: number,
          dataLastCheckedAt?: string | null,
          dataLastUpdatedAt?: string | null,
          data:  {
            __typename: "PlaceData",
            coords:  {
              __typename: "Coords",
              lat: number,
              long: number,
            },
            city?: string | null,
            state?: string | null,
            country?: string | null,
            continent?: string | null,
            name?: string | null,
            formattedAddress?: string | null,
            googlePlacePageLink?: string | null,
            websiteLink?: string | null,
            phone?: string | null,
            photos?:  Array< {
              __typename: "PlacePhoto",
              photo_reference?: string | null,
            } | null > | null,
            hours?:  {
              __typename: "Hours",
              weekdayText: Array< string >,
              periods:  Array< {
                __typename: "Period",
                open:  {
                  __typename: "OpenCloseTime",
                  day: number,
                  time: string,
                },
                close?:  {
                  __typename: "OpenCloseTime",
                  day: number,
                  time: string,
                } | null,
              } >,
            } | null,
            businessStatus?: BusinessStatus | null,
            rating?:  {
              __typename: "Rating",
              score?: number | null,
              count?: number | null,
            } | null,
          },
          webData?:  {
            __typename: "PlaceWebData",
            menuLink?: string | null,
            reservationLink?: string | null,
          } | null,
        },
        googlePlaceId: string,
        timezone?: string | null,
        id: string,
      },
      endLoc:  {
        __typename: "Location",
        googlePlace:  {
          __typename: "GooglePlace",
          id: string,
          isValid: number,
          dataLastCheckedAt?: string | null,
          dataLastUpdatedAt?: string | null,
          data:  {
            __typename: "PlaceData",
            coords:  {
              __typename: "Coords",
              lat: number,
              long: number,
            },
            city?: string | null,
            state?: string | null,
            country?: string | null,
            continent?: string | null,
            name?: string | null,
            formattedAddress?: string | null,
            googlePlacePageLink?: string | null,
            websiteLink?: string | null,
            phone?: string | null,
            photos?:  Array< {
              __typename: "PlacePhoto",
              photo_reference?: string | null,
            } | null > | null,
            hours?:  {
              __typename: "Hours",
              weekdayText: Array< string >,
              periods:  Array< {
                __typename: "Period",
                open:  {
                  __typename: "OpenCloseTime",
                  day: number,
                  time: string,
                },
                close?:  {
                  __typename: "OpenCloseTime",
                  day: number,
                  time: string,
                } | null,
              } >,
            } | null,
            businessStatus?: BusinessStatus | null,
            rating?:  {
              __typename: "Rating",
              score?: number | null,
              count?: number | null,
            } | null,
          },
          webData?:  {
            __typename: "PlaceWebData",
            menuLink?: string | null,
            reservationLink?: string | null,
          } | null,
        },
        googlePlaceId: string,
        timezone?: string | null,
        id: string,
      },
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    createdAt: string,
    updatedAt?: string | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      createdAt: string,
      updatedAt: string,
      featured?: boolean | null,
    } | null,
    author?:  {
      __typename: "User",
      id: string,
      username?: string | null,
      name?: string | null,
      avatar?:  {
        __typename: "S3Object",
        key: string,
        bucket: string,
        region: string,
      } | null,
      privacy?: PRIVACY | null,
      facebookId?: string | null,
      googleId?: string | null,
      appleId?: string | null,
      description?: string | null,
      location?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      items:  Array< {
        __typename: "ViatorProduct",
        id: string,
        viatorLink: string,
        attractionId: string,
        displayOrder: number,
        name: string,
        duration?: string | null,
        pricing?: string | null,
        currency?: string | null,
        priceText: string,
        coverImageUrl: string,
        rating:  {
          __typename: "Rating",
          score?: number | null,
          count?: number | null,
        },
        createdAt: string,
        updatedAt: string,
      } | null >,
    } | null,
    deletedAt?: string | null,
    bucketListCount: number,
    privacy: ATTRACTION_PRIVACY,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
    } | null,
  } | null,
};

export type CustomGetMapAttractionQueryVariables = {
  id: string,
};

export type CustomGetMapAttractionQuery = {
  getAttraction?:  {
    __typename: "Attraction",
    id: string,
    duration?: ATTRACTION_DURATION | null,
    type: ATTRACTION_TYPE,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null > | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      startLoc:  {
        __typename: "Location",
        id: string,
        googlePlace:  {
          __typename: "GooglePlace",
          data:  {
            __typename: "PlaceData",
            coords:  {
              __typename: "Coords",
              lat: number,
              long: number,
            },
          },
        },
      },
      endLoc:  {
        __typename: "Location",
        id: string,
        googlePlace:  {
          __typename: "GooglePlace",
          data:  {
            __typename: "PlaceData",
            coords:  {
              __typename: "Coords",
              lat: number,
              long: number,
            },
          },
        },
      },
    } | null > | null,
    name: string,
    bucketListCount: number,
  } | null,
};

export type CustomExploreSearchAttractionsQueryVariables = {
  input?: ExploreSearchAttractionsInput | null,
};

export type CustomExploreSearchAttractionsQuery = {
  exploreSearchAttractions?:  {
    __typename: "ExploreSearchAttractionsResponse",
    attractions?:  Array< {
      __typename: "ExploreSearchAttractionItem",
      id: string,
      name: string,
      distance?: number | null,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      author?:  {
        __typename: "SearchAttractionAuthorItem",
        username: string,
      } | null,
      bucketListCount: number,
      recommendationBadges?: Array< BADGES | null > | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              rating?:  {
                __typename: "Rating",
                score?: number | null,
              } | null,
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
    } | null > | null,
    nextPageExists: boolean,
  } | null,
};

export type CustomExploreMapSearchAttractionsQueryVariables = {
  input?: ExploreMapSearchAttractionsInput | null,
};

export type CustomExploreMapSearchAttractionsQuery = {
  exploreMapSearchAttractions?:  {
    __typename: "ExploreMapSearchAttractionsResponse",
    attractions?:  Array< {
      __typename: "ExploreSearchAttractionItem",
      id: string,
      name: string,
      distance?: number | null,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      author?:  {
        __typename: "SearchAttractionAuthorItem",
        username: string,
      } | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
    } | null > | null,
  } | null,
};

export type CustomAddToItinerarySearchQueryVariables = {
  input?: AddToItinerarySearchInput | null,
};

export type CustomAddToItinerarySearchQuery = {
  addToItinerarySearch?:  {
    __typename: "AddToItinerarySearchResponse",
    attractions:  Array< {
      __typename: "ItinerarySearchAttractionItem",
      id: string,
      name: string,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      recommendationBadges?: Array< BADGES | null > | null,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      distance: number,
      inSeason: boolean,
      inMyBucketList: boolean,
      onItinerary: boolean,
      yesVotes: number,
      noVotes: number,
      author?:  {
        __typename: "SearchAttractionAuthorItem",
        id: string,
        username: string,
      } | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              rating?:  {
                __typename: "Rating",
                score?: number | null,
              } | null,
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
    } >,
    nextPageExists: boolean,
  } | null,
};

export type CustomAddToItineraryMapSearchQueryVariables = {
  input?: AddToItineraryMapSearchInput | null,
};

export type CustomAddToItineraryMapSearchQuery = {
  addToItineraryMapSearch?:  {
    __typename: "AddToItineraryMapSearchResponse",
    attractions?:  Array< {
      __typename: "ItinerarySearchAttractionItem",
      id: string,
      name: string,
      distance: number,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      yesVotes: number,
      noVotes: number,
      author?:  {
        __typename: "SearchAttractionAuthorItem",
        username: string,
      } | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      inSeason: boolean,
      inMyBucketList: boolean,
      onItinerary: boolean,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
    } | null > | null,
  } | null,
};

export type CustomDeleteAttractionMutationVariables = {
  input: CustomDeleteAttractionInput,
};

export type CustomDeleteAttractionMutation = {
  deleteAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      description?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};

export type CustomGetAttractionTripLogsQueryVariables = {
  id: string,
};

export type CustomGetAttractionTripLogsQuery = {
  getAttraction?:  {
    __typename: "Attraction",
    name: string,
    type: ATTRACTION_TYPE,
  } | null,
};

export type CustomOpenSearchListNearbyAttractionsQueryVariables = {
  input?: OpenSearchListNearbyAttractionsInput | null,
};

export type CustomOpenSearchListNearbyAttractionsQuery = {
  openSearchListNearbyAttractions?:  {
    __typename: "OpenSearchListNearbyAttractionsResponse",
    attractions:  Array< {
      __typename: "OpenSearchListAttractionItem",
      id: string,
      name: string,
      type: ATTRACTION_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      duration?: ATTRACTION_DURATION | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                long: number,
                lat: number,
              },
              hours?:  {
                __typename: "Hours",
                periods:  Array< {
                  __typename: "Period",
                  open:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  },
                  close?:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  } | null,
                } >,
              } | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
          googlePlaceId: string,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                long: number,
                lat: number,
              },
              hours?:  {
                __typename: "Hours",
                periods:  Array< {
                  __typename: "Period",
                  open:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  },
                  close?:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  } | null,
                } >,
              } | null,
            },
          } | null,
          googlePlaceId: string,
        },
      } | null > | null,
      seasons?:  Array< {
        __typename: "AttractionSeason",
        startDay?: number | null,
        startMonth?: number | null,
        endDay?: number | null,
        endMonth?: number | null,
      } | null > | null,
      isTravaCreated: number,
      authorType: AUTHOR_TYPE,
      deletedAt?: string | null,
    } | null >,
  } | null,
};

export type CustomGetAttractionsForSchedulerQueryVariables = {
  input?: GetAttractionsForScheduler | null,
};

export type CustomGetAttractionsForSchedulerQuery = {
  getAttractionsForScheduler?:  {
    __typename: "GetAttractionsForSchedulerResponse",
    attractions?:  Array< {
      __typename: "OpenSearchListAttractionItem",
      id: string,
      name: string,
      type: ATTRACTION_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      duration?: ATTRACTION_DURATION | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                long: number,
                lat: number,
              },
              hours?:  {
                __typename: "Hours",
                periods:  Array< {
                  __typename: "Period",
                  open:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  },
                  close?:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  } | null,
                } >,
              } | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
          googlePlaceId: string,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                long: number,
                lat: number,
              },
              hours?:  {
                __typename: "Hours",
                periods:  Array< {
                  __typename: "Period",
                  open:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  },
                  close?:  {
                    __typename: "OpenCloseTime",
                    day: number,
                    time: string,
                  } | null,
                } >,
              } | null,
            },
          } | null,
          googlePlaceId: string,
        },
      } | null > | null,
      seasons?:  Array< {
        __typename: "AttractionSeason",
        startDay?: number | null,
        startMonth?: number | null,
        endDay?: number | null,
        endMonth?: number | null,
      } | null > | null,
      isTravaCreated: number,
      authorType: AUTHOR_TYPE,
      deletedAt?: string | null,
    } | null > | null,
  } | null,
};

export type CustomGetUserAttractionIdsForAddToVotingDeckQueryVariables = {
  userId: string,
  tripId: string,
  destinationId: string,
  type?: ATTRACTION_TYPE | null,
};

export type CustomGetUserAttractionIdsForAddToVotingDeckQuery = {
  getUser?:  {
    __typename: "User",
    myCards?:  {
      __typename: "ModelAttractionConnection",
      items:  Array< {
        __typename: "Attraction",
        id: string,
      } | null >,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      items:  Array< {
        __typename: "UserAttraction",
        attractionId: string,
        attraction?:  {
          __typename: "Attraction",
          deletedAt?: string | null,
        } | null,
      } | null >,
    } | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      items:  Array< {
        __typename: "UserTrip",
        trip?:  {
          __typename: "Trip",
          tripDestinations?:  {
            __typename: "ModelTripDestinationConnection",
            items:  Array< {
              __typename: "TripDestination",
              destination?:  {
                __typename: "Destination",
                name: string,
                coords:  {
                  __typename: "Coords",
                  lat: number,
                  long: number,
                },
              } | null,
              endDate?: number | null,
              startDate?: number | null,
            } | null >,
          } | null,
        } | null,
      } | null >,
    } | null,
  } | null,
};

export type CustomCheckForExistingCardsQueryVariables = {
  input: CheckForExistingCardsInput,
};

export type CustomCheckForExistingCardsQuery = {
  checkForExistingCards?:  {
    __typename: "CheckForExistingCardsResponse",
    attractions?:  Array< {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
      author?:  {
        __typename: "SearchAttractionAuthorItem",
        id: string,
        name?: string | null,
        username: string,
        avatar?:  {
          __typename: "S3Object",
          key: string,
          bucket: string,
          region: string,
        } | null,
      } | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
    } | null > | null,
  } | null,
};

export type CustomOnUpdateAttractionSubscriptionVariables = {
  id: string,
};

export type CustomOnUpdateAttractionSubscription = {
  onUpdateAttraction?:  {
    __typename: "Attraction",
    id: string,
  } | null,
};

export type CustomCreateAttractionFromPlaceIdMutationVariables = {
  input: CreateAttractionFromPlaceIdInput,
};

export type CustomCreateAttractionFromPlaceIdMutation = {
  createAttractionFromPlaceId?:  {
    __typename: "CreateAttractionFromPlaceIdResponse",
    existingAttractions?:  Array< {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
      duration?: ATTRACTION_DURATION | null,
      recommendationBadges?: Array< BADGES | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
    } | null > | null,
    createdAttraction?:  {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
      duration?: ATTRACTION_DURATION | null,
      recommendationBadges?: Array< BADGES | null > | null,
      images?:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null > | null,
      locations?:  Array< {
        __typename: "SearchStartEndLocation",
        id: string,
        deleted?: boolean | null,
        startLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
        endLoc:  {
          __typename: "SearchLocation",
          id: string,
          googlePlaceId: string,
          googlePlace?:  {
            __typename: "SearchGooglePlace",
            data:  {
              __typename: "SearchGooglePlaceData",
              coords:  {
                __typename: "Coords",
                lat: number,
                long: number,
              },
              city?: string | null,
              businessStatus?: BusinessStatus | null,
            },
          } | null,
        },
      } | null > | null,
    } | null,
  } | null,
};

export type FederatedSignUpMutationVariables = {
  input?: FederatedSignUpInput | null,
};

export type FederatedSignUpMutation = {
  federatedSignUp?:  {
    __typename: "FederatedSignUpResponse",
    id?: string | null,
  } | null,
};

export type SignOutMutationVariables = {
  input: SignOutInput,
};

export type SignOutMutation = {
  signOut?:  {
    __typename: "SignOutResponse",
    id?: string | null,
  } | null,
};

export type SettingsSendReportMutationVariables = {
  input: SettingsSendReportInput,
};

export type SettingsSendReportMutation = {
  settingsSendReport?:  {
    __typename: "SettingsSendReportResponse",
    messageId: string,
  } | null,
};

export type CreateTripMutationVariables = {
  input: CustomCreateTripInput,
};

export type CreateTripMutation = {
  createTrip?:  {
    __typename: "Trip",
    id: string,
    name: string,
    tripDestinations?:  {
      __typename: "ModelTripDestinationConnection",
      nextToken?: string | null,
    } | null,
    members?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipesByUser?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    timelineEntries?:  {
      __typename: "ModelTimelineEntryConnection",
      nextToken?: string | null,
    } | null,
    completed?: boolean | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTripMutationVariables = {
  input: UpdateTripInput,
};

export type UpdateTripMutation = {
  updateTrip?:  {
    __typename: "Trip",
    id: string,
    name: string,
    tripDestinations?:  {
      __typename: "ModelTripDestinationConnection",
      nextToken?: string | null,
    } | null,
    members?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipesByUser?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    timelineEntries?:  {
      __typename: "ModelTimelineEntryConnection",
      nextToken?: string | null,
    } | null,
    completed?: boolean | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserTripMutationVariables = {
  input: CreateUserTripInput,
};

export type CreateUserTripMutation = {
  createUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserTripMutationVariables = {
  input: UpdateUserTripInput,
};

export type UpdateUserTripMutation = {
  updateUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserTripMutationVariables = {
  input: DeleteUserTripInput,
};

export type DeleteUserTripMutation = {
  deleteUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTripDestinationMutationVariables = {
  input: CreateTripDestinationInput,
};

export type CreateTripDestinationMutation = {
  createTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTripDestinationMutationVariables = {
  input: UpdateTripDestinationInput,
};

export type UpdateTripDestinationMutation = {
  updateTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTripDestinationMutationVariables = {
  input: DeleteTripDestinationInput,
};

export type DeleteTripDestinationMutation = {
  deleteTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserFollowMutationVariables = {
  input: CreateUserFollowInput,
};

export type CreateUserFollowMutation = {
  createUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserFollowMutationVariables = {
  input: UpdateUserFollowInput,
};

export type UpdateUserFollowMutation = {
  updateUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserReferralMutationVariables = {
  input: CreateUserReferralInput,
};

export type CreateUserReferralMutation = {
  createUserReferral?:  {
    __typename: "UserReferral",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referredUserId: string,
    referredUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referralType: REFERRAL_TYPES,
    sourceOS?: string | null,
    matchGuaranteed?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PutAttractionSwipeMutationVariables = {
  input: PutAttractionSwipeInput,
};

export type PutAttractionSwipeMutation = {
  putAttractionSwipe?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type AdminCreateAttractionMutationVariables = {
  input: CreateAttractionInput,
};

export type AdminCreateAttractionMutation = {
  adminCreateAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type AdminUpdateAttractionMutationVariables = {
  input: UpdateAttractionInput,
};

export type AdminUpdateAttractionMutation = {
  adminUpdateAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateAttractionFromPlaceIdMutationVariables = {
  input: CreateAttractionFromPlaceIdInput,
};

export type CreateAttractionFromPlaceIdMutation = {
  createAttractionFromPlaceId?:  {
    __typename: "CreateAttractionFromPlaceIdResponse",
    existingAttractions?:  Array< {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      duration?: ATTRACTION_DURATION | null,
      recommendationBadges?: Array< BADGES | null > | null,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
    } | null > | null,
    createdAttraction?:  {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      duration?: ATTRACTION_DURATION | null,
      recommendationBadges?: Array< BADGES | null > | null,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
    } | null,
  } | null,
};

export type DeleteAttractionMutationVariables = {
  input: CustomDeleteAttractionInput,
};

export type DeleteAttractionMutation = {
  deleteAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUserByAdminMutationVariables = {
  input: CustomDeleteUserInput,
};

export type DeleteUserByAdminMutation = {
  deleteUserByAdmin?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserBySelfMutation = {
  deleteUserBySelf?: boolean | null,
};

export type AdminCreateViatorProductMutationVariables = {
  input: AdminCreateViatorProductInput,
};

export type AdminCreateViatorProductMutation = {
  adminCreateViatorProduct?:  {
    __typename: "ViatorProduct",
    id: string,
    attractionId: string,
    viatorLink: string,
    name: string,
    priceText: string,
    rating:  {
      __typename: "Rating",
      score?: number | null,
      count?: number | null,
    },
    coverImageUrl: string,
    displayOrder: number,
    duration?: string | null,
    pricing?: string | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEntryFlightMutationVariables = {
  input?: CreateTimelineEntryFlightInput | null,
};

export type CreateTimelineEntryFlightMutation = {
  createTimelineEntryFlight?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEntryRentalPickupMutationVariables = {
  input: CreateTimelineEntryRentalPickupInput,
};

export type CreateTimelineEntryRentalPickupMutation = {
  createTimelineEntryRentalPickup?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEntryRentalDropoffMutationVariables = {
  input: CreateTimelineEntryRentalDropoffInput,
};

export type CreateTimelineEntryRentalDropoffMutation = {
  createTimelineEntryRentalDropoff?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEntryLodgingArrivalMutationVariables = {
  input: CreateTimelineEntryLodgingArrivalInput,
};

export type CreateTimelineEntryLodgingArrivalMutation = {
  createTimelineEntryLodgingArrival?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEntryLodgingDepartureMutationVariables = {
  input: CreateTimelineEntryLodgingDepartureInput,
};

export type CreateTimelineEntryLodgingDepartureMutation = {
  createTimelineEntryLodgingDeparture?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEntryFlightMutationVariables = {
  input: UpdateTimelineEntryFlightInput,
};

export type UpdateTimelineEntryFlightMutation = {
  updateTimelineEntryFlight?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEntryRentalPickupMutationVariables = {
  input: UpdateTimelineEntryRentalPickupInput,
};

export type UpdateTimelineEntryRentalPickupMutation = {
  updateTimelineEntryRentalPickup?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEntryRentalDropoffMutationVariables = {
  input: UpdateTimelineEntryRentalDropoffInput,
};

export type UpdateTimelineEntryRentalDropoffMutation = {
  updateTimelineEntryRentalDropoff?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEntryLodgingArrivalMutationVariables = {
  input: UpdateTimelineEntryLodgingArrivalInput,
};

export type UpdateTimelineEntryLodgingArrivalMutation = {
  updateTimelineEntryLodgingArrival?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEntryLodgingDepartureMutationVariables = {
  input: UpdateTimelineEntryLodgingDepartureInput,
};

export type UpdateTimelineEntryLodgingDepartureMutation = {
  updateTimelineEntryLodgingDeparture?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTimelineEntryMutationVariables = {
  input: DeleteTimelineEntryInput,
};

export type DeleteTimelineEntryMutation = {
  deleteTimelineEntry?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDestinationMutationVariables = {
  input: CreateDestinationInput,
};

export type CreateDestinationMutation = {
  createDestination?:  {
    __typename: "Destination",
    id: string,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    name: string,
    icon?: string | null,
    coverImage?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    timezone?: string | null,
    attractions?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    nearbyThingsToDoCount?: number | null,
    nearbyPlacesToEatCount?: number | null,
    nearbyTravaThingsToDoCount?: number | null,
    nearbyTravaPlacesToEatCount?: number | null,
    coords:  {
      __typename: "Coords",
      long: number,
      lat: number,
    },
    state?: string | null,
    country?: string | null,
    continent?: string | null,
    deletedAt?: string | null,
    isTravaCreated: number,
    googlePlaceId?: string | null,
    featured?: boolean | null,
    altName?: string | null,
    label: string,
    pendingMigration?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type AddRemoveFromBucketListMutationVariables = {
  input: addRemoveFromBucketListInput,
};

export type AddRemoveFromBucketListMutation = {
  addRemoveFromBucketList?: boolean | null,
};

export type CreatePostMutationVariables = {
  input: CustomCreatePostInput,
};

export type CreatePostMutation = {
  createPost?: string | null,
};

export type DeletePostMutationVariables = {
  input: CustomDeletePostInput,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId?: string | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    description?: string | null,
    commentsCount: number,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
    } | null,
    mediaType: MEDIA_TYPES,
    cloudinaryUrl: string,
    width: number,
    height: number,
    format?: string | null,
    videoDuration?: number | null,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string | null,
    likesCount: number,
  } | null,
};

export type LikeDislikePostMutationVariables = {
  input: likeDislikePostInput,
};

export type LikeDislikePostMutation = {
  likeDislikePost?: boolean | null,
};

export type CreateCommentMutationVariables = {
  input: CustomCreateComment,
};

export type CreateCommentMutation = {
  createComment?: boolean | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type SyncContactsMutationVariables = {
  input: SyncContactsInput,
};

export type SyncContactsMutation = {
  syncContacts?: boolean | null,
};

export type CreateTripMessageNotificationsMutationVariables = {
  input: CreateTripMessageNotificationsInput,
};

export type CreateTripMessageNotificationsMutation = {
  createTripMessageNotifications?: boolean | null,
};

export type TeaRexCreateEntityMutationVariables = {
  input: TeaRexCreateEntityInput,
};

export type TeaRexCreateEntityMutation = {
  teaRexCreateEntity?: boolean | null,
};

export type TeaRexDeleteEntityMutationVariables = {
  input: TeaRexDeleteEntityInput,
};

export type TeaRexDeleteEntityMutation = {
  teaRexDeleteEntity?: boolean | null,
};

export type TeaRexCreateEventMutationVariables = {
  input: TeaRexCreateEventInput,
};

export type TeaRexCreateEventMutation = {
  teaRexCreateEvent?: boolean | null,
};

export type TeaRexDeleteEventMutationVariables = {
  input: TeaRexDeleteEventInput,
};

export type TeaRexDeleteEventMutation = {
  teaRexDeleteEvent?: boolean | null,
};

export type CreateUserBlockMutationVariables = {
  input: CreateUserBlockInput,
};

export type CreateUserBlockMutation = {
  createUserBlock?:  {
    __typename: "UserBlock",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    blockedUserId: string,
    blockedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UploadToCloudinaryMutationVariables = {
  input: UploadToCloudinaryInput,
};

export type UploadToCloudinaryMutation = {
  uploadToCloudinary?:  {
    __typename: "UploadToCloudinaryResponse",
    cloudinaryUrl: string,
    videoDuration?: number | null,
    width: number,
    height: number,
    format: string,
  } | null,
};

export type TableMigrationMutationVariables = {
  input: TableMigrationInput,
};

export type TableMigrationMutation = {
  tableMigration?:  {
    __typename: "TableMigrationResponse",
    mainTableResult:  {
      __typename: "MigrationResult",
      success: number,
      fail: number,
      skipped: number,
      remaining: number,
    },
    imageResult:  {
      __typename: "MigrationResult",
      success: number,
      fail: number,
      skipped: number,
      remaining: number,
    },
  } | null,
};

export type MigrateSingleAttractionMutationVariables = {
  input: MigrateSingleAttractionInput,
};

export type MigrateSingleAttractionMutation = {
  migrateSingleAttraction?:  {
    __typename: "TableMigrationResponse",
    mainTableResult:  {
      __typename: "MigrationResult",
      success: number,
      fail: number,
      skipped: number,
      remaining: number,
    },
    imageResult:  {
      __typename: "MigrationResult",
      success: number,
      fail: number,
      skipped: number,
      remaining: number,
    },
  } | null,
};

export type AddMigrationFlagMutationVariables = {
  input: AddMigrationFlagInput,
};

export type AddMigrationFlagMutation = {
  addMigrationFlag?:  {
    __typename: "AddMigrationFlagResponse",
    success: number,
    fail: number,
  } | null,
};

export type UpdateGoogleAPIKeyMutationVariables = {
  input: UpdateGoogleAPIKeyInput,
};

export type UpdateGoogleAPIKeyMutation = {
  updateGoogleAPIKey?:  {
    __typename: "UpdateGoogleAPIKeyResponse",
    envsUpdated: Array< BACKEND_ENV_NAME >,
    envsFailed: Array< BACKEND_ENV_NAME >,
  } | null,
};

export type PrivateCreateAttractionMutationVariables = {
  input: CreateAttractionInput,
  condition?: ModelAttractionConditionInput | null,
};

export type PrivateCreateAttractionMutation = {
  privateCreateAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type PrivateUpdateAttractionMutationVariables = {
  input: UpdateAttractionInput,
  condition?: ModelAttractionConditionInput | null,
};

export type PrivateUpdateAttractionMutation = {
  privateUpdateAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type PrivateCreateAttractionSwipeMutationVariables = {
  input: CreateAttractionSwipeInput,
  condition?: ModelAttractionSwipeConditionInput | null,
};

export type PrivateCreateAttractionSwipeMutation = {
  privateCreateAttractionSwipe?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateAttractionSwipeMutationVariables = {
  input: UpdateAttractionSwipeInput,
  condition?: ModelAttractionSwipeConditionInput | null,
};

export type PrivateUpdateAttractionSwipeMutation = {
  privateUpdateAttractionSwipe?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteAttractionSwipeMutationVariables = {
  input: DeleteAttractionSwipeInput,
  condition?: ModelAttractionSwipeConditionInput | null,
};

export type PrivateDeleteAttractionSwipeMutation = {
  privateDeleteAttractionSwipe?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateDestinationMutationVariables = {
  input: CreateDestinationInput,
  condition?: ModelDestinationConditionInput | null,
};

export type PrivateCreateDestinationMutation = {
  privateCreateDestination?:  {
    __typename: "Destination",
    id: string,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    name: string,
    icon?: string | null,
    coverImage?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    timezone?: string | null,
    attractions?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    nearbyThingsToDoCount?: number | null,
    nearbyPlacesToEatCount?: number | null,
    nearbyTravaThingsToDoCount?: number | null,
    nearbyTravaPlacesToEatCount?: number | null,
    coords:  {
      __typename: "Coords",
      long: number,
      lat: number,
    },
    state?: string | null,
    country?: string | null,
    continent?: string | null,
    deletedAt?: string | null,
    isTravaCreated: number,
    googlePlaceId?: string | null,
    featured?: boolean | null,
    altName?: string | null,
    label: string,
    pendingMigration?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDestinationMutationVariables = {
  input: UpdateDestinationInput,
  condition?: ModelDestinationConditionInput | null,
};

export type UpdateDestinationMutation = {
  updateDestination?:  {
    __typename: "Destination",
    id: string,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    name: string,
    icon?: string | null,
    coverImage?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    timezone?: string | null,
    attractions?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    nearbyThingsToDoCount?: number | null,
    nearbyPlacesToEatCount?: number | null,
    nearbyTravaThingsToDoCount?: number | null,
    nearbyTravaPlacesToEatCount?: number | null,
    coords:  {
      __typename: "Coords",
      long: number,
      lat: number,
    },
    state?: string | null,
    country?: string | null,
    continent?: string | null,
    deletedAt?: string | null,
    isTravaCreated: number,
    googlePlaceId?: string | null,
    featured?: boolean | null,
    altName?: string | null,
    label: string,
    pendingMigration?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateDistanceMutationVariables = {
  input: CreateDistanceInput,
  condition?: ModelDistanceConditionInput | null,
};

export type PrivateCreateDistanceMutation = {
  privateCreateDistance?:  {
    __typename: "Distance",
    key: string,
    value: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateFeatureFlagMutationVariables = {
  input: UpdateFeatureFlagInput,
  condition?: ModelFeatureFlagConditionInput | null,
};

export type PrivateUpdateFeatureFlagMutation = {
  privateUpdateFeatureFlag?:  {
    __typename: "FeatureFlag",
    id: FeatureFlagName,
    isEnabled: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateGooglePlaceMutationVariables = {
  input: CreateGooglePlaceInput,
  condition?: ModelGooglePlaceConditionInput | null,
};

export type PrivateCreateGooglePlaceMutation = {
  privateCreateGooglePlace?:  {
    __typename: "GooglePlace",
    id: string,
    isValid: number,
    data:  {
      __typename: "PlaceData",
      city?: string | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      name?: string | null,
      formattedAddress?: string | null,
      googlePlacePageLink?: string | null,
      websiteLink?: string | null,
      phone?: string | null,
      businessStatus?: BusinessStatus | null,
      reservable?: boolean | null,
      price?: number | null,
      editorialSummary?: string | null,
      types?: Array< string | null > | null,
    },
    consecutiveFailedRequests?: number | null,
    dataLastCheckedAt?: string | null,
    dataLastUpdatedAt?: string | null,
    webData?:  {
      __typename: "PlaceWebData",
      menuLink?: string | null,
      reservationLink?: string | null,
      bestVisitedByPopularTimes?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    } | null,
    yelpData?:  {
      __typename: "YelpData",
      id?: string | null,
      url?: string | null,
      price?: number | null,
      categories?: Array< string | null > | null,
    } | null,
    generatedSummary?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type PrivateUpdateGooglePlaceMutationVariables = {
  input: UpdateGooglePlaceInput,
  condition?: ModelGooglePlaceConditionInput | null,
};

export type PrivateUpdateGooglePlaceMutation = {
  privateUpdateGooglePlace?:  {
    __typename: "GooglePlace",
    id: string,
    isValid: number,
    data:  {
      __typename: "PlaceData",
      city?: string | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      name?: string | null,
      formattedAddress?: string | null,
      googlePlacePageLink?: string | null,
      websiteLink?: string | null,
      phone?: string | null,
      businessStatus?: BusinessStatus | null,
      reservable?: boolean | null,
      price?: number | null,
      editorialSummary?: string | null,
      types?: Array< string | null > | null,
    },
    consecutiveFailedRequests?: number | null,
    dataLastCheckedAt?: string | null,
    dataLastUpdatedAt?: string | null,
    webData?:  {
      __typename: "PlaceWebData",
      menuLink?: string | null,
      reservationLink?: string | null,
      bestVisitedByPopularTimes?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    } | null,
    yelpData?:  {
      __typename: "YelpData",
      id?: string | null,
      url?: string | null,
      price?: number | null,
      categories?: Array< string | null > | null,
    } | null,
    generatedSummary?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    id: string,
    tripId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text?: string | null,
    system?: boolean | null,
    image?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    sent: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "Message",
    id: string,
    tripId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text?: string | null,
    system?: boolean | null,
    image?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    sent: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "Message",
    id: string,
    tripId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text?: string | null,
    system?: boolean | null,
    image?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    sent: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateMinimumVersionMutationVariables = {
  input: UpdateMinimumVersionInput,
  condition?: ModelMinimumVersionConditionInput | null,
};

export type PrivateUpdateMinimumVersionMutation = {
  privateUpdateMinimumVersion?:  {
    __typename: "MinimumVersion",
    id: MinimumVersionName,
    minimumVersion: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateNotificationMutationVariables = {
  input: CreateNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type CreateNotificationMutation = {
  createNotification?:  {
    __typename: "Notification",
    id: string,
    receiverUserId: string,
    senderUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    senderUserId: string,
    type: NOTIFICATION_TYPE,
    text?: string | null,
    tripId?: string | null,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    postId?: string | null,
    post?:  {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    commentId?: string | null,
    comment?:  {
      __typename: "Comment",
      id: string,
      postId: string,
      userId: string,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    showInApp: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateNotificationMutationVariables = {
  input: UpdateNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type UpdateNotificationMutation = {
  updateNotification?:  {
    __typename: "Notification",
    id: string,
    receiverUserId: string,
    senderUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    senderUserId: string,
    type: NOTIFICATION_TYPE,
    text?: string | null,
    tripId?: string | null,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    postId?: string | null,
    post?:  {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    commentId?: string | null,
    comment?:  {
      __typename: "Comment",
      id: string,
      postId: string,
      userId: string,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    showInApp: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteNotificationMutationVariables = {
  input: DeleteNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type DeleteNotificationMutation = {
  deleteNotification?:  {
    __typename: "Notification",
    id: string,
    receiverUserId: string,
    senderUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    senderUserId: string,
    type: NOTIFICATION_TYPE,
    text?: string | null,
    tripId?: string | null,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    postId?: string | null,
    post?:  {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    commentId?: string | null,
    comment?:  {
      __typename: "Comment",
      id: string,
      postId: string,
      userId: string,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    showInApp: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePhotographerMutationVariables = {
  input: CreatePhotographerInput,
  condition?: ModelPhotographerConditionInput | null,
};

export type CreatePhotographerMutation = {
  createPhotographer?:  {
    __typename: "Photographer",
    id: string,
    name: string,
    url?: string | null,
    pendingMigration?: boolean | null,
  } | null,
};

export type UpdatePhotographerMutationVariables = {
  input: UpdatePhotographerInput,
  condition?: ModelPhotographerConditionInput | null,
};

export type UpdatePhotographerMutation = {
  updatePhotographer?:  {
    __typename: "Photographer",
    id: string,
    name: string,
    url?: string | null,
    pendingMigration?: boolean | null,
  } | null,
};

export type DeletePhotographerMutationVariables = {
  input: DeletePhotographerInput,
  condition?: ModelPhotographerConditionInput | null,
};

export type DeletePhotographerMutation = {
  deletePhotographer?:  {
    __typename: "Photographer",
    id: string,
    name: string,
    url?: string | null,
    pendingMigration?: boolean | null,
  } | null,
};

export type PrivateCreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type PrivateCreatePostMutation = {
  privateCreatePost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId?: string | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    description?: string | null,
    commentsCount: number,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
    } | null,
    mediaType: MEDIA_TYPES,
    cloudinaryUrl: string,
    width: number,
    height: number,
    format?: string | null,
    videoDuration?: number | null,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string | null,
    likesCount: number,
  } | null,
};

export type PrivateUpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type PrivateUpdatePostMutation = {
  privateUpdatePost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId?: string | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    description?: string | null,
    commentsCount: number,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
    } | null,
    mediaType: MEDIA_TYPES,
    cloudinaryUrl: string,
    width: number,
    height: number,
    format?: string | null,
    videoDuration?: number | null,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string | null,
    likesCount: number,
  } | null,
};

export type PrivateCreateTimelineEntryMutationVariables = {
  input: CreateTimelineEntryInput,
  condition?: ModelTimelineEntryConditionInput | null,
};

export type PrivateCreateTimelineEntryMutation = {
  privateCreateTimelineEntry?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateTimelineEntryMutationVariables = {
  input: UpdateTimelineEntryInput,
  condition?: ModelTimelineEntryConditionInput | null,
};

export type PrivateUpdateTimelineEntryMutation = {
  privateUpdateTimelineEntry?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteTimelineEntryMutationVariables = {
  input: DeleteTimelineEntryInput,
  condition?: ModelTimelineEntryConditionInput | null,
};

export type PrivateDeleteTimelineEntryMutation = {
  privateDeleteTimelineEntry?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateTimelineEntryMemberMutationVariables = {
  input: CreateTimelineEntryMemberInput,
  condition?: ModelTimelineEntryMemberConditionInput | null,
};

export type PrivateCreateTimelineEntryMemberMutation = {
  privateCreateTimelineEntryMember?:  {
    __typename: "TimelineEntryMember",
    timelineEntryId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteTimelineEntryMemberMutationVariables = {
  input: DeleteTimelineEntryMemberInput,
  condition?: ModelTimelineEntryMemberConditionInput | null,
};

export type PrivateDeleteTimelineEntryMemberMutation = {
  privateDeleteTimelineEntryMember?:  {
    __typename: "TimelineEntryMember",
    timelineEntryId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateTripMutationVariables = {
  input: CreateTripInput,
  condition?: ModelTripConditionInput | null,
};

export type PrivateCreateTripMutation = {
  privateCreateTrip?:  {
    __typename: "Trip",
    id: string,
    name: string,
    tripDestinations?:  {
      __typename: "ModelTripDestinationConnection",
      nextToken?: string | null,
    } | null,
    members?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipesByUser?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    timelineEntries?:  {
      __typename: "ModelTimelineEntryConnection",
      nextToken?: string | null,
    } | null,
    completed?: boolean | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateTripMutationVariables = {
  input: UpdateTripInput,
  condition?: ModelTripConditionInput | null,
};

export type PrivateUpdateTripMutation = {
  privateUpdateTrip?:  {
    __typename: "Trip",
    id: string,
    name: string,
    tripDestinations?:  {
      __typename: "ModelTripDestinationConnection",
      nextToken?: string | null,
    } | null,
    members?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipesByUser?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    timelineEntries?:  {
      __typename: "ModelTimelineEntryConnection",
      nextToken?: string | null,
    } | null,
    completed?: boolean | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateTripDestinationMutationVariables = {
  input: CreateTripDestinationInput,
  condition?: ModelTripDestinationConditionInput | null,
};

export type PrivateCreateTripDestinationMutation = {
  privateCreateTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateTripDestinationMutationVariables = {
  input: UpdateTripDestinationInput,
  condition?: ModelTripDestinationConditionInput | null,
};

export type PrivateUpdateTripDestinationMutation = {
  privateUpdateTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteTripDestinationMutationVariables = {
  input: DeleteTripDestinationInput,
  condition?: ModelTripDestinationConditionInput | null,
};

export type PrivateDeleteTripDestinationMutation = {
  privateDeleteTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateTripDestinationUserMutationVariables = {
  input: CreateTripDestinationUserInput,
  condition?: ModelTripDestinationUserConditionInput | null,
};

export type PrivateCreateTripDestinationUserMutation = {
  privateCreateTripDestinationUser?:  {
    __typename: "TripDestinationUser",
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    isReady: boolean,
    tripPlanViewedAt?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTripDestinationUserMutationVariables = {
  input: UpdateTripDestinationUserInput,
  condition?: ModelTripDestinationUserConditionInput | null,
};

export type UpdateTripDestinationUserMutation = {
  updateTripDestinationUser?:  {
    __typename: "TripDestinationUser",
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    isReady: boolean,
    tripPlanViewedAt?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteTripDestinationUserMutationVariables = {
  input: DeleteTripDestinationUserInput,
  condition?: ModelTripDestinationUserConditionInput | null,
};

export type PrivateDeleteTripDestinationUserMutation = {
  privateDeleteTripDestinationUser?:  {
    __typename: "TripDestinationUser",
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    isReady: boolean,
    tripPlanViewedAt?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTripPlanLogMutationVariables = {
  input: CreateTripPlanLogInput,
  condition?: ModelTripPlanLogConditionInput | null,
};

export type CreateTripPlanLogMutation = {
  createTripPlanLog?:  {
    __typename: "TripPlanLog",
    tripPlan:  Array< {
      __typename: "TripPlanLogDay",
      dayOfYear: number,
    } >,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUpdateMutationVariables = {
  input: CreateUpdateInput,
  condition?: ModelUpdateConditionInput | null,
};

export type PrivateCreateUpdateMutation = {
  privateCreateUpdate?:  {
    __typename: "Update",
    type: UpdateType,
    parityLastProcessed: Parity,
    createdAt: string,
    updatedAt: string,
    id: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type PrivateUpdateUserMutation = {
  privateUpdateUser?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type PrivateDeleteUserMutation = {
  privateDeleteUser?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUserBlockMutationVariables = {
  input: CreateUserBlockInput,
  condition?: ModelUserBlockConditionInput | null,
};

export type PrivateCreateUserBlockMutation = {
  privateCreateUserBlock?:  {
    __typename: "UserBlock",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    blockedUserId: string,
    blockedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserBlockMutationVariables = {
  input: UpdateUserBlockInput,
  condition?: ModelUserBlockConditionInput | null,
};

export type UpdateUserBlockMutation = {
  updateUserBlock?:  {
    __typename: "UserBlock",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    blockedUserId: string,
    blockedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserBlockMutationVariables = {
  input: DeleteUserBlockInput,
  condition?: ModelUserBlockConditionInput | null,
};

export type DeleteUserBlockMutation = {
  deleteUserBlock?:  {
    __typename: "UserBlock",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    blockedUserId: string,
    blockedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUserContactMutationVariables = {
  input: CreateUserContactInput,
  condition?: ModelUserContactConditionInput | null,
};

export type PrivateCreateUserContactMutation = {
  privateCreateUserContact?:  {
    __typename: "UserContact",
    userId: string,
    recordId: string,
    travaUserIds?: Array< string | null > | null,
    name?: string | null,
    email?: Array< string | null > | null,
    phone?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateUserContactMutationVariables = {
  input: UpdateUserContactInput,
  condition?: ModelUserContactConditionInput | null,
};

export type PrivateUpdateUserContactMutation = {
  privateUpdateUserContact?:  {
    __typename: "UserContact",
    userId: string,
    recordId: string,
    travaUserIds?: Array< string | null > | null,
    name?: string | null,
    email?: Array< string | null > | null,
    phone?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteUserContactMutationVariables = {
  input: DeleteUserContactInput,
  condition?: ModelUserContactConditionInput | null,
};

export type PrivateDeleteUserContactMutation = {
  privateDeleteUserContact?:  {
    __typename: "UserContact",
    userId: string,
    recordId: string,
    travaUserIds?: Array< string | null > | null,
    name?: string | null,
    email?: Array< string | null > | null,
    phone?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUserFollowMutationVariables = {
  input: CreateUserFollowInput,
  condition?: ModelUserFollowConditionInput | null,
};

export type PrivateCreateUserFollowMutation = {
  privateCreateUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateUserFollowMutationVariables = {
  input: UpdateUserFollowInput,
  condition?: ModelUserFollowConditionInput | null,
};

export type PrivateUpdateUserFollowMutation = {
  privateUpdateUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserFollowMutationVariables = {
  input: DeleteUserFollowInput,
  condition?: ModelUserFollowConditionInput | null,
};

export type DeleteUserFollowMutation = {
  deleteUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserPostMutationVariables = {
  input: CreateUserPostInput,
  condition?: ModelUserPostConditionInput | null,
};

export type CreateUserPostMutation = {
  createUserPost?:  {
    __typename: "UserPost",
    userId: string,
    postId: string,
    post?:  {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUserReferralMutationVariables = {
  input: CreateUserReferralInput,
  condition?: ModelUserReferralConditionInput | null,
};

export type PrivateCreateUserReferralMutation = {
  privateCreateUserReferral?:  {
    __typename: "UserReferral",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referredUserId: string,
    referredUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referralType: REFERRAL_TYPES,
    sourceOS?: string | null,
    matchGuaranteed?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserSessionMutationVariables = {
  input: CreateUserSessionInput,
  condition?: ModelUserSessionConditionInput | null,
};

export type CreateUserSessionMutation = {
  createUserSession?:  {
    __typename: "UserSession",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    deviceType: PLATFORM,
    appVersion: string,
    label: UserSessionLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateUserTripMutationVariables = {
  input: CreateUserTripInput,
  condition?: ModelUserTripConditionInput | null,
};

export type PrivateCreateUserTripMutation = {
  privateCreateUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateUpdateUserTripMutationVariables = {
  input: UpdateUserTripInput,
  condition?: ModelUserTripConditionInput | null,
};

export type PrivateUpdateUserTripMutation = {
  privateUpdateUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateDeleteUserTripMutationVariables = {
  input: DeleteUserTripInput,
  condition?: ModelUserTripConditionInput | null,
};

export type PrivateDeleteUserTripMutation = {
  privateDeleteUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateCreateViatorProductMutationVariables = {
  input: CreateViatorProductInput,
  condition?: ModelViatorProductConditionInput | null,
};

export type PrivateCreateViatorProductMutation = {
  privateCreateViatorProduct?:  {
    __typename: "ViatorProduct",
    id: string,
    attractionId: string,
    viatorLink: string,
    name: string,
    priceText: string,
    rating:  {
      __typename: "Rating",
      score?: number | null,
      count?: number | null,
    },
    coverImageUrl: string,
    displayOrder: number,
    duration?: string | null,
    pricing?: string | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type SignUpMutationVariables = {
  input?: SignUpInput | null,
};

export type SignUpMutation = {
  signUp?:  {
    __typename: "SignUpResponse",
    id?: string | null,
    destination?: string | null,
  } | null,
};

export type GenerateTripPlanQueryVariables = {
  attractions: Array< TripPlanAttraction | null >,
  group: TripPlanGroup,
  config?: GenerateTripPlanConfigInput | null,
};

export type GenerateTripPlanQuery = {
  generateTripPlan?:  {
    __typename: "TripPlanResponse",
    plan:  Array< {
      __typename: "TripPlanItem",
      day: number,
      order: number,
      attractionId: string,
      locId: string,
    } | null >,
  } | null,
};

export type GetAttractionPhotosQueryVariables = {
  input: GetAttractionPhotosInput,
};

export type GetAttractionPhotosQuery = {
  getAttractionPhotos?: boolean | null,
};

export type GenerateAttractionDetailsQueryVariables = {
  attractionId: string,
};

export type GenerateAttractionDetailsQuery = {
  generateAttractionDetails?: boolean | null,
};

export type MapBoxGetDistancesQueryVariables = {
  input: MapBoxAttractionLocationsInput,
};

export type MapBoxGetDistancesQuery = {
  mapBoxGetDistances?:  {
    __typename: "MapboxGetDistancesResult",
    locations:  Array< {
      __typename: "DistanceBetweenLocations",
      attractionId_1: string,
      attractionId_2: string,
      distance: number,
    } >,
  } | null,
};

export type MapBoxGetPlacesQueryVariables = {
  input?: MapboxGetPlacesInput | null,
};

export type MapBoxGetPlacesQuery = {
  mapBoxGetPlaces?:  Array< {
    __typename: "MapboxGetPlacesResult",
    location?:  {
      __typename: "MapBoxGetPlacesLocation",
      street?: string | null,
      number?: string | null,
      city?: string | null,
      state?: string | null,
      postCode?: string | null,
      country?: string | null,
    } | null,
    placeName: string,
  } | null > | null,
};

export type MapBoxGetTokenQuery = {
  mapBoxGetToken?:  {
    __typename: "MapboxGetTokenResult",
    token: string,
  } | null,
};

export type CheckForExistingCardsQueryVariables = {
  input: CheckForExistingCardsInput,
};

export type CheckForExistingCardsQuery = {
  checkForExistingCards?:  {
    __typename: "CheckForExistingCardsResponse",
    attractions?:  Array< {
      __typename: "AttractionExistsItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      isTravaCreated: number,
      duration?: ATTRACTION_DURATION | null,
      recommendationBadges?: Array< BADGES | null > | null,
      type: ATTRACTION_TYPE,
      deletedAt?: string | null,
      outOfSeason?: boolean | null,
    } | null > | null,
  } | null,
};

export type GetAttractionsToTagToPostQueryVariables = {
  input: GetAttractionsToTagToPostInput,
};

export type GetAttractionsToTagToPostQuery = {
  getAttractionsToTagToPost?:  {
    __typename: "GetAttractionsToTagToPostResponse",
    attractions?:  Array< {
      __typename: "AttractionToTagToPostItem",
      id: string,
      name: string,
      destinationName?: string | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      bucketListCount: number,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
    } | null > | null,
  } | null,
};

export type GoogleGetPlacesQueryVariables = {
  input?: GoogleGetPlacesInput | null,
};

export type GoogleGetPlacesQuery = {
  googleGetPlaces?:  Array< {
    __typename: "GoogleGetPlacesResult",
    mainText?: string | null,
    secondaryText?: string | null,
    placeId?: string | null,
    types?: Array< string | null > | null,
  } | null > | null,
};

export type GoogleGetPlaceDetailsQueryVariables = {
  input?: GoogleGetPlaceDetailsInput | null,
};

export type GoogleGetPlaceDetailsQuery = {
  googleGetPlaceDetails?:  {
    __typename: "GoogleGetPlaceDetailsResult",
    location?:  {
      __typename: "GoogleGetPlaceDetailsLocation",
      city?: string | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      googlePlaceId: string,
      formattedAddress?: string | null,
      googlePlacePageLink?: string | null,
      websiteLink?: string | null,
      phone?: string | null,
      businessStatus?: BusinessStatus | null,
      timezone?: string | null,
    } | null,
    placeName?: string | null,
  } | null,
};

export type FlightStatsGetScheduleDetailsQueryVariables = {
  input?: FlightStatsGetScheduleDetailsInput | null,
};

export type FlightStatsGetScheduleDetailsQuery = {
  flightStatsGetScheduleDetails?:  {
    __typename: "FlightStatsScheduleDetails",
    scheduledFlights?:  Array< {
      __typename: "FlightStatsScheduledFlights",
      carrierFsCode?: string | null,
      flightNumber?: string | null,
      departureAirportFsCode?: string | null,
      arrivalAirportFsCode?: string | null,
      departureTime?: string | null,
      arrivalTime?: string | null,
      stops?: number | null,
      departureTerminal?: string | null,
      arrivalTerminal?: string | null,
      flightEquipmentIataCode?: string | null,
      isCodeshare?: boolean | null,
      isWetlease?: boolean | null,
      serviceType?: string | null,
      referenceCode?: string | null,
      trafficRestrictions?: Array< string | null > | null,
      serviceClasses?: Array< string | null > | null,
    } | null > | null,
    request?:  {
      __typename: "FlightStatsRequest",
      departing?: boolean | null,
      url?: string | null,
    } | null,
  } | null,
};

export type HomeTabsFeedQuery = {
  homeTabsFeed?:  {
    __typename: "HomeTabsFeedResponse",
    stories?:  Array< {
      __typename: "Story",
      storyId: string,
    } | null > | null,
  } | null,
};

export type HomeTabsFeedPeopleOnThisTripQueryVariables = {
  input?: HomeTabsFeedPeopleOnThisTripInput | null,
};

export type HomeTabsFeedPeopleOnThisTripQuery = {
  homeTabsFeedPeopleOnThisTrip?:  {
    __typename: "HomeTabsFeedPeopleOnThisTripResponse",
    members?:  Array< {
      __typename: "UserTrip",
      userId: string,
      tripId: string,
      status: UserTripStatus,
      invitedByUserId: string,
      inviteLink?: string | null,
      lastMessageReadDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    userFollows?:  Array< {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
  } | null,
};

export type HomeTabsFeedPostCommentsQueryVariables = {
  input?: HomeTabsFeedPostCommentsInput | null,
};

export type HomeTabsFeedPostCommentsQuery = {
  homeTabsFeedPostComments?:  {
    __typename: "HomeTabsFeedPostCommentsResponse",
    id: string,
    userId: string,
    tripId: string,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    username: string,
    membersLength: number,
    description?: string | null,
    comments?:  Array< {
      __typename: "HomeTabsFeedPostCommentsResponseComment",
      id: string,
      userId: string,
      username: string,
      text: string,
      updatedAt: string,
    } | null > | null,
  } | null,
};

export type HomeTabsAccountTripsQueryVariables = {
  input?: HomeTabsAccountTripsInput | null,
};

export type HomeTabsAccountTripsQuery = {
  homeTabsAccountTrips?:  {
    __typename: "HomeTabsAccountTripsResponse",
    stories?:  Array< {
      __typename: "StoryAccountTrips",
      storyId: string,
    } | null > | null,
  } | null,
};

export type HomeTabsSuggestedFeedQueryVariables = {
  input?: HomeTabsSuggestedFeedInput | null,
};

export type HomeTabsSuggestedFeedQuery = {
  homeTabsSuggestedFeed?:  {
    __typename: "HomeTabsSuggestedFeedResponse",
    stories?:  Array< {
      __typename: "Story",
      storyId: string,
    } | null > | null,
    sharedPostError?:  {
      __typename: "SharedPostError",
      type: SHARED_POST_ERROR_TYPE,
      authorId?: string | null,
      authorUsername?: string | null,
    } | null,
    referringUserInfo?:  {
      __typename: "ReferringUserInfo",
      id: string,
      username: string,
    } | null,
  } | null,
};

export type NotificationPostQueryVariables = {
  input?: NotificationPostInput | null,
};

export type NotificationPostQuery = {
  notificationPost?:  {
    __typename: "NotificationPostResponse",
    post?:  {
      __typename: "NotificationPost",
      id: string,
      createdAt: string,
      userId: string,
      tripId: string,
      membersLength: number,
      description: string,
      cloudinaryUrl: string,
      username: string,
      authorPublic?: boolean | null,
      destinationId?: string | null,
      destinationIcon?: string | null,
      destinationName?: string | null,
      destinationState?: string | null,
      destinationCountry?: string | null,
      attractionId?: string | null,
      attractionName?: string | null,
      likesCount: number,
      commentsCount: number,
      mediaType?: MEDIA_TYPES | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type GetUserContactsQuery = {
  getUserContacts?:  {
    __typename: "GetUserContactsResponse",
    contactsOnTrava:  Array< {
      __typename: "SearchUser",
      id: string,
      username?: string | null,
      email?: string | null,
      phone?: string | null,
      name?: string | null,
      createdAt: string,
      updatedAt: string,
      bucketListsCollected?: number | null,
    } >,
    contactsNotOnTrava:  Array< {
      __typename: "Contact",
      emailAddresses: Array< string | null >,
      phoneNumbers: Array< string | null >,
      name?: string | null,
      id: string,
    } >,
    userContactsOnTravaIds: Array< string >,
  } | null,
};

export type ExploreSearchAttractionsQueryVariables = {
  input?: ExploreSearchAttractionsInput | null,
};

export type ExploreSearchAttractionsQuery = {
  exploreSearchAttractions?:  {
    __typename: "ExploreSearchAttractionsResponse",
    attractions?:  Array< {
      __typename: "ExploreSearchAttractionItem",
      id: string,
      name: string,
      distance?: number | null,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      recommendationBadges?: Array< BADGES | null > | null,
    } | null > | null,
    nextPageExists: boolean,
  } | null,
};

export type ExploreMapSearchAttractionsQueryVariables = {
  input?: ExploreMapSearchAttractionsInput | null,
};

export type ExploreMapSearchAttractionsQuery = {
  exploreMapSearchAttractions?:  {
    __typename: "ExploreMapSearchAttractionsResponse",
    attractions?:  Array< {
      __typename: "ExploreSearchAttractionItem",
      id: string,
      name: string,
      distance?: number | null,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      recommendationBadges?: Array< BADGES | null > | null,
    } | null > | null,
  } | null,
};

export type OpenSearchDestinationsQueryVariables = {
  input?: OpenSearchDestinationsInput | null,
};

export type OpenSearchDestinationsQuery = {
  openSearchDestinations?:  {
    __typename: "OpenSearchDestinationsResponse",
    featured?:  Array< {
      __typename: "SearchDestinationItem",
      id: string,
      name: string,
      icon?: string | null,
      state?: string | null,
      country?: string | null,
      numberOfExperiences?: number | null,
    } | null > | null,
    other?:  Array< {
      __typename: "SearchDestinationItem",
      id: string,
      name: string,
      icon?: string | null,
      state?: string | null,
      country?: string | null,
      numberOfExperiences?: number | null,
    } | null > | null,
  } | null,
};

export type ExploreTopUsersQuery = {
  exploreTopUsers?:  {
    __typename: "ExploreTopUsersResponse",
    users?:  Array< {
      __typename: "SearchUser",
      id: string,
      username?: string | null,
      email?: string | null,
      phone?: string | null,
      name?: string | null,
      createdAt: string,
      updatedAt: string,
      bucketListsCollected?: number | null,
    } | null > | null,
  } | null,
};

export type OpenSearchListNearbyAttractionsQueryVariables = {
  input?: OpenSearchListNearbyAttractionsInput | null,
};

export type OpenSearchListNearbyAttractionsQuery = {
  openSearchListNearbyAttractions?:  {
    __typename: "OpenSearchListNearbyAttractionsResponse",
    attractions:  Array< {
      __typename: "OpenSearchListAttractionItem",
      id: string,
      name: string,
      type: ATTRACTION_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      duration?: ATTRACTION_DURATION | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      isTravaCreated: number,
      authorType: AUTHOR_TYPE,
      deletedAt?: string | null,
    } | null >,
  } | null,
};

export type AddToItinerarySearchQueryVariables = {
  input?: AddToItinerarySearchInput | null,
};

export type AddToItinerarySearchQuery = {
  addToItinerarySearch?:  {
    __typename: "AddToItinerarySearchResponse",
    attractions:  Array< {
      __typename: "ItinerarySearchAttractionItem",
      id: string,
      name: string,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      distance: number,
      inSeason: boolean,
      inMyBucketList: boolean,
      onItinerary: boolean,
      yesVotes: number,
      noVotes: number,
      recommendationBadges?: Array< BADGES | null > | null,
    } >,
    nextPageExists: boolean,
  } | null,
};

export type AddToItineraryMapSearchQueryVariables = {
  input?: AddToItineraryMapSearchInput | null,
};

export type AddToItineraryMapSearchQuery = {
  addToItineraryMapSearch?:  {
    __typename: "AddToItineraryMapSearchResponse",
    attractions?:  Array< {
      __typename: "ItinerarySearchAttractionItem",
      id: string,
      name: string,
      isTravaCreated: number,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      bucketListCount: number,
      duration?: ATTRACTION_DURATION | null,
      type: ATTRACTION_TYPE,
      distance: number,
      inSeason: boolean,
      inMyBucketList: boolean,
      onItinerary: boolean,
      yesVotes: number,
      noVotes: number,
      recommendationBadges?: Array< BADGES | null > | null,
    } | null > | null,
  } | null,
};

export type GetExploreVotingListQueryVariables = {
  input: GetExploreVotingListInput,
};

export type GetExploreVotingListQuery = {
  getExploreVotingList?:  {
    __typename: "GetExploreVotingListResponse",
    attractions:  Array< {
      __typename: "ExploreVotingListItem",
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      cost?: ATTRACTION_COST | null,
      descriptionShort: string,
      id: string,
      inMyBucketList: boolean,
      inSeason: boolean,
      name: string,
      recommendationBadges?: Array< BADGES | null > | null,
      type: ATTRACTION_TYPE,
    } >,
    nextPageExists: boolean,
    votedOnAttractionIds: Array< string >,
  } | null,
};

export type GetGoogleAPIKeyQueryVariables = {
  input: GetGoogleAPIKeyInput,
};

export type GetGoogleAPIKeyQuery = {
  getGoogleAPIKey?:  {
    __typename: "GoogleGetAPIKeyResult",
    key: string,
  } | null,
};

export type GetAttractionsForSchedulerQueryVariables = {
  input?: GetAttractionsForScheduler | null,
};

export type GetAttractionsForSchedulerQuery = {
  getAttractionsForScheduler?:  {
    __typename: "GetAttractionsForSchedulerResponse",
    attractions?:  Array< {
      __typename: "OpenSearchListAttractionItem",
      id: string,
      name: string,
      type: ATTRACTION_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      duration?: ATTRACTION_DURATION | null,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      isTravaCreated: number,
      authorType: AUTHOR_TYPE,
      deletedAt?: string | null,
    } | null > | null,
  } | null,
};

export type GetAttractionQueryVariables = {
  id: string,
};

export type GetAttractionQuery = {
  getAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListAttractionsQueryVariables = {
  filter?: ModelAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttractionsQuery = {
  listAttractions?:  {
    __typename: "ModelAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAttractionsByDestinationQueryVariables = {
  destinationId: string,
  id?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttractionsByDestinationQuery = {
  listAttractionsByDestination?:  {
    __typename: "ModelAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAttractionsByTypeQueryVariables = {
  type: ATTRACTION_TYPE,
  bucketListCount?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttractionsByTypeQuery = {
  listAttractionsByType?:  {
    __typename: "ModelAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAttractionsByIsTravaCreatedByDestinationQueryVariables = {
  isTravaCreated: number,
  destinationId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttractionsByIsTravaCreatedByDestinationQuery = {
  listAttractionsByIsTravaCreatedByDestination?:  {
    __typename: "ModelAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateListAttractionsByCreatedAtQueryVariables = {
  label: AttractionLabel,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateListAttractionsByCreatedAtQuery = {
  privateListAttractionsByCreatedAt?:  {
    __typename: "ModelAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SearchAttractionsQueryVariables = {
  filter?: SearchableAttractionFilterInput | null,
  sort?: Array< SearchableAttractionSortInput | null > | null,
  limit?: number | null,
  nextToken?: string | null,
  from?: number | null,
  aggregates?: Array< SearchableAttractionAggregationInput | null > | null,
};

export type SearchAttractionsQuery = {
  searchAttractions?:  {
    __typename: "SearchableAttractionConnection",
    items:  Array< {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
    total?: number | null,
    aggregateItems:  Array< {
      __typename: "SearchableAggregateResult",
      name: string,
      result: ( {
          __typename: "SearchableAggregateScalarResult",
          value: number,
        } | {
          __typename: "SearchableAggregateBucketResult",
          buckets?:  Array< {
            __typename: string,
            key: string,
            doc_count: number,
          } | null > | null,
        }
      ) | null,
    } | null >,
  } | null,
};

export type PrivateGetAttractionSwipeQueryVariables = {
  userId: string,
  tripId: string,
  attractionId: string,
};

export type PrivateGetAttractionSwipeQuery = {
  privateGetAttractionSwipe?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAttractionSwipesByTripByDestinationQueryVariables = {
  tripId: string,
  destinationId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionSwipeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttractionSwipesByTripByDestinationQuery = {
  listAttractionSwipesByTripByDestination?:  {
    __typename: "ModelAttractionSwipeConnection",
    items:  Array< {
      __typename: "AttractionSwipe",
      userId: string,
      tripId: string,
      destinationId: string,
      attractionId: string,
      swipe: AttractionSwipeResult,
      label: AttractionSwipeLabel,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateListAttractionSwipesByUpdatedAtQueryVariables = {
  label: AttractionSwipeLabel,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttractionSwipeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateListAttractionSwipesByUpdatedAtQuery = {
  privateListAttractionSwipesByUpdatedAt?:  {
    __typename: "ModelAttractionSwipeConnection",
    items:  Array< {
      __typename: "AttractionSwipe",
      userId: string,
      tripId: string,
      destinationId: string,
      attractionId: string,
      swipe: AttractionSwipeResult,
      label: AttractionSwipeLabel,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCommentQueryVariables = {
  id: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    id: string,
    postId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetDestinationQueryVariables = {
  id: string,
};

export type GetDestinationQuery = {
  getDestination?:  {
    __typename: "Destination",
    id: string,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    name: string,
    icon?: string | null,
    coverImage?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    timezone?: string | null,
    attractions?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    nearbyThingsToDoCount?: number | null,
    nearbyPlacesToEatCount?: number | null,
    nearbyTravaThingsToDoCount?: number | null,
    nearbyTravaPlacesToEatCount?: number | null,
    coords:  {
      __typename: "Coords",
      long: number,
      lat: number,
    },
    state?: string | null,
    country?: string | null,
    continent?: string | null,
    deletedAt?: string | null,
    isTravaCreated: number,
    googlePlaceId?: string | null,
    featured?: boolean | null,
    altName?: string | null,
    label: string,
    pendingMigration?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListDestinationsQueryVariables = {
  filter?: ModelDestinationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDestinationsQuery = {
  listDestinations?:  {
    __typename: "ModelDestinationConnection",
    items:  Array< {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDestinationsByIsTravaCreatedQueryVariables = {
  isTravaCreated: number,
  name?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDestinationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDestinationsByIsTravaCreatedQuery = {
  listDestinationsByIsTravaCreated?:  {
    __typename: "ModelDestinationConnection",
    items:  Array< {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDestinationsByLabelQueryVariables = {
  label: string,
  name?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDestinationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDestinationsByLabelQuery = {
  listDestinationsByLabel?:  {
    __typename: "ModelDestinationConnection",
    items:  Array< {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SearchDestinationsQueryVariables = {
  filter?: SearchableDestinationFilterInput | null,
  sort?: Array< SearchableDestinationSortInput | null > | null,
  limit?: number | null,
  nextToken?: string | null,
  from?: number | null,
  aggregates?: Array< SearchableDestinationAggregationInput | null > | null,
};

export type SearchDestinationsQuery = {
  searchDestinations?:  {
    __typename: "SearchableDestinationConnection",
    items:  Array< {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    total?: number | null,
    aggregateItems:  Array< {
      __typename: "SearchableAggregateResult",
      name: string,
      result: ( {
          __typename: "SearchableAggregateScalarResult",
          value: number,
        } | {
          __typename: "SearchableAggregateBucketResult",
          buckets?:  Array< {
            __typename: string,
            key: string,
            doc_count: number,
          } | null > | null,
        }
      ) | null,
    } | null >,
  } | null,
};

export type PrivateGetDistanceQueryVariables = {
  key: string,
};

export type PrivateGetDistanceQuery = {
  privateGetDistance?:  {
    __typename: "Distance",
    key: string,
    value: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetFeatureFlagQueryVariables = {
  id: string,
};

export type GetFeatureFlagQuery = {
  getFeatureFlag?:  {
    __typename: "FeatureFlag",
    id: FeatureFlagName,
    isEnabled: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFeatureFlagsQueryVariables = {
  filter?: ModelFeatureFlagFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFeatureFlagsQuery = {
  listFeatureFlags?:  {
    __typename: "ModelFeatureFlagConnection",
    items:  Array< {
      __typename: "FeatureFlag",
      id: FeatureFlagName,
      isEnabled: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGooglePlaceQueryVariables = {
  id: string,
};

export type GetGooglePlaceQuery = {
  getGooglePlace?:  {
    __typename: "GooglePlace",
    id: string,
    isValid: number,
    data:  {
      __typename: "PlaceData",
      city?: string | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      name?: string | null,
      formattedAddress?: string | null,
      googlePlacePageLink?: string | null,
      websiteLink?: string | null,
      phone?: string | null,
      businessStatus?: BusinessStatus | null,
      reservable?: boolean | null,
      price?: number | null,
      editorialSummary?: string | null,
      types?: Array< string | null > | null,
    },
    consecutiveFailedRequests?: number | null,
    dataLastCheckedAt?: string | null,
    dataLastUpdatedAt?: string | null,
    webData?:  {
      __typename: "PlaceWebData",
      menuLink?: string | null,
      reservationLink?: string | null,
      bestVisitedByPopularTimes?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    } | null,
    yelpData?:  {
      __typename: "YelpData",
      id?: string | null,
      url?: string | null,
      price?: number | null,
      categories?: Array< string | null > | null,
    } | null,
    generatedSummary?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GooglePlacesByIsValidByDataLastCheckedAtQueryVariables = {
  isValid: number,
  dataLastCheckedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGooglePlaceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GooglePlacesByIsValidByDataLastCheckedAtQuery = {
  googlePlacesByIsValidByDataLastCheckedAt?:  {
    __typename: "ModelGooglePlaceConnection",
    items:  Array< {
      __typename: "GooglePlace",
      id: string,
      isValid: number,
      consecutiveFailedRequests?: number | null,
      dataLastCheckedAt?: string | null,
      dataLastUpdatedAt?: string | null,
      generatedSummary?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GooglePlacesByIsValidByDataLastUpdatedAtQueryVariables = {
  isValid: number,
  dataLastUpdatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGooglePlaceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GooglePlacesByIsValidByDataLastUpdatedAtQuery = {
  googlePlacesByIsValidByDataLastUpdatedAt?:  {
    __typename: "ModelGooglePlaceConnection",
    items:  Array< {
      __typename: "GooglePlace",
      id: string,
      isValid: number,
      consecutiveFailedRequests?: number | null,
      dataLastCheckedAt?: string | null,
      dataLastUpdatedAt?: string | null,
      generatedSummary?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMinimumVersionQueryVariables = {
  id: string,
};

export type GetMinimumVersionQuery = {
  getMinimumVersion?:  {
    __typename: "MinimumVersion",
    id: MinimumVersionName,
    minimumVersion: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetNotificationQueryVariables = {
  id: string,
};

export type GetNotificationQuery = {
  getNotification?:  {
    __typename: "Notification",
    id: string,
    receiverUserId: string,
    senderUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    senderUserId: string,
    type: NOTIFICATION_TYPE,
    text?: string | null,
    tripId?: string | null,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    postId?: string | null,
    post?:  {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    commentId?: string | null,
    comment?:  {
      __typename: "Comment",
      id: string,
      postId: string,
      userId: string,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    showInApp: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListNotificationsQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotificationsQuery = {
  listNotifications?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      receiverUserId: string,
      senderUserId: string,
      type: NOTIFICATION_TYPE,
      text?: string | null,
      tripId?: string | null,
      postId?: string | null,
      attractionId?: string | null,
      commentId?: string | null,
      showInApp: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNotificationsByReceiverUserQueryVariables = {
  receiverUserId: string,
  showInApp?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotificationsByReceiverUserQuery = {
  listNotificationsByReceiverUser?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      receiverUserId: string,
      senderUserId: string,
      type: NOTIFICATION_TYPE,
      text?: string | null,
      tripId?: string | null,
      postId?: string | null,
      attractionId?: string | null,
      commentId?: string | null,
      showInApp: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPhotographerQueryVariables = {
  id: string,
};

export type GetPhotographerQuery = {
  getPhotographer?:  {
    __typename: "Photographer",
    id: string,
    name: string,
    url?: string | null,
    pendingMigration?: boolean | null,
  } | null,
};

export type ListPhotographersQueryVariables = {
  filter?: ModelPhotographerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPhotographersQuery = {
  listPhotographers?:  {
    __typename: "ModelPhotographerConnection",
    items:  Array< {
      __typename: "Photographer",
      id: string,
      name: string,
      url?: string | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPhotographersByNameQueryVariables = {
  name: string,
  id?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPhotographerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPhotographersByNameQuery = {
  listPhotographersByName?:  {
    __typename: "ModelPhotographerConnection",
    items:  Array< {
      __typename: "Photographer",
      id: string,
      name: string,
      url?: string | null,
      pendingMigration?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateGetPostQueryVariables = {
  id: string,
};

export type PrivateGetPostQuery = {
  privateGetPost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId?: string | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId?: string | null,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    description?: string | null,
    commentsCount: number,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
    } | null,
    mediaType: MEDIA_TYPES,
    cloudinaryUrl: string,
    width: number,
    height: number,
    format?: string | null,
    videoDuration?: number | null,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string | null,
    likesCount: number,
  } | null,
};

export type PrivateListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateListPostsQuery = {
  privateListPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateListPostsByTripByUserQueryVariables = {
  tripId: string,
  userId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateListPostsByTripByUserQuery = {
  privateListPostsByTripByUser?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      userId: string,
      tripId: string,
      destinationId?: string | null,
      attractionId?: string | null,
      description?: string | null,
      commentsCount: number,
      mediaType: MEDIA_TYPES,
      cloudinaryUrl: string,
      width: number,
      height: number,
      format?: string | null,
      videoDuration?: number | null,
      createdAt: string,
      updatedAt: string,
      deletedAt?: string | null,
      likesCount: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateGetTimelineEntryQueryVariables = {
  id: string,
};

export type PrivateGetTimelineEntryQuery = {
  privateGetTimelineEntry?:  {
    __typename: "TimelineEntry",
    id: string,
    tripId: string,
    members?:  {
      __typename: "ModelTimelineEntryMemberConnection",
      nextToken?: string | null,
    } | null,
    timelineEntryType: TimelineEntryType,
    notes?: string | null,
    date: number,
    time: number,
    rentalPickupLocation?: string | null,
    rentalDropoffLocation?: string | null,
    lodgingArrivalNameAndAddress?: string | null,
    lodgingDepartureNameAndAddress?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateGetTripQueryVariables = {
  id: string,
};

export type PrivateGetTripQuery = {
  privateGetTrip?:  {
    __typename: "Trip",
    id: string,
    name: string,
    tripDestinations?:  {
      __typename: "ModelTripDestinationConnection",
      nextToken?: string | null,
    } | null,
    members?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    attractionSwipesByUser?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    timelineEntries?:  {
      __typename: "ModelTimelineEntryConnection",
      nextToken?: string | null,
    } | null,
    completed?: boolean | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type PrivateListTripDestinationUsersQueryVariables = {
  tripId?: string | null,
  destinationIdUserId?: ModelTripDestinationUserPrimaryCompositeKeyConditionInput | null,
  filter?: ModelTripDestinationUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type PrivateListTripDestinationUsersQuery = {
  privateListTripDestinationUsers?:  {
    __typename: "ModelTripDestinationUserConnection",
    items:  Array< {
      __typename: "TripDestinationUser",
      tripId: string,
      destinationId: string,
      userId: string,
      isReady: boolean,
      tripPlanViewedAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTripDestinationUsersByTripByDestinationQueryVariables = {
  tripId: string,
  destinationId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTripDestinationUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTripDestinationUsersByTripByDestinationQuery = {
  listTripDestinationUsersByTripByDestination?:  {
    __typename: "ModelTripDestinationUserConnection",
    items:  Array< {
      __typename: "TripDestinationUser",
      tripId: string,
      destinationId: string,
      userId: string,
      isReady: boolean,
      tripPlanViewedAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUpdatesByTypeQueryVariables = {
  type: UpdateType,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUpdateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUpdatesByTypeQuery = {
  listUpdatesByType?:  {
    __typename: "ModelUpdateConnection",
    items:  Array< {
      __typename: "Update",
      type: UpdateType,
      parityLastProcessed: Parity,
      createdAt: string,
      updatedAt: string,
      id: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    appleId?: string | null,
    avatar?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    dateOfBirth?: string | null,
    description?: string | null,
    email?: string | null,
    contactEmail?: string | null,
    facebookId?: string | null,
    fcmToken?: string | null,
    followedBy?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    follows?:  {
      __typename: "ModelUserFollowConnection",
      nextToken?: string | null,
    } | null,
    blocks?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    blockedBy?:  {
      __typename: "ModelUserBlockConnection",
      nextToken?: string | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
    } | null,
    viewedPosts?:  {
      __typename: "ModelUserPostConnection",
      nextToken?: string | null,
    } | null,
    googleId?: string | null,
    location?: string | null,
    name?: string | null,
    phone?: string | null,
    privacy?: PRIVACY | null,
    pushNotifications?: boolean | null,
    referralLink?: string | null,
    referrals?:  {
      __typename: "ModelUserReferralConnection",
      nextToken?: string | null,
    } | null,
    userFollowByMe?:  {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    username?: string | null,
    userTrips?:  {
      __typename: "ModelUserTripConnection",
      nextToken?: string | null,
    } | null,
    myCards?:  {
      __typename: "ModelAttractionConnection",
      nextToken?: string | null,
    } | null,
    bucketList?:  {
      __typename: "ModelUserAttractionConnection",
      nextToken?: string | null,
    } | null,
    likedPosts?:  {
      __typename: "ModelUserPostLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserByUsernameQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetUserByUsernameQuery = {
  getUserByUsername?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SearchUsersQueryVariables = {
  filter?: SearchableUserFilterInput | null,
  sort?: Array< SearchableUserSortInput | null > | null,
  limit?: number | null,
  nextToken?: string | null,
  from?: number | null,
  aggregates?: Array< SearchableUserAggregationInput | null > | null,
};

export type SearchUsersQuery = {
  searchUsers?:  {
    __typename: "SearchableUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    total?: number | null,
    aggregateItems:  Array< {
      __typename: "SearchableAggregateResult",
      name: string,
      result: ( {
          __typename: "SearchableAggregateScalarResult",
          value: number,
        } | {
          __typename: "SearchableAggregateBucketResult",
          buckets?:  Array< {
            __typename: string,
            key: string,
            doc_count: number,
          } | null > | null,
        }
      ) | null,
    } | null >,
  } | null,
};

export type PrivateListUserAttractionsQueryVariables = {
  userId?: string | null,
  attractionId?: ModelIDKeyConditionInput | null,
  filter?: ModelUserAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type PrivateListUserAttractionsQuery = {
  privateListUserAttractions?:  {
    __typename: "ModelUserAttractionConnection",
    items:  Array< {
      __typename: "UserAttraction",
      userId: string,
      attractionId: string,
      authorId?: string | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserAttractionsByAttractionQueryVariables = {
  attractionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserAttractionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserAttractionsByAttractionQuery = {
  userAttractionsByAttraction?:  {
    __typename: "ModelUserAttractionConnection",
    items:  Array< {
      __typename: "UserAttraction",
      userId: string,
      attractionId: string,
      authorId?: string | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserBlockQueryVariables = {
  userId: string,
  blockedUserId: string,
};

export type GetUserBlockQuery = {
  getUserBlock?:  {
    __typename: "UserBlock",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    blockedUserId: string,
    blockedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserBlocksQueryVariables = {
  userId?: string | null,
  blockedUserId?: ModelIDKeyConditionInput | null,
  filter?: ModelUserBlockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserBlocksQuery = {
  listUserBlocks?:  {
    __typename: "ModelUserBlockConnection",
    items:  Array< {
      __typename: "UserBlock",
      userId: string,
      blockedUserId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateListUserContactsQueryVariables = {
  userId?: string | null,
  recordId?: ModelStringKeyConditionInput | null,
  filter?: ModelUserContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type PrivateListUserContactsQuery = {
  privateListUserContacts?:  {
    __typename: "ModelUserContactConnection",
    items:  Array< {
      __typename: "UserContact",
      userId: string,
      recordId: string,
      travaUserIds?: Array< string | null > | null,
      name?: string | null,
      email?: Array< string | null > | null,
      phone?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateGetUserContactsByUserByContactNameQueryVariables = {
  userId: string,
  name?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateGetUserContactsByUserByContactNameQuery = {
  privateGetUserContactsByUserByContactName?:  {
    __typename: "ModelUserContactConnection",
    items:  Array< {
      __typename: "UserContact",
      userId: string,
      recordId: string,
      travaUserIds?: Array< string | null > | null,
      name?: string | null,
      email?: Array< string | null > | null,
      phone?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserFollowQueryVariables = {
  userId: string,
  followedUserId: string,
};

export type GetUserFollowQuery = {
  getUserFollow?:  {
    __typename: "UserFollow",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    followedUserId: string,
    followedUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    approved: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserFollowsQueryVariables = {
  userId?: string | null,
  followedUserId?: ModelIDKeyConditionInput | null,
  filter?: ModelUserFollowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserFollowsQuery = {
  listUserFollows?:  {
    __typename: "ModelUserFollowConnection",
    items:  Array< {
      __typename: "UserFollow",
      userId: string,
      followedUserId: string,
      approved: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserReferralQueryVariables = {
  userId: string,
  referredUserId: string,
};

export type GetUserReferralQuery = {
  getUserReferral?:  {
    __typename: "UserReferral",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referredUserId: string,
    referredUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    referralType: REFERRAL_TYPES,
    sourceOS?: string | null,
    matchGuaranteed?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserReferralsQueryVariables = {
  userId?: string | null,
  referredUserId?: ModelIDKeyConditionInput | null,
  filter?: ModelUserReferralFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserReferralsQuery = {
  listUserReferrals?:  {
    __typename: "ModelUserReferralConnection",
    items:  Array< {
      __typename: "UserReferral",
      userId: string,
      referredUserId: string,
      referralType: REFERRAL_TYPES,
      sourceOS?: string | null,
      matchGuaranteed?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PrivateListUserSessionsByCreatedAtQueryVariables = {
  label: UserSessionLabel,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PrivateListUserSessionsByCreatedAtQuery = {
  privateListUserSessionsByCreatedAt?:  {
    __typename: "ModelUserSessionConnection",
    items:  Array< {
      __typename: "UserSession",
      id: string,
      userId: string,
      deviceType: PLATFORM,
      appVersion: string,
      label: UserSessionLabel,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserTripByTripQueryVariables = {
  tripId: string,
  userId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserTripFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserTripByTripQuery = {
  listUserTripByTrip?:  {
    __typename: "ModelUserTripConnection",
    items:  Array< {
      __typename: "UserTrip",
      userId: string,
      tripId: string,
      status: UserTripStatus,
      invitedByUserId: string,
      inviteLink?: string | null,
      lastMessageReadDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SignUpCheckGetUserByUsernameQueryVariables = {
  username?: string | null,
};

export type SignUpCheckGetUserByUsernameQuery = {
  signUpCheckGetUserByUsername?: string | null,
};

export type SignInErrorCheckIfUsernameExistsQueryVariables = {
  username?: string | null,
};

export type SignInErrorCheckIfUsernameExistsQuery = {
  signInErrorCheckIfUsernameExists?:  {
    __typename: "SignInErrorCheckIfUsernameExistsResponse",
    provider?: PROVIDER | null,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  tripId: string,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    id: string,
    tripId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text?: string | null,
    system?: boolean | null,
    image?:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null,
    sent: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserTripSubscriptionVariables = {
  userId: string,
};

export type OnDeleteUserTripSubscription = {
  onDeleteUserTrip?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserTripByTripIdSubscriptionVariables = {
  tripId: string,
};

export type OnCreateUserTripByTripIdSubscription = {
  onCreateUserTripByTripId?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserTripByTripIdSubscriptionVariables = {
  tripId: string,
};

export type OnDeleteUserTripByTripIdSubscription = {
  onDeleteUserTripByTripId?:  {
    __typename: "UserTrip",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    trip?:  {
      __typename: "Trip",
      id: string,
      name: string,
      completed?: boolean | null,
      link?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    status: UserTripStatus,
    invitedByUserId: string,
    invitedByUser?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    inviteLink?: string | null,
    lastMessageReadDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTripDestinationUserByTripIdSubscriptionVariables = {
  tripId: string,
};

export type OnUpdateTripDestinationUserByTripIdSubscription = {
  onUpdateTripDestinationUserByTripId?:  {
    __typename: "TripDestinationUser",
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    isReady: boolean,
    tripPlanViewedAt?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTripDestinationByTripIdSubscriptionVariables = {
  tripId: string,
};

export type OnUpdateTripDestinationByTripIdSubscription = {
  onUpdateTripDestinationByTripId?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTripDestinationSubscriptionVariables = {
  tripId: string,
};

export type OnCreateTripDestinationSubscription = {
  onCreateTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTripDestinationSubscriptionVariables = {
  tripId: string,
};

export type OnDeleteTripDestinationSubscription = {
  onDeleteTripDestination?:  {
    __typename: "TripDestination",
    tripId: string,
    destinationId: string,
    attractionSwipes?:  {
      __typename: "ModelAttractionSwipeConnection",
      nextToken?: string | null,
    } | null,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    startDate?: number | null,
    endDate?: number | null,
    startTime?: TripDestinationTime | null,
    endTime?: TripDestinationTime | null,
    tripPlan?:  Array< {
      __typename: "TripPlanDay",
      dayOfYear: number,
    } | null > | null,
    tripDestinationUsers?:  {
      __typename: "ModelTripDestinationUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFeatureFlagSubscriptionVariables = {
  id: FeatureFlagName,
};

export type OnUpdateFeatureFlagSubscription = {
  onUpdateFeatureFlag?:  {
    __typename: "FeatureFlag",
    id: FeatureFlagName,
    isEnabled: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAttractionSubscriptionVariables = {
  id: string,
};

export type OnUpdateAttractionSubscription = {
  onUpdateAttraction?:  {
    __typename: "Attraction",
    id: string,
    attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
    attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
    attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
    author?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    authorId?: string | null,
    authorType: AUTHOR_TYPE,
    bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
    costCurrency: CURRENCY_TYPE,
    cost?: ATTRACTION_COST | null,
    costNote?: string | null,
    costType: ATTRACTION_COST_TYPE,
    descriptionLong: string,
    descriptionShort: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    destinationId: string,
    duration?: ATTRACTION_DURATION | null,
    images?:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
      googlePhotoReference?: string | null,
    } | null > | null,
    reservation?: ATTRACTION_RESERVATION | null,
    locations?:  Array< {
      __typename: "StartEndLocation",
      id: string,
      displayOrder: number,
      deleted?: boolean | null,
    } | null > | null,
    name: string,
    reservationNote?: string | null,
    type: ATTRACTION_TYPE,
    isTravaCreated: number,
    deletedAt?: string | null,
    privacy: ATTRACTION_PRIVACY,
    bucketListCount: number,
    rank?: number | null,
    seasons?:  Array< {
      __typename: "AttractionSeason",
      startMonth?: number | null,
      startDay?: number | null,
      endMonth?: number | null,
      endDay?: number | null,
    } | null > | null,
    label: AttractionLabel,
    createdAt: string,
    updatedAt?: string | null,
    recommendationBadges?: Array< BADGES | null > | null,
    generation?:  {
      __typename: "Generation",
      step: GenerationStep,
      status: Status,
      lastUpdatedAt: string,
      failureCount?: number | null,
      lastFailureReason?: string | null,
    } | null,
    pendingMigration?: boolean | null,
    viatorProducts?:  {
      __typename: "ModelViatorProductConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnPutAttractionSwipeByTripIdByDestinationIdSubscriptionVariables = {
  tripId: string,
  destinationId: string,
};

export type OnPutAttractionSwipeByTripIdByDestinationIdSubscription = {
  onPutAttractionSwipeByTripIdByDestinationId?:  {
    __typename: "AttractionSwipe",
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      appleId?: string | null,
      dateOfBirth?: string | null,
      description?: string | null,
      email?: string | null,
      contactEmail?: string | null,
      facebookId?: string | null,
      fcmToken?: string | null,
      googleId?: string | null,
      location?: string | null,
      name?: string | null,
      phone?: string | null,
      privacy?: PRIVACY | null,
      pushNotifications?: boolean | null,
      referralLink?: string | null,
      username?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    tripId: string,
    destinationId: string,
    destination?:  {
      __typename: "Destination",
      id: string,
      authorId?: string | null,
      name: string,
      icon?: string | null,
      timezone?: string | null,
      nearbyThingsToDoCount?: number | null,
      nearbyPlacesToEatCount?: number | null,
      nearbyTravaThingsToDoCount?: number | null,
      nearbyTravaPlacesToEatCount?: number | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      deletedAt?: string | null,
      isTravaCreated: number,
      googlePlaceId?: string | null,
      featured?: boolean | null,
      altName?: string | null,
      label: string,
      pendingMigration?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    attractionId: string,
    attraction?:  {
      __typename: "Attraction",
      id: string,
      attractionCategories?: Array< ATTRACTION_CATEGORY_TYPE | null > | null,
      attractionCuisine?: Array< ATTRACTION_CUISINE_TYPE | null > | null,
      attractionTargetGroups?: Array< ATTRACTION_TARGET_GROUP | null > | null,
      authorId?: string | null,
      authorType: AUTHOR_TYPE,
      bestVisited?: Array< ATTRACTION_BEST_VISIT_TIME | null > | null,
      costCurrency: CURRENCY_TYPE,
      cost?: ATTRACTION_COST | null,
      costNote?: string | null,
      costType: ATTRACTION_COST_TYPE,
      descriptionLong: string,
      descriptionShort: string,
      destinationId: string,
      duration?: ATTRACTION_DURATION | null,
      reservation?: ATTRACTION_RESERVATION | null,
      name: string,
      reservationNote?: string | null,
      type: ATTRACTION_TYPE,
      isTravaCreated: number,
      deletedAt?: string | null,
      privacy: ATTRACTION_PRIVACY,
      bucketListCount: number,
      rank?: number | null,
      label: AttractionLabel,
      createdAt: string,
      updatedAt?: string | null,
      recommendationBadges?: Array< BADGES | null > | null,
      pendingMigration?: boolean | null,
    } | null,
    swipe: AttractionSwipeResult,
    label: AttractionSwipeLabel,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type AttractionLocationCustomGetAttractionFragment = {
  __typename: "Location",
  googlePlace:  {
    __typename: "GooglePlace",
    id: string,
    isValid: number,
    dataLastCheckedAt?: string | null,
    dataLastUpdatedAt?: string | null,
    data:  {
      __typename: "PlaceData",
      coords:  {
        __typename: "Coords",
        lat: number,
        long: number,
      },
      city?: string | null,
      state?: string | null,
      country?: string | null,
      continent?: string | null,
      name?: string | null,
      formattedAddress?: string | null,
      googlePlacePageLink?: string | null,
      websiteLink?: string | null,
      phone?: string | null,
      photos?:  Array< {
        __typename: "PlacePhoto",
        photo_reference?: string | null,
      } | null > | null,
      hours?:  {
        __typename: "Hours",
        weekdayText: Array< string >,
        periods:  Array< {
          __typename: "Period",
          open:  {
            __typename: "OpenCloseTime",
            day: number,
            time: string,
          },
          close?:  {
            __typename: "OpenCloseTime",
            day: number,
            time: string,
          } | null,
        } >,
      } | null,
      businessStatus?: BusinessStatus | null,
      rating?:  {
        __typename: "Rating",
        score?: number | null,
        count?: number | null,
      } | null,
    },
    webData?:  {
      __typename: "PlaceWebData",
      menuLink?: string | null,
      reservationLink?: string | null,
    } | null,
  },
  googlePlaceId: string,
  timezone?: string | null,
  id: string,
};
