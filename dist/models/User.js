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
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const passwordUtils_1 = require("../utils/passwordUtils");
class UserModel {
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, first_name, last_name } = userData;
            const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
            const query = `
        INSERT INTO users (username, email , password, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, first_name, last_name, created_at, updated_at
        `;
            const values = [username, email, hashedPassword, first_name, last_name];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE email = $1";
            const result = yield database_1.default.query(query, [email]);
            return result.rows[0] || null;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT id, username, email, first_name, last_name, created_at, updated_at
        FROM users
        WHERE id = $1
        `;
            const result = yield database_1.default.query(query, [id]);
            return result.rows[0] || null;
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE username = $1";
            const result = yield database_1.default.query(query, [username]);
            return result.rows[0] || null;
        });
    }
    static update(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(userData)
                .filter((key) => key !== "id" && key !== "password")
                .map((key, index) => `${key} = $${index + 2}`)
                .join(", ");
            if (!fields)
                return null;
            const values = Object.values(userData).filter((val, index) => Object.keys(userData)[index] !== "id" &&
                Object.keys(userData)[index] !== "password");
            const query = `
      UPDATE users
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email, first_name, last_name, created_at, updated_at
    `;
            const result = yield database_1.default.query(query, [id, ...values]);
            return result.rows[0] || null;
        });
    }
    static updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
            const query = `
        UPDATE users
      SET password = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `;
            const result = yield database_1.default.query(query, [id, hashedPassword]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
}
exports.UserModel = UserModel;
