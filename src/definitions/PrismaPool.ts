import { PrismaClient } from "@prisma/client";

class PrismaPool {
  prismaInstance: PrismaClient;

  constructor() {
    this.prismaInstance = new PrismaClient();
  }
}

export const prismaPool = new PrismaPool().prismaInstance;
