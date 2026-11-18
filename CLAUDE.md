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


## Receber os leads (planilha do Google + e-mail)

O quiz envia cada lead, assim que a pessoa conclui o contato, para o endereço que estiver em `CRM_WEBHOOK` (`js/config.js`). O receptor pronto está em `apps-script/Codigo.gs`: grava uma linha na planilha (aba "Leads", colorida por temperatura: quente, morno, frio) e manda um e-mail ao dono da planilha com o resumo e o link do WhatsApp do lead.

Como instalar (uma vez, uns 3 minutos):
1. Crie uma planilha em https://sheets.new (nome sugerido: "Leads Quiz Realize").
2. Menu **Extensões > Apps Script**. Apague o que houver e cole todo o conteúdo de `apps-script/Codigo.gs`. Salve.
3. **Implantar > Nova implantação > tipo "App da Web"**. Em "Executar como", deixe **Eu**; em "Quem tem acesso", escolha **Qualquer pessoa**. Clique em Implantar e autorize quando o Google pedir (é a sua própria conta).
4. Copie o **URL do app da Web** (termina em `/exec`) e cole em `js/config.js`, no campo `CRM_WEBHOOK`. Faça `git commit` e `git push`: o quiz atualiza em cerca de 1 minuto.
5. Teste: preencha o quiz uma vez e confira a linha na planilha e o e-mail. Apague a linha de teste.

Observações:
- O envio usa `mode: no-cors` e texto simples, que é o formato que o Apps Script aceita no navegador. Por isso o quiz não lê a resposta; o lead chega mesmo se a pessoa fechar a página.
- Se mudar o código do Apps Script, é preciso criar uma **nova versão** da implantação (Implantar > Gerenciar implantações > Editar > Nova versão); o URL continua o mesmo.
- Enviar mensagem automática no WhatsApp do lead ou do time exige a API oficial do WhatsApp (ou serviços como Z-API e Evolution), que é paga e precisa de aprovação. O e-mail e a planilha cobrem o recebimento sem isso.
