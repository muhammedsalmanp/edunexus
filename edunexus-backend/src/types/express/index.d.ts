// src/types/express/index.d.ts
import { BaseUserEntity } from "../../domain/entities/UserEntity";

declare global {
  namespace Express {
    interface Request {
      user?: BaseUserEntity;
    }
  }
}

export {};
