  "use client";
  import { useEffect, useMemo, useState } from "react";

  type Product = {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string | null;
  };

  const categories = ["ทั้งหมด", "เคส", "ฟิล์มกันรอย", "สายชาร์จ", "หูฟัง", "พาวเวอร์แบงค์", "อะแดปเตอร์", "อุปกรณ์เสริม"];

  export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Record<number, number>>({});
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("ทั้งหมด");

    useEffect(() => {
      fetch("/api/products").then(r => r.json()).then(setProducts);
    }, []);

    const filtered = useMemo(() => {
      const term = q.trim().toLowerCase();
      return products.filter(p => {
        const okCat = cat === "ทั้งหมด" ? true : p.category === cat;
        const okQ = !term ? true : (p.name.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term));
        return okCat && okQ;
      });
    }, [products, q, cat]);

    const cartItems = useMemo(() => {
      return Object.entries(cart)
        .map(([id, qty]) => ({ product: products.find(p => p.id === Number(id)), qty }))
        .filter(x => x.product);
    }, [cart, products]);

    const total = cartItems.reduce((s, x) => s + (x.product!.price * x.qty), 0);

    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0 }}>CommerceFlow</h1>
            <div style={{ opacity: 0.8 }}>ร้านอุปกรณ์มือถือ (ตัวอย่างเว็บใช้งานได้จริง)</div>
          </div>
          <a href="/admin" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 10 }}>เข้าแอดมิน</a>
        </header>

        <section style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="ค้นหา เช่น เคส iPhone, สายชาร์จ..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{ flex: "1 1 260px", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <select value={cat} onChange={e => setCat(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ margin: "12px 0" }}>สินค้า</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 12 }}>
                {p.imageUrl ? (
  <img
    src={p.imageUrl}
    alt={p.name}
    style={{
      width: "100%",
      height: 180,
      objectFit: "cover",
      borderRadius: 10,
      border: "1px solid #eee",
      marginBottom: 10,
    }}
  />
) : (
  <div
    style={{
      width: "100%",
      height: 180,
      borderRadius: 10,
      border: "1px dashed #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      opacity: 0.6,
    }}
  >
    ไม่มีรูป
  </div>
)}
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4, minHeight: 34 }}>{p.description ?? ""}</div>
                <div style={{ marginTop: 6 }}>หมวด: <b>{p.category}</b></div>
                <div style={{ marginTop: 4 }}>ราคา: <b>{p.price}</b> บาท</div>
                <div style={{ marginTop: 4 }}>คงเหลือ: <b>{p.stock}</b></div>
                <button
                  style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer" }}
                  disabled={p.stock <= 0}
                  onClick={() => setCart(prev => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + 1 }))}
                >
                  ใส่ตะกร้า
                </button>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ margin: "26px 0" }} />

        <section>
          <h2 style={{ margin: "12px 0" }}>ตะกร้าสินค้า</h2>
          {cartItems.length === 0 ? (
            <p style={{ opacity: 0.8 }}>ยังไม่มีสินค้าในตะกร้า</p>
          ) : (
            <>
              {cartItems.map(x => (
                <div key={x.product!.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8, border: "1px solid #eee", padding: 10, borderRadius: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{x.product!.name}</div>
                    <div style={{ opacity: 0.8, fontSize: 13 }}>{x.product!.price} บาท/ชิ้น</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setCart(prev => {
                      const next = { ...prev };
                      next[x.product!.id] = Math.max(0, (next[x.product!.id] ?? 0) - 1);
                      if (next[x.product!.id] === 0) delete next[x.product!.id];
                      return next;
                    })} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #ddd" }}>-</button>
                    <div style={{ width: 24, textAlign: "center" }}>{x.qty}</div>
                    <button onClick={() => setCart(prev => ({ ...prev, [x.product!.id]: (prev[x.product!.id] ?? 0) + 1 }))} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #ddd" }}>+</button>
                  </div>
                  <div style={{ width: 120, textAlign: "right", fontWeight: 700 }}>
                    {x.product!.price * x.qty} บาท
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 18 }}>รวมทั้งสิ้น</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{total} บาท</div>
              </div>

              <Checkout cartItems={cartItems} onDone={() => setCart({})} />
            </>
          )}
        </section>

        <footer style={{ marginTop: 30, padding: "18px 0", borderTop: "1px solid #eee", opacity: 0.85 }}>
          <div>© {new Date().getFullYear()} CommerceFlow (Demo)</div>
          <div style={{ fontSize: 12 }}>หมายเหตุ: เป็นเว็บตัวอย่างสำหรับส่งชิ้นงาน (หน้าร้าน + หลังบ้าน + Dashboard)</div>
        </footer>
      </main>
    );
  }

  function Checkout({ cartItems, onDone }: any) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [result, setResult] = useState<any>(null);
    const [busy, setBusy] = useState(false);

    async function submit() {
      setBusy(true);
      setResult(null);
      try {
        const payload = {
          customer: { name, phone, email: email || null, address },
          items: cartItems.map((x: any) => ({ productId: x.product.id, qty: x.qty })),
        };
        const res = await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
        const data = await res.json();
        setResult({ ok: res.ok, data });
        if (res.ok) onDone();
      } finally {
        setBusy(false);
      }
    }

    return (
      <div style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 14 }}>
        <h3 style={{ marginTop: 0 }}>ข้อมูลจัดส่ง</h3>
        <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
          <input placeholder="ชื่อ-นามสกุล" value={name} onChange={e => setName(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          <input placeholder="เบอร์โทร" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          <input placeholder="อีเมล (ถ้ามี)" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          <textarea placeholder="ที่อยู่จัดส่ง" value={address} onChange={e => setAddress(e.target.value)} rows={3} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          <button onClick={submit} disabled={busy || !name || !phone || !address} style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}>
            {busy ? "กำลังบันทึกออเดอร์..." : "ยืนยันสั่งซื้อ"}
          </button>
        </div>

        {result && (
          <pre style={{ marginTop: 12, whiteSpace: "pre-wrap", background: "#fafafa", padding: 12, borderRadius: 12, border: "1px solid #eee" }}>
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    );
  }
