"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.post('/register', (req, res) => (0, userController_1.registerUser)(req, res));
router.post('/login', (req, res) => (0, userController_1.loginUser)(req, res));
// Protected routes
router.get('/profile', authMiddleware_1.protect, (req, res) => (0, userController_1.getUserProfile)(req, res));
router.get('/favorites', authMiddleware_1.protect, (req, res) => (0, userController_1.getFavorites)(req, res));
router.post('/favorites', authMiddleware_1.protect, (req, res) => (0, userController_1.addToFavorites)(req, res));
router.delete('/favorites/:id', authMiddleware_1.protect, (req, res) => (0, userController_1.removeFromFavorites)(req, res));
exports.default = router;
