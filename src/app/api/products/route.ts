import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Public list (เฉพาะสินค้าเปิดขาย)
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}
