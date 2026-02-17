import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOK } from "../../_adminAuth";

export async function GET(req: Request) {
  if (!adminOK(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const totalSales = await prisma.order.aggregate({ _sum: { total: true } });
  const orderCount = await prisma.order.count();

  const byStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: topProducts.map((t) => t.productId) } },
    select: { id: true, name: true },
  });

  const top = topProducts.map((t) => ({
    productId: t.productId,
    name: products.find((p) => p.id === t.productId)?.name ?? "Unknown",
    qty: t._sum.qty ?? 0,
  }));

  return NextResponse.json({
    totalSales: totalSales._sum.total ?? 0,
    orderCount,
    byStatus,
    topProducts: top,
  });
}
