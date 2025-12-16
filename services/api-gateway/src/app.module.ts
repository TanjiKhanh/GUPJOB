import { MiddlewareConsumer, Module, NestModule, RequestMethod, Logger } from '@nestjs/common';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AdminRoleMiddleware } from './common/middlewares/role.middleware';
import { createServiceProxy } from './utils/proxy.util';

@Module({
  // Providers ensure NestJS creates these as managed singletons
  providers: [AuthMiddleware, AdminRoleMiddleware],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger('APIGateway');

  configure(consumer: MiddlewareConsumer) {
    const adminTarget = process.env.ADMIN_SERVICE_URL || 'http://localhost:4100';
    const userTarget = process.env.USER_SERVICE_URL || 'http://localhost:4000';
    const authTarget = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

    // ---------------------------------------------------------
    // 1. ADMIN ROUTES (The Secure Chain)
    // ---------------------------------------------------------
    consumer
      .apply(
        // 1. Log the Request
        (req, res, next) => {
           this.logger.log(`🛡️ Admin Request: ${req.method} ${req.originalUrl}`);
           next();
        },
        // 2. Auth Middleware (Passed as CLASS, not function/adapter)
        AuthMiddleware, 
        // 3. Role Middleware (Passed as CLASS)
        AdminRoleMiddleware,
        // 4. Proxy
        createServiceProxy(adminTarget, { '^/admin': '/admin' })
      )
      .forRoutes({ path: 'admin/(.*)', method: RequestMethod.ALL });



    // ---------------------------------------------------------
    // 2. USER ROUTES
    // ---------------------------------------------------------
    consumer
      .apply(
        AuthMiddleware, 
        createServiceProxy(userTarget, { '^/api/roadmap': '/roadmap' })
      )
      .forRoutes({ path: 'api/roadmap/(.*)', method: RequestMethod.ALL });


    // ---------------------------------------------------------
    // 3. AUTH ROUTES (Public)
    // ---------------------------------------------------------
    consumer
      .apply(
        createServiceProxy(authTarget, { '^/auth': '/auth' })
      )
      .forRoutes({ path: 'auth/(.*)', method: RequestMethod.ALL });
  }
}