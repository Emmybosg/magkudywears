import { createClient } from "npm:@supabase/supabase-js@2";
import { editImage, IMAGE_SETTINGS } from "../_shared/image.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sha256Hex(input: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const POSE_TEXT: Record<string, string> = {
  front: "standing upright, facing the camera straight-on",
  "three-quarter": "standing at a relaxed three-quarter angle, body turned slightly to her left, her face still visible",
  side: "standing in a full side profile view, turned 90 degrees to her left",
  back: "photographed from directly behind, her back to the camera",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "Image generation is not configured yet. Please try again later." }, 500);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  try {
    const form = await req.formData();
    const garment = form.get("garment");
    const mannequin = form.get("mannequin");
    const garmentSrc = String(form.get("garmentSrc") ?? "");
    const mannequinId = String(form.get("mannequinId") ?? "");
    const pose = String(form.get("pose") ?? "");
    const garmentName = String(form.get("garmentName") ?? "the garment");
    const size = String(form.get("size") ?? "");

    if (!(garment instanceof File) || !(mannequin instanceof File) || !garmentSrc || !mannequinId || !pose) {
      return json({ error: "A garment photo, a mannequin and a pose are required." }, 400);
    }

    const cacheKey = await sha256Hex(`${garmentSrc}|${mannequinId}|${pose}`);
    const { data: cached, error: cacheError } = await admin
      .from("try_on_cache")
      .select("image_path")
      .eq("cache_key", cacheKey)
      .maybeSingle();
    if (cacheError) throw cacheError;
    if (cached?.image_path) {
      const { data } = admin.storage.from("product-images").getPublicUrl(cached.image_path);
      return json({ url: data.publicUrl, cached: true });
    }

    const instruction = [
      "Image 1 is a full-body female retail mannequin. Image 2 is a garment product photo.",
      `Create a photorealistic studio e-commerce photograph of that mannequin wearing this exact garment: ${garmentName}${size ? ` (size ${size})` : ""}.`,
      `She is ${POSE_TEXT[pose] ?? POSE_TEXT.front}.`,
      "Keep the mannequin's exact face, skin tone, body shape and proportions from image 1, and reproduce the garment's exact fabric, colour, pattern, cut, neckline, sleeves and length from image 2, fitted naturally on her body.",
      "Full-body shot, centred, plain warm cream studio backdrop, soft even professional lighting, sharp focus, no text and no watermark.",
    ].join(" ");

    const gwForm = new FormData();
    gwForm.append("prompt", instruction);
    gwForm.append("image[]", mannequin, "mannequin.png");
    gwForm.append("image[]", garment, "garment.png");
    gwForm.append("stream", "false");

    const upstream = await editImage({ ...IMAGE_SETTINGS, apiKey }, gwForm);
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      let message = text || `Image generation failed (${upstream.status}).`;
      try {
        const parsed = JSON.parse(text);
        message = parsed?.error?.message ?? parsed?.message ?? message;
      } catch {
        // keep raw text
      }
      return json({ error: message }, upstream.status);
    }

    const payload = await upstream.json();
    const b64 = payload?.data?.[0]?.b64_json;
    if (!b64) return json({ error: "The model did not return an image. Please try again." }, 502);

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `try-on/${cacheKey}.png`;
    const { error: uploadError } = await admin.storage
      .from("product-images")
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (uploadError) throw uploadError;

    const { data } = admin.storage.from("product-images").getPublicUrl(path);
    const { error: insertError } = await admin.from("try_on_cache").insert({
      cache_key: cacheKey,
      garment_source: garmentSrc,
      mannequin_id: mannequinId,
      pose,
      image_path: path,
    });
    if (insertError) throw insertError;

    return json({ url: data.publicUrl, cached: false });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error generating the try-on." }, 500);
  }
});
