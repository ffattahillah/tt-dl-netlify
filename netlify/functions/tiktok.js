export async function handler(event) {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return json({ error: "URL TikTok tidak boleh kosong" }, 400);
  }

  const apis = [
    {
      name: "tikwm",
      request: () =>
        fetchWithTimeout(
          `https://tikwm.com/api/?url=${encodeURIComponent(url)}`
        ),
      parse: async (res) => {
        if (res.code !== 0 || !res.data?.play) return null;
        return {
          video: res.data.play,
          audio: res.data.music,
          title: res.data.title
        };
      }
    },
    {
      name: "tikmate",
      request: () =>
        fetchWithTimeout(
          `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`
        ),
      parse: async (res) => {
        if (!res.token || !res.id) return null;
        return {
          video: `https://tikmate.app/download/${res.token}/${res.id}.mp4`
        };
      }
    },
    {
      name: "tikwm-mirror",
      request: () =>
        fetchWithTimeout(
          `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
        ),
      parse: async (res) => {
        if (res.code !== 0 || !res.data?.play) return null;
        return {
          video: res.data.play,
          audio: res.data.music,
          title: res.data.title
        };
      }
    }
  ];

  for (const api of apis) {
    try {
      const response = await api.request();
      const text = await response.text();

      if (
        text.includes("busy") ||
        text.includes("limit") ||
        text.includes("try again")
      ) {
        continue;
      }

      const jsonData = JSON.parse(text);
      const parsed = await api.parse(jsonData);

      if (parsed) {
        return json({ success: true, source: api.name, ...parsed });
      }
    } catch (e) {
      continue;
    }
  }

  return json(
    {
      error: "Semua server sedang sibuk. Coba beberapa saat lagi."
    },
    503
  );
}

/* ================= UTIL ================= */

function json(data, status = 200) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}

function fetchWithTimeout(url, ms = 6500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  return fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timeout)
  );
}
