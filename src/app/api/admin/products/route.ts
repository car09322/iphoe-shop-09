import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOK } from "../../_adminAuth";

export async function GET(req: Request) {
  if (!adminOK(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!adminOK(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const created = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category,
      imageUrl: body.imageUrl ?? null,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(created);
}
