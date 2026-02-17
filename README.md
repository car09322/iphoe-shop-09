# CommerceFlow – ร้านอุปกรณ์มือถือ (Web + Admin + Dashboard)

## วิธีรัน (ครั้งแรก)
1) ติดตั้งแพ็กเกจ
```bash
npm install
```

2) สร้างไฟล์ `.env` จาก `.env.example`
```bash
cp .env.example .env
```

3) สร้างฐานข้อมูล (SQLite) + ตาราง
```bash
npm run db:migrate
```

4) ใส่ข้อมูลสินค้าเริ่มต้น (seed)
```bash
npm run db:seed
```

5) รันเว็บ
```bash
npm run dev
```

- หน้าร้าน: http://localhost:3000
- หลังบ้าน: http://localhost:3000/admin

## หมายเหตุ
- Admin ใช้ Basic Auth แบบง่าย: ใส่ค่า ADMIN_USER/ADMIN_PASS ในไฟล์ .env
- ถ้าต้องการเพิ่มรูปสินค้า ให้ใส่ `imageUrl` ได้ (ตอนนี้ UI ไม่แสดงรูป เพื่อความเรียบง่าย)
