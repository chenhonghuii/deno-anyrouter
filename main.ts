import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TARGET = "https://anyrouter.top"; // 目标地址

serve(async (req) => {
  const url = new URL(req.url);
  const targetUrl = new URL(TARGET + url.pathname + url.search);

  const headers = new Headers(req.headers);
  headers.set("Host", targetUrl.hostname); // 伪装 Host

  const newReq = new Request(targetUrl.toString(), {
    method: req.method,
    headers: headers,
    body: req.body,
    redirect: "follow",
  });

  try {
    const response = await fetch(newReq);
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
