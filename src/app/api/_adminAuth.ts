export function adminOK(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Basic ${btoa(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)}`;
  return auth === expected;
}
