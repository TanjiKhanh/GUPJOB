"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Auth service running on: http://localhost:${port}`);
}
bootstrap().catch(err => {
    console.error('Failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map