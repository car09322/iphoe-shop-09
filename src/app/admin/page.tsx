"use client";
import { useEffect, useMemo, useState } from "react";

function basicAuthHeader(user: string, pass: string) {
  return `Basic ${btoa(`${user}:${pass}`)}`;
}

type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
};

export default function AdminPage() {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("1234");
  const [auth, setAuth] = useState<string>("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [dash, setDash] = useState<any>(null);
  const [tab, setTab] = useState<"dashboard"|"products"|"orders">("dashboard");

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "เคส",
    price: 199,
    stock: 20,
    isActive: true,
    imageUrl: ""
  });

  async function loadAll(a = auth) {
    if (!a) return;
    const headers = { authorization: a };
    const [p, o, d] = await Promise.all([
      fetch("/api/admin/products", { headers }).then(r => r.json()),
      fetch("/api/admin/orders", { headers }).then(r => r.json()),
      fetch("/api/admin/dashboard", { headers }).then(r => r.json()),
    ]);
    setProducts(p);
    setOrders(o);
    setDash(d);
  }

  function login() {
    const a = basicAuthHeader(user, pass);
    setAuth(a);
    loadAll(a);
  }

  async function createProduct() {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { authorization: auth },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("เพิ่มสินค้าไม่สำเร็จ (เช็ค user/pass ใน .env)");
      return;
    }
    setForm({ ...form, name: "", description: "" });
    await loadAll(auth);
    setTab("products");
  }

  async function updateOrder(id: number, patch: any) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { authorization: auth },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      alert("อัปเดตออเดอร์ไม่สำเร็จ");
      return;
    }
    await loadAll(auth);
  }

  const totalToday = useMemo(() => {
    if (!Array.isArray(orders)) return 0;
    const today = new Date();
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    return orders
      .filter(o => {
        const t = new Date(o.createdAt);
        return t.getFullYear()===y && t.getMonth()===m && t.getDate()===d;
      })
      .reduce((s, o) => s + (o.total ?? 0), 0);
  }, [orders]);

  return (
    <main style={{ maxWidth: 1150, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin – CommerceFlow</h1>
          <div style={{ opacity: 0.8 }}>หลังบ้านร้านอุปกรณ์มือถือ + Dashboard</div>
        </div>
        <a href="/" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 10 }}>กลับหน้าร้าน</a>
      </header>

      <section style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="ADMIN_USER" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder="ADMIN_PASS" type="password" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        <button onClick={login} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}>
          เข้าสู่ระบบแอดมิน
        </button>
        {auth && <span style={{ opacity: 0.8 }}>✅ ล็อกอินแล้ว</span>}
      </section>

      <nav style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["dashboard","products","orders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid #ddd",
              background: tab===t ? "#f5f5f5" : "white",
              cursor: "pointer"
            }}>
            {t === "dashboard" ? "Dashboard" : t === "products" ? "สินค้า" : "ออเดอร์"}
          </button>
        ))}
      </nav>

      {!auth ? (
        <p style={{ marginTop: 18, opacity: 0.85 }}>
          ใส่ <b>ADMIN_USER / ADMIN_PASS</b> ให้ตรงกับไฟล์ <b>.env</b> แล้วกด “เข้าสู่ระบบแอดมิน”
        </p>
      ) : (
        <>
          {tab === "dashboard" && dash && (
            <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 14 }}>
              <h2 style={{ marginTop: 0 }}>Dashboard</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                <Card title="ยอดขายรวม" value={`${dash.totalSales} บาท`} />
                <Card title="จำนวนออเดอร์ทั้งหมด" value={`${dash.orderCount}`} />
                <Card title="ยอดขายวันนี้" value={`${totalToday} บาท`} />
                <Card title="สินค้าในระบบ" value={`${products.length}`} />
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
                <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                  <b>ออเดอร์ตามสถานะ</b>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0, marginTop: 8 }}>{JSON.stringify(dash.byStatus, null, 2)}</pre>
                </div>
                <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                  <b>สินค้าขายดี Top 5</b>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0, marginTop: 8 }}>{JSON.stringify(dash.topProducts, null, 2)}</pre>
                </div>
              </div>
            </section>
          )}

          {tab === "products" && (
            <section style={{ marginTop: 16 }}>
              <h2 style={{ marginTop: 0 }}>สินค้า</h2>

              <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 14 }}>
                <b>เพิ่มสินค้าใหม่</b>
                <div style={{ display: "grid", gap: 8, maxWidth: 650, marginTop: 10 }}>
                  <input placeholder="ชื่อสินค้า" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp}/>
                  <input placeholder="คำอธิบายสั้น ๆ" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp}/>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp, flex: "1 1 180px" }}>
                      {["เคส","ฟิล์มกันรอย","สายชาร์จ","หูฟัง","พาวเวอร์แบงค์","อะแดปเตอร์","อุปกรณ์เสริม"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder="ราคา" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} style={{ ...inp, flex: "1 1 120px" }}/>
                    <input type="number" placeholder="สต็อก" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} style={{ ...inp, flex: "1 1 120px" }}/>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                    เปิดขาย (Active)
                  </label>
                  <button onClick={createProduct} disabled={!form.name} style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}>
                    บันทึกสินค้า
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                {products.map(p => (
                  <div key={p.id} style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{p.name}</div>
                        <div style={{ opacity: 0.8, fontSize: 13 }}>{p.description ?? ""}</div>
                        <div style={{ marginTop: 6 }}>
                          หมวด: <b>{p.category}</b> | ราคา: <b>{p.price}</b> บาท | stock: <b>{p.stock}</b>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #ddd" }}>
                          {p.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "orders" && (
            <section style={{ marginTop: 16 }}>
              <h2 style={{ marginTop: 0 }}>ออเดอร์</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>Order #{o.id} — รวม {o.total} บาท</div>
                        <div style={{ opacity: 0.85 }}>สถานะ: <b>{o.status}</b> | {new Date(o.createdAt).toLocaleString("th-TH")}</div>
                        <div style={{ marginTop: 6 }}>ลูกค้า: <b>{o.customer?.name}</b> ({o.customer?.phone})</div>
                        <div style={{ opacity: 0.85 }}>ที่อยู่: {o.customer?.address}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <select value={o.status} onChange={e => updateOrder(o.id, { status: e.target.value })} style={{ ...inp, width: 180 }}>
                          {["PENDING","PAID","PACKING","SHIPPED","COMPLETED","CANCELED"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input
                          placeholder="เลขพัสดุ (ถ้ามี)"
                          defaultValue={o.trackingNo ?? ""}
                          onBlur={e => updateOrder(o.id, { trackingNo: e.target.value || null })}
                          style={{ ...inp, width: 220 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <b>รายการสินค้า</b>
                      <ul style={{ marginTop: 6 }}>
                        {o.items?.map((it: any) => (
                          <li key={it.id}>
                            {it.product?.name} — {it.qty} ชิ้น @ {it.price} บาท
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
      <div style={{ opacity: 0.8, fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{value}</div>
    </div>
  );
}

const inp: React.CSSProperties = { padding: 10, borderRadius: 10, border: "1px solid #ddd" };
