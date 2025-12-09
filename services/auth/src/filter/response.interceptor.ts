import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Wraps successful responses in a consistent envelope:
 * { success: true, data: ... }
 *
 * If the controller returns undefined (e.g., 204/no content), we pass through.
 * Avoids double-wrapping if data already in the envelope.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If controller intentionally returns nothing (void), pass through
        if (data === undefined) return data;

        // If already wrapped, return as-is
        if (data && typeof data === 'object' && ('success' in data) && ('data' in data)) {
          return data;
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}