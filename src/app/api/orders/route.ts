import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body = { customer: {name, phone, email?, address}, items: [{productId, qty}] }

    const productIds = body.items.map((i: any) => Number(i.productId));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    let total = 0;
    const itemsData = body.items.map((i: any) => {
      const p = products.find((x) => x.id === Number(i.productId));
      if (!p) throw new Error("Product not found");
      const qty = Number(i.qty);
      if (qty <= 0) throw new Error("Invalid qty");
      if (p.stock < qty) throw new Error(`Stock not enough: ${p.name}`);
      total += p.price * qty;
      return { productId: p.id, qty, price: p.price };
    });

    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: body.customer.name,
          phone: body.customer.phone,
          email: body.customer.email ?? null,
          address: body.customer.address,
        },
      });

      const created = await tx.order.create({
        data: {
          customerId: customer.id,
          total,
          status: "PENDING",
          items: { create: itemsData },
        },
        include: { items: true, customer: true },
      });

      // decrement stock
      for (const it of itemsData) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.qty } },
        });
      }

      return created;
    });

    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Error" }, { status: 400 });
  }
}
