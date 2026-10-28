// Shared image-edit helper for Lovable AI Gateway calls (server-side only).
// Request format "openai": multipart FormData POST to /v1/images/edits.

export type ImageConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
  format: "openai";
};

// Resolved defaults from the workspace model knowledge (do not hardcode elsewhere).
export const IMAGE_SETTINGS: Omit<ImageConfig, "apiKey"> = {
  baseURL: "https://ai.gateway.lovable.dev",
  model: "openai/gpt-image-2.5-sunburst",
  format: "openai",
};

export async function editImage(config: ImageConfig, form: FormData, signal?: AbortSignal) {
  form.set("model", config.model);
  if (form.get("stream") === "false") {
    form.delete("stream");
  } else {
    form.set("stream", "true");
    if (!form.has("partial_images")) form.set("partial_images", "1");
  }
  return fetch(`${config.baseURL}/v1/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}` },
    body: form,
    signal: signal ?? null,
  });
}
