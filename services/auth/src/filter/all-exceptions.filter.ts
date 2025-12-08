import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Global exception filter that converts any thrown error into a consistent JSON response.
 * This runs after more specific filters (e.g. Prisma filter) if they don't match.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (response && (response as any).message) {
        // response could be { message: string | string[] }
        message = (response as any).message;
      } else if ((response as any).error) {
        message = (response as any).error;
      } else {
        message = JSON.stringify(response);
      }
    } else if (exception && exception.message) {
      // Non-HttpException with message
      message = exception.message;
    }

    // Log error with stack for debugging/observability
    this.logger.error(
      `${req.method} ${req.url} -> ${status} - ${Array.isArray(message) ? message.join(', ') : message}`,
      exception?.stack,
    );

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }
}