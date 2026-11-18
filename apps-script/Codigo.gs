/**
 * Recebe os leads do quiz (POST em JSON), grava na planilha e avisa por e-mail.
 * Como instalar: veja o CLAUDE.md desta pasta (seção "Receber os leads").
 */
var ABA = 'Leads';
var CABECALHO = ['Data e hora', 'Temperatura', 'Pontuação', 'Nome', 'WhatsApp', 'E-mail', 'Melhor horário',
  'Visto', 'Objetivo', 'Valor do imóvel', 'Entrada', 'Pagamento', 'Renda', 'Já investiu nos EUA', 'Prazo',
  'Estratégia indicada', 'Origem (utm)', 'Página'];
var CORES = { quente: '#F8D7D2', morno: '#FCEFC7', frio: '#DDE8F5' };

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (sh.getLastRow() === 0) {
      sh.appendRow(CABECALHO);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold').setBackground('#04111F').setFontColor('#F2D99B');
    }

    var r = {};
    (d.respostas || []).forEach(function (x) { r[x.k] = x.v; });
    var utm = d.utm ? Object.keys(d.utm).map(function (k) { return k + '=' + d.utm[k]; }).join(' | ') : '';
    var temp = String(d.temperatura || '').toLowerCase();

    sh.appendRow([new Date(), temp, d.pontuacao, d.nome, "'" + (d.whatsapp || ''), d.email, d.melhor_horario,
      d.visto || r['Visto / residência'], r['Objetivo'], r['Valor do imóvel'], r['Entrada disponível'],
      r['Pagamento'], r['Comprovação de renda'], r['Já investiu nos EUA'], r['Prazo'],
      d.estrategia, utm, d.pagina || '']);
    var linha = sh.getLastRow();
    if (CORES[temp]) sh.getRange(linha, 1, 1, CABECALHO.length).setBackground(CORES[temp]);

    // e-mail para o dono da planilha
    var digitos = String(d.whatsapp || '').replace(/\D/g, '');
    var zap = 'https://wa.me/' + (digitos.length <= 11 ? '55' + digitos : digitos);
    var icone = temp === 'quente' ? '🔥' : (temp === 'morno' ? '🟡' : '🔵');
    var linhas = [
      'Temperatura: ' + temp.toUpperCase() + ' (' + d.pontuacao + ' pontos)',
      'Nome: ' + d.nome,
      'WhatsApp: ' + d.whatsapp + '  ->  ' + zap,
      'E-mail: ' + d.email,
      'Melhor horário: ' + d.melhor_horario,
      '',
      'Objetivo: ' + r['Objetivo'],
      'Valor do imóvel: ' + r['Valor do imóvel'],
      'Entrada: ' + r['Entrada disponível'],
      'Pagamento: ' + r['Pagamento'],
      'Visto: ' + (d.visto || r['Visto / residência']),
      'Renda: ' + r['Comprovação de renda'],
      'Já investiu nos EUA: ' + r['Já investiu nos EUA'],
      'Prazo: ' + r['Prazo'],
      '',
      'Estratégia indicada: ' + d.estrategia,
      'Origem: ' + (utm || 'direto')
    ];
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: icone + ' Novo lead do quiz (' + temp + '): ' + d.nome,
      body: linhas.join('\n') + '\n\nPlanilha: ' + ss.getUrl()
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Abrir o endereço no navegador mostra "ok": serve para testar se está no ar.
function doGet() {
  return ContentService.createTextOutput('ok');
}
