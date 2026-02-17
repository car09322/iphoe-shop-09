import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOK } from "../../_adminAuth";

export async function GET(req: Request) {
  if (!adminOK(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: { include: { product: true } } },
  });

  return NextResponse.json(orders);
}
