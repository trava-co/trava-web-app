"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaReservationsInfoChatThread = exports.reservationsMap = exports.DESCRIPTIVE_RESERVATION_NAMES = void 0;
const API_1 = require("shared-types/API");
var DESCRIPTIVE_RESERVATION_NAMES;
(function (DESCRIPTIVE_RESERVATION_NAMES) {
    DESCRIPTIVE_RESERVATION_NAMES["RESERVATIONS_NOT_TAKEN"] = "RESERVATIONS_NOT_TAKEN";
    DESCRIPTIVE_RESERVATION_NAMES["RESERVATIONS_OPTIONAL"] = "RESERVATIONS_OPTIONAL";
    DESCRIPTIVE_RESERVATION_NAMES["RESERVATIONS_RECOMMENDED"] = "RESERVATIONS_RECOMMENDED";
    DESCRIPTIVE_RESERVATION_NAMES["RESERVATIONS_REQUIRED"] = "RESERVATIONS_REQUIRED";
})(DESCRIPTIVE_RESERVATION_NAMES || (exports.DESCRIPTIVE_RESERVATION_NAMES = DESCRIPTIVE_RESERVATION_NAMES = {}));
exports.reservationsMap = {
    [DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_NOT_TAKEN]: API_1.ATTRACTION_RESERVATION.NOT_TAKEN,
    [DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_OPTIONAL]: API_1.ATTRACTION_RESERVATION.OPTIONAL,
    [DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_RECOMMENDED]: API_1.ATTRACTION_RESERVATION.RECOMMENDED,
    [DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED]: API_1.ATTRACTION_RESERVATION.REQUIRED,
};
const getTravaReservationsInfoChatThread = ({ attractionName, destinationName, attractionType, relevantDescription, reservable, possibleOptions, }) => {
    // add reservable blurb if it exists. If it is undefined, don't add it.
    const reservableBlurb = reservable === undefined
        ? ''
        : `According to Google Places, this attraction is ${reservable ? '' : 'not '}reservable.`;
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Provided an attraction, your job is to determine its reservation policy, using any research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of these options:${possibleOptions.join(',')}. If you are not certain reservations are required, select either ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_RECOMMENDED} or ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_OPTIONAL}. Only choose ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED} if certain.`,
            },
            {
                role: 'user',
                content: 'Determine the reservation policy of "La Fisna Visnos" in Madrid. Here\'s my research:This spot can get busy so try to book a table in advance.',
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_RECOMMENDED,
            },
            {
                role: 'user',
                content: 'Determine the reservation policy of "Watch a Red Sox Game at Fenway Park" in Boston. Here\'s my research: Buy tickets in advance online and get ready to enjoy a night in one of American\'s smallest and quirkiest ballparks.',
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED,
            },
            {
                role: 'user',
                content: 'Determine the reservation policy for "Explore the Seaport" in Boston. Here\'s my research: Stroll along the Harborwalk to take in the seaside views before heading into the neighborhood proper for a drink and a bite to eat. If you get tired of walking, the Old Town Trolley Tour is a great way to see a lot of the Seaport in a short amount of time.',
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_NOT_TAKEN,
            },
            {
                role: 'user',
                content: 'Determine the reservation policy for "Tour the cemeteries" in New Orleans. Here\'s my research:All locations are free to the public during regular hours, and a few have their own tour guides on site. It\'s very easy to book an official multi-cemetery tour through a company but you can also easily plan your own without straying much off the beaten path.',
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_OPTIONAL,
            },
            {
                role: 'user',
                content: `Determine the reservation policy for \"${attractionName}\" in ${destinationName}. Here's my research:${relevantDescription}.${reservableBlurb}`,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Provided a restaurant, your job is to determine its reservation policy, using the research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of these options:${possibleOptions.join(',')}. If you are not certain reservations are required, select either ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_RECOMMENDED} or ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_OPTIONAL}. Only choose ${DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED} if certain.`,
            },
            {
                role: 'user',
                content: "Determine the reservation policy for Diner in New York. Here's my research:Get a reservation in advance, as the retro interior is quite small (a big group might be hard to accommodate), though there is ample outdoor seating.",
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED,
            },
            {
                role: 'user',
                content: "Determine the reservation policy for Alinea in Chicago. Here's my research: Reservations need to be made months in advance and are extremely difficult to get, so be sure to plan ahead.",
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_REQUIRED,
            },
            {
                role: 'user',
                content: "Determine the reservation policy for Bouillon Julien in Paris. Here's my research:They don't take reservations, but the line goes quickly.",
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_NOT_TAKEN,
            },
            {
                role: 'user',
                content: "Determine the reservation policy for Ordinary in Charleston. Here's my research:Note that reservations are for indoor dining only -- the bar and patio areas are first come first served.",
            },
            {
                role: 'assistant',
                content: DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_OPTIONAL,
            },
            {
                role: 'user',
                content: `Determine the reservation policy for ${attractionName} in ${destinationName}. Here's my research:${relevantDescription}.${reservableBlurb}`,
            },
        ];
        return EAT;
    }
};
exports.getTravaReservationsInfoChatThread = getTravaReservationsInfoChatThread;
