/**
 * WPPAPI JS SDK — cliente mínimo para o gateway público da WPPAPI.
 * https://wpp-api.com
 *
 * Zero dependências: usa fetch nativo (browser / Node 18+).
 *
 * @example
 *   import { WppApiClient } from "wppapi-sdk";
 *
 *   const client = new WppApiClient({
 *     baseUrl: "https://api.wpp-api.com",
 *     instanceId: "sua-instancia",
 *     token: "seu-token",
 *   });
 *
 *   await client.sendText("5511999999999", "Olá! 👋");
 */
export class WppApiClient {
  /**
   * @param {object} opts
   * @param {string} opts.baseUrl - Base da API, ex.: https://api.wpp-api.com
   * @param {string} opts.instanceId - ID público da instância
   * @param {string} opts.token - Token da instância
   * @param {boolean} [opts.clientTokenHeader=false] - Envia o token no header
   *   `Client-Token` em vez da URL (recomendado em ambientes com logs de URL)
   */
  constructor({ baseUrl, instanceId, token, clientTokenHeader = false }) {
    if (!baseUrl || !instanceId || !token) {
      throw new Error("baseUrl, instanceId e token são obrigatórios");
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.instanceId = instanceId;
    this.token = token;
    this.clientTokenHeader = clientTokenHeader;
  }

  path(suffix) {
    const t = this.clientTokenHeader ? "_" : this.token;
    return `${this.baseUrl}/instances/${this.instanceId}/token/${t}${suffix}`;
  }

  headers(json = true) {
    const h = {};
    if (json) h["Content-Type"] = "application/json";
    if (this.clientTokenHeader) h["Client-Token"] = this.token;
    return h;
  }

  async request(method, suffix, body) {
    const res = await fetch(this.path(suffix), {
      method,
      headers: this.headers(body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || res.statusText);
    }
    return res.json();
  }

  /** Status da sessão (conectada, pareando, desconectada). */
  status() {
    return this.request("GET", "/status");
  }

  /** QR Code para parear o número. */
  qrCode() {
    return this.request("GET", "/qr-code");
  }

  /** Perfil do número conectado. */
  me() {
    return this.request("GET", "/me");
  }

  /** Envia mensagem de texto. */
  sendText(phone, message) {
    return this.request("POST", "/send-text", { phone, message });
  }

  /**
   * Envia imagem com legenda opcional.
   * @param {string|{url?: string, data?: string, mimetype?: string, filename?: string}} image
   *   URL da imagem, ou objeto file com `data` em base64 (sem prefixo data:)
   */
  sendImage(phone, image, caption) {
    const body =
      typeof image === "string" ? { phone, image, caption } : { phone, file: image, caption };
    return this.request("POST", "/send-image", body);
  }

  /**
   * Envia arquivo/documento.
   * @param {string|{url?: string, data?: string, mimetype?: string, filename?: string}} file
   */
  sendFile(phone, file, caption) {
    const body =
      typeof file === "string" ? { phone, document: file, caption } : { phone, file, caption };
    return this.request("POST", "/send-file", body);
  }

  /**
   * Envia áudio/voz.
   * @param {string|{url?: string, data?: string, mimetype?: string, filename?: string}} audio
   */
  sendVoice(phone, audio) {
    const body = typeof audio === "string" ? { phone, audio } : { phone, file: audio };
    return this.request("POST", "/send-voice", body);
  }

  /**
   * Envia vídeo com legenda opcional.
   * @param {string|{url?: string, data?: string, mimetype?: string, filename?: string}} video
   */
  sendVideo(phone, video, caption) {
    const body =
      typeof video === "string" ? { phone, video, caption } : { phone, file: video, caption };
    return this.request("POST", "/send-video", body);
  }

  /** Verifica se o número tem WhatsApp antes de enviar. */
  checkNumber(phone) {
    return this.request("GET", `/check-number?phone=${encodeURIComponent(phone)}`);
  }

  /** Lista os chats da instância. */
  chats(limit = 50) {
    return this.request("GET", `/chats?limit=${limit}`);
  }

  /** Lista os grupos da instância. */
  groups() {
    return this.request("GET", "/groups");
  }
}

export default WppApiClient;
