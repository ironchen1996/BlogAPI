import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // return data;
        return plainToInstance(this.dto, data, {
          //設置爲true之後，所有經過該interceptor的接口都需要設置Expose或Exclude
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
