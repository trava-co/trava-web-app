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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tearex_1 = __importDefault(require("tearex"));
const teaRexCreateEntity = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Main query
     */
    const entity = yield tearex_1.default.createEntity({
        id: event.arguments.input.teaRexEntity.id,
        label: event.arguments.input.teaRexEntity.label,
    });
    if (!entity) {
        throw new Error('Failed to create TeaRex entity');
    }
    return true;
});
exports.default = teaRexCreateEntity;
