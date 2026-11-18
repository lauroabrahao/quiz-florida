# Quiz de perfil: Realize International Realty

Quiz de 8 perguntas (objetivo, valor do imóvel, entrada, pagamento, visto, renda, experiência nos EUA e prazo) mais contato, que classifica o lead (quente, morno ou frio), manda o lead para o CRM (quando `CRM_WEBHOOK` estiver configurado) e abre o WhatsApp com as respostas.

Endereço: https://quiz.realizehome.com.br (GitHub Pages deste repositório; o domínio é o arquivo `CNAME`).

Decisões que seguem as da página principal (repositório `funil-florida`):
- Oferta: "consultoria estratégica sem custos". Não usar "gratuita".
- WhatsApp único: o número em `js/config.js` (campo `WHATSAPP`). A mensagem pronta e a referência `[Ref: Quiz Consultoria Estratégica Flórida]` ficam em `js/quiz.js` e `js/track.js`.
- Licença única: BK3596555. Rodapé com redes sociais, Política de Privacidade, Termos de Uso e Cookies iguais aos da página principal.
- Sem promessa absoluta ("aprovado", "blindagem", "se paga sozinho"). O quiz indica uma estratégia, não aprova crédito.
- Pontuação: máximo de 25 pontos; quente a partir de 17, morno a partir de 10 (`HOT_MIN` e `WARM_MIN` em `config.js`).

Pendências: ID do Pixel (`PIXEL_ID`), webhook do CRM (`CRM_WEBHOOK`) e link de agenda (`AGENDA_URL`), se forem usados.

Testar localmente: abrir um servidor simples nesta pasta (`python -m http.server 8766`) e acessar `http://localhost:8766/`.
