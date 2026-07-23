# WPPAPI — SDK JavaScript

SDK oficial da [WPPAPI](https://wpp-api.com?utm_source=github&utm_medium=sdk) — API WhatsApp multi-tenant, gerenciada e dev-friendly. Envie e receba mensagens de WhatsApp via REST, com webhooks assinados (HMAC), integração nativa com Chatwoot e painel self-service.

- **Zero dependências** — usa `fetch` nativo (browser e Node 18+)
- **Trial de 3 dias grátis, sem cartão** → [criar conta](https://app.wpp-api.com/register?utm_source=github&utm_medium=sdk)
- Base da API: `https://api.wpp-api.com`

## Instalação

```bash
npm install wppapi-sdk
```

Ou copie o `index.js` — é um arquivo único, sem dependências.

## Uso

```js
import { WppApiClient } from "wppapi-sdk";

const client = new WppApiClient({
  baseUrl: "https://api.wpp-api.com",
  instanceId: "sua-instancia",
  token: "seu-token",
});

// Texto
await client.sendText("5511999999999", "Olá! 👋");

// Imagem por URL, com legenda
await client.sendImage("5511999999999", "https://exemplo.com/foto.jpg", "Olha isso");

// Documento em base64
await client.sendFile("5511999999999", {
  data: "<base64 sem prefixo data:>",
  mimetype: "application/pdf",
  filename: "proposta.pdf",
});

// Validar número antes de enviar
const { exists } = await client.checkNumber("5511999999999");

// Sessão
await client.status();   // conectada? pareando?
await client.qrCode();   // QR para parear
await client.me();       // perfil conectado
```

### Token no header (em vez da URL)

Para ambientes onde URLs vão para logs, envie o token via header `Client-Token`:

```js
const client = new WppApiClient({
  baseUrl: "https://api.wpp-api.com",
  instanceId: "sua-instancia",
  token: "seu-token",
  clientTokenHeader: true,
});
```

## Métodos

| Método | Endpoint |
|--------|----------|
| `status()` | `GET /status` |
| `qrCode()` | `GET /qr-code` |
| `me()` | `GET /me` |
| `sendText(phone, message)` | `POST /send-text` |
| `sendImage(phone, image, caption?)` | `POST /send-image` |
| `sendFile(phone, file, caption?)` | `POST /send-file` |
| `sendVoice(phone, audio)` | `POST /send-voice` |
| `sendVideo(phone, video, caption?)` | `POST /send-video` |
| `checkNumber(phone)` | `GET /check-number` |
| `chats(limit?)` | `GET /chats` |
| `groups()` | `GET /groups` |

A API completa (location, contact, reply, reaction, typing, seen, sticker, poll, list, status/stories, edit, pin) está documentada em [wpp-api.com/docs](https://wpp-api.com/docs?utm_source=github&utm_medium=sdk) e no Swagger do painel.

## Recebendo mensagens (webhooks)

Cadastre uma URL de webhook no painel e receba eventos assinados com HMAC-SHA256 (`X-WPPAPI-Signature`). Exemplo completo de receptor em Node.js com validação de assinatura: [guia de webhooks](https://wpp-api.com/guias/webhooks-whatsapp-nodejs?utm_source=github&utm_medium=sdk).

```js
// Payload de mensagem recebida
{
  "event": "received",
  "instanceId": "sua-instancia",
  "timestamp": "2026-07-23T15:00:00.000Z",
  "data": { "from": "5511999999999", "body": "oi", "type": "chat", "fromMe": false }
}
```

## Guias

- [WhatsApp no n8n](https://wpp-api.com/guias/whatsapp-n8n?utm_source=github&utm_medium=sdk)
- [Chatwoot + WhatsApp (integração nativa)](https://wpp-api.com/guias/whatsapp-chatwoot?utm_source=github&utm_medium=sdk)
- [Webhooks com HMAC em Node.js](https://wpp-api.com/guias/webhooks-whatsapp-nodejs?utm_source=github&utm_medium=sdk)

## Licença

[MIT](./LICENSE) © IPRoute Tecnologia
