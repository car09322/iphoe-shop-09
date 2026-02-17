import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOK } from "../../../_adminAuth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!adminOK(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { status?, trackingNo? }
  const updated = await prisma.order.update({
    where: { id: Number(params.id) },
    data: {
      status: body.status,
      trackingNo: body.trackingNo ?? null,
    },
  });

  return NextResponse.json(updated);
}
