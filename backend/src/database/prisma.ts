import 'dotenv/config' 
import { PrismaClient } from '@prisma/client/extension'
export const prisma = new PrismaClient();