import { supabase } from "@/integrations/supabase/client";

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate`;

type Msg = { role: "user" | "assistant"; content: string };

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Please log in to use AI tools");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  let headers: Record<string, string>;
  try {
    headers = await getAuthHeaders();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Auth error");
    return;
  }

  const resp = await fetch(AI_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "chat", messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    onError(err.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) onDelta(text);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

export async function generateContent(
  type: string,
  prompt: string,
  options?: Record<string, string>
): Promise<{ result?: string; images?: string[]; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    const resp = await fetch(AI_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ type, prompt, options }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      console.error("IMAGE API ERROR PAYLOAD:", err);
      const message = err?.error?.message || err?.error || `Error ${resp.status}`;
      return { error: message };
    }

    const data = await resp.json();
    return { result: data.result, images: data.images };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
