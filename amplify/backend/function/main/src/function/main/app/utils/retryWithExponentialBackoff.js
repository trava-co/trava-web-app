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
exports.retryWithExponentialBackoff = void 0;
function retryWithExponentialBackoff({ func, initialDelay = 2, exponentialBase = 2, jitter = true, maxRetries = 2, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let delay = initialDelay;
        let retries = 0;
        while (true) {
            try {
                return yield func();
            }
            catch (error) {
                console.log(`Failed attempt ${retries}: ${JSON.stringify(error, null, 2)}`);
                retries++;
                if (retries > maxRetries) {
                    throw error;
                }
                if (jitter) {
                    delay *= exponentialBase * (1 + Math.random());
                }
                else {
                    delay *= exponentialBase;
                }
                yield new Promise((resolve) => setTimeout(resolve, delay * 1000));
            }
        }
    });
}
exports.retryWithExponentialBackoff = retryWithExponentialBackoff;
