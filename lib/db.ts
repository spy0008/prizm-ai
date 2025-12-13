import { PrismaClient } from "./generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg"


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
})

const prismaClientSingleton = () =>{
    return new PrismaClient({adapter})
}  

declare const globleThis: {
    prismaGloble: ReturnType<typeof prismaClientSingleton>
} & typeof global;


const prisma = globleThis.prismaGloble || prismaClientSingleton();

if (process.env.NODE_ENV !== "production"){
    globleThis.prismaGloble = prisma;
}

export default prisma;

