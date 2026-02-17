import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { name: "เคส iPhone ใส กันกระแทก", description: "ขอบหนา กันมุม ตกไม่แตกง่าย", category: "เคส", price: 199, stock: 80 },
  { name: "เคส iPhone แบบ MagSafe", description: "ดูดแม่เหล็กแน่น รองรับชาร์จไร้สาย", category: "เคส", price: 390, stock: 60 },
  { name: "ฟิล์มกันรอย กระจก 9H (iPhone)", description: "กระจกเต็มจอ 9H ทัชลื่น", category: "ฟิล์มกันรอย", price: 129, stock: 120 },
  { name: "ฟิล์มกันรอย (Android) แบบใส", description: "บางใส ติดง่าย", category: "ฟิล์มกันรอย", price: 99, stock: 100 },
  { name: "สายชาร์จ Type-C to Type-C 60W", description: "ชาร์จเร็ว PD 60W สายถักทน", category: "สายชาร์จ", price: 189, stock: 90 },
  { name: "สายชาร์จ Lightning 2m", description: "ชาร์จเร็ว รองรับ iPhone/iPad", category: "สายชาร์จ", price: 199, stock: 70 },
  { name: "อะแดปเตอร์ชาร์จเร็ว 20W (PD)", description: "หัวชาร์จเร็ว ขนาดพกพา", category: "อะแดปเตอร์", price: 290, stock: 55 },
  { name: "พาวเวอร์แบงค์ 10,000mAh PD", description: "ชาร์จเร็ว พกง่าย มีไฟแสดงผล", category: "พาวเวอร์แบงค์", price: 690, stock: 40 },
  { name: "หูฟัง Bluetooth TWS", description: "เสียงชัด เบสแน่น ใช้งานได้ทั้งวัน", category: "หูฟัง", price: 590, stock: 45 },
  { name: "ขาตั้งมือถือพับได้", description: "วางแนวนอน/ตั้งได้ ปรับระดับ", category: "อุปกรณ์เสริม", price: 149, stock: 85 },
];

async function main() {
  // clear
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: products });
  console.log("Seeded products:", products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
