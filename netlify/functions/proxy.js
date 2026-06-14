// netlify/functions/proxy.js  — 쓰기 앱 전용 (GAS 주소 1개)
const GAS_URL = "https://script.google.com/macros/s/AKfycby1KlSe_6WRLInRoD0MgCLyjfSVMdikgGvcOCc9EUu3-Dh3Ju6XiBvI9oftwhpI3ZfG/exec";

exports.handler = async (event) => {
  try {
    const qs = event.rawQuery ? "?" + event.rawQuery : "";
    const target = GAS_URL + qs;
    const init = { method: event.httpMethod || "GET", redirect: "follow" };
    if ((event.httpMethod || "GET").toUpperCase() === "POST") {
      const raw = event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString("utf-8")
        : (event.body || "");
      init.headers = { "Content-Type": "text/plain;charset=utf-8" };
      init.body = raw;
    }
    const res = await fetch(target, init);
    const body = await res.text();
    const ct = res.headers.get("content-type") || "application/json; charset=utf-8";
    return { statusCode: 200,
      headers: { "Content-Type": ct, "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
      body };
  } catch (e) {
    return { statusCode: 502, headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "proxy error: " + (e && e.message ? e.message : String(e)) };
  }
};
