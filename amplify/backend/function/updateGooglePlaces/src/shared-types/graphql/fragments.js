"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragmentAttractionLocationCustomGetAttraction = void 0;
exports.fragmentAttractionLocationCustomGetAttraction = `
  fragment AttractionLocationCustomGetAttraction on Location {
    googlePlace {
      id
      isValid
      dataLastCheckedAt
      dataLastUpdatedAt
      data {
        coords {
          lat
          long
        }
        city
        state
        country
        continent
        name
        formattedAddress
        googlePlacePageLink
        websiteLink
        phone
        photos {
          photo_reference
        }
        hours {
          weekdayText
          periods {
            open {
              day
              time
            }
            close {
              day
              time
            }
          }
        }
        businessStatus
        rating {
          score
          count
        }
      }
      webData {
        menuLink
        reservationLink
      }
    }
    googlePlaceId
    timezone
    id
  }
`;
