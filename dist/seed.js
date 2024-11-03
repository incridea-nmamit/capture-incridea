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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var eventNames = Array.from({ length: 20 }, function (_, i) { return "Event ".concat(i + 1); });
var descriptions = Array.from({ length: 20 }, function (_, i) {
    return "Description for event ".concat(i + 1, ". This event is designed to provide insights into various topics and features various activities and discussions that will engage participants and enrich their experience.");
});
var shortDescriptions = Array.from({ length: 20 }, function (_, i) {
    return "Short desc for event ".concat(i + 1, ".");
});
var imagePath = 'https://utfs.io/f/0yks13NtToBiyD1mo3dKMt25jkdFfWpIvLESBusza14COqm3';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var eventPromises, galleryPromises, teamNames, teamPromises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventPromises = eventNames.map(function (name, index) {
                        return prisma.events.create({
                            data: {
                                name: name,
                                description: descriptions[index] || '', // Ensure it defaults to an empty string if undefined
                                shortDescription: shortDescriptions[index] || '', // Ensure it defaults to an empty string if undefined
                                image: imagePath,
                                type: ['core', 'technical', 'nontechnical', 'special'][Math.floor(Math.random() * 4)],
                                day: ['day1', 'day2', 'day3'][Math.floor(Math.random() * 3)],
                                visibility: Math.random() < 0.8 ? 'active' : 'inactive', // 80% active, 20% inactive
                            },
                        });
                    });
                    return [4 /*yield*/, Promise.all(eventPromises)];
                case 1:
                    _a.sent();
                    galleryPromises = Array.from({ length: 50 }, function () { return __awaiter(_this, void 0, void 0, function () {
                        var eventCategory, eventName;
                        return __generator(this, function (_a) {
                            eventCategory = Math.random() < 0.5 ? 'events' : 'snaps';
                            eventName = eventCategory === 'events' ? eventNames[Math.floor(Math.random() * eventNames.length)] || 'Default Event' : 'Default Event';
                            return [2 /*return*/, prisma.gallery.create({
                                    data: {
                                        image_path: imagePath,
                                        event_name: eventName, // Ensure it's assigned a valid name
                                        event_category: eventCategory,
                                    },
                                })];
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(galleryPromises)];
                case 2:
                    _a.sent();
                    teamNames = Array.from({ length: 50 }, function (_, i) { return "Team Member ".concat(i + 1); });
                    teamPromises = teamNames.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                        var committee, designation;
                        return __generator(this, function (_a) {
                            committee = ['media', 'digital', 'socialmedia', 'developer'][Math.floor(Math.random() * 4)];
                            designation = [
                                'mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer',
                                'photographer', 'videographer', 'aerialvideographer', 'socialmediahead',
                                'socialmediacohead', 'socialmediateam', 'frontenddev', 'backenddev',
                                'fullstackdev', 'digitalhead', 'digitalcohead', 'digitalteam'
                            ][Math.floor(Math.random() * 16)];
                            // Create the team member with a randomly chosen designation
                            return [2 /*return*/, prisma.team.create({
                                    data: {
                                        name: name,
                                        committee: committee,
                                        designation: designation, // This is now randomly selected from the enums
                                        image: imagePath,
                                        say: "I am proud to be a ".concat(designation, " in the ").concat(committee, " committee!"),
                                    },
                                })];
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(teamPromises)];
                case 3:
                    _a.sent();
                    console.log('Seeding completed.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
