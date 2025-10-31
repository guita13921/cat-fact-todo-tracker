import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string) {
    // Prevent duplicate accounts by checking the unique email constraint first.
    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) {
      throw new BadRequestException("Email already registered");
    }

    // Hash the password before storing it in the database. Never persist the
    // raw password value.
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    // bcrypt.compare throws if hashes are malformed, so we let Nest handle the
    // error and simply treat non-matching hashes as invalid credentials.
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    // Following JWT best practices: include the user id in `sub` for downstream
    // services and keep the payload minimal.
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || "dev_secret",
      expiresIn: "7d",
    });
    return { access_token };
  }
}
