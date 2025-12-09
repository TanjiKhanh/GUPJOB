"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("./src/prisma/prisma.service");
const auth_controller_1 = require("./src/controllers/auth.controller");
const auth_service_1 = require("./src/services/auth.service");
const users_service_1 = require("./src/services/users.service");
const user_repository_1 = require("./src/repositories/user.repository");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'supersecret_dev_key',
                signOptions: { expiresIn: 3600 },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [prisma_service_1.PrismaService, auth_service_1.AuthService, users_service_1.UsersService, user_repository_1.UsersRepository],
        exports: [auth_service_1.AuthService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map