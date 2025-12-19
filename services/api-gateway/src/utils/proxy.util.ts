import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { RequestHandler } from '@nestjs/common/interfaces';

/**
 * Creates a standard proxy middleware for downstream microservices.
 * * @param target - The URL of the microservice (e.g., "http://localhost:4100")
 * @param pathRewrite - Optional object to map paths (e.g., { '^/admin': '' })
 * @returns The proxy middleware function
 */
export const createServiceProxy = (
  target: string, 
  pathRewrite?: { [key: string]: string }
): RequestHandler => {
  const proxyOptions: Options = {
    target,
    changeOrigin: true, // Needed for virtual hosted sites
    secure: false,      // Set to true if you are using valid SSL certs in production
    logLevel: 'debug',  // Helps see what's happening in the terminal
  };

  if (pathRewrite) {
    proxyOptions.pathRewrite = pathRewrite;
  }

  // Cast as any because http-proxy-middleware types can conflict with NestJS types slightly
  return createProxyMiddleware(proxyOptions) as any;
};