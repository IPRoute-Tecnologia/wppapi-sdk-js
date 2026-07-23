export interface WppApiClientOptions {
  /** Base da API, ex.: https://api.wpp-api.com */
  baseUrl: string;
  /** ID público da instância */
  instanceId: string;
  /** Token da instância */
  token: string;
  /** Envia o token no header `Client-Token` em vez da URL */
  clientTokenHeader?: boolean;
}

export interface MediaFile {
  /** URL pública do arquivo */
  url?: string;
  /** Conteúdo em base64 (sem prefixo data:) */
  data?: string;
  mimetype?: string;
  filename?: string;
}

export type MediaInput = string | MediaFile;

export declare class WppApiClient {
  constructor(options: WppApiClientOptions);

  /** Status da sessão (conectada, pareando, desconectada). */
  status(): Promise<Record<string, unknown>>;

  /** QR Code para parear o número. */
  qrCode(): Promise<Record<string, unknown>>;

  /** Perfil do número conectado. */
  me(): Promise<Record<string, unknown>>;

  /** Envia mensagem de texto. */
  sendText(phone: string, message: string): Promise<Record<string, unknown>>;

  /** Envia imagem com legenda opcional. */
  sendImage(phone: string, image: MediaInput, caption?: string): Promise<Record<string, unknown>>;

  /** Envia arquivo/documento. */
  sendFile(phone: string, file: MediaInput, caption?: string): Promise<Record<string, unknown>>;

  /** Envia áudio/voz. */
  sendVoice(phone: string, audio: MediaInput): Promise<Record<string, unknown>>;

  /** Envia vídeo com legenda opcional. */
  sendVideo(phone: string, video: MediaInput, caption?: string): Promise<Record<string, unknown>>;

  /** Verifica se o número tem WhatsApp antes de enviar. */
  checkNumber(phone: string): Promise<Record<string, unknown>>;

  /** Lista os chats da instância. */
  chats(limit?: number): Promise<Record<string, unknown>[]>;

  /** Lista os grupos da instância. */
  groups(): Promise<Record<string, unknown>[]>;
}

export default WppApiClient;
