// CONFIGURAÇÃO — preencha antes de publicar
window.FUNIL = {
  AGENDA_URL: "",          // link da agenda do especialista (Calendly, Cal.com, Google Agenda...)
  WHATSAPP: "16893231376",            // só dígitos com DDI, ex.: 5511999999999
  PIXEL_ID: "",            // ID do Pixel da Meta (vazio = pixel desligado)
  CRM_WEBHOOK: "",         // URL que recebe o lead em JSON (n8n / Chatwoot via automação)
  VIDEO_SRC: "videos/vsl.mp4",           // arquivo ou URL do vídeo vertical da Mara (.mp4)
  CTA_DELAY_SEC: 45,       // segundos após o play para liberar o botão (ou ao chegar em 50% do vídeo)
  VIDEO_POSTER: "images/poster.jpg",        // imagem de capa do vídeo (opcional)
  GOOGLE_REVIEWS_URL: "https://marabrasilimoveis.com/", // link das 49 avaliações do Google
  // Pontuação: temperatura = soma dos pontos das respostas
  HOT_MIN: 17,             // >= 17 quente (máximo possível: 25)
  WARM_MIN: 10             // >= 10 morno, abaixo disso frio
};
