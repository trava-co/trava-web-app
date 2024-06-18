"use strict";
// https://gist.github.com/dabit3/b703e612e6f450251f79c345cda7a3f4
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForGroup = void 0;
// To man manually check for groups, you can get the user's identity from
// the event.identity object, and check for claims in
// the event.identity.claims['cognito:groups']
function checkForGroup(event, groupName) {
    if (event.identity) {
        if (event.identity.claims['cognito:groups']) {
            if (event.identity.claims['cognito:groups'].includes(groupName)) {
                return true;
            }
        }
    }
    return false;
}
exports.checkForGroup = checkForGroup;
