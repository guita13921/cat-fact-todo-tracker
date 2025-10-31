import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Thin wrapper around Passport's JWT guard so we can apply it with
// `@UseGuards(JwtAuthGuard)` in controllers.
export class JwtAuthGuard extends AuthGuard('jwt') {}
