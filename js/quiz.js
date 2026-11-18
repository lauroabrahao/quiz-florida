(function () {
  var C = window.FUNIL || {};

  // pts = pontuação de cada opção (mesma ordem de opts). Máximo = 25.
  var QS = [
    { k: 'Objetivo', q: 'Qual é o seu objetivo com um imóvel na Flórida?',
      opts: ['Renda com aluguel anual', 'Casa de férias para a família', 'Aluguel por temporada (Airbnb)', 'Reformar ou construir para vender', 'Morar nos Estados Unidos'],
      pts: [2, 1, 2, 2, 2] },
    { k: 'Valor do imóvel', q: 'Qual faixa de valor de imóvel você tem em mente?',
      opts: ['Até US$ 300 mil', 'De US$ 300 mil a 500 mil', 'De US$ 500 mil a 800 mil', 'Acima de US$ 800 mil'],
      pts: [1, 2, 3, 3] },
    { k: 'Entrada disponível', q: 'Quanto você tem disponível para a entrada?',
      opts: ['Até US$ 50 mil', 'De US$ 50 mil a 100 mil', 'De US$ 100 mil a 200 mil', 'Acima de US$ 200 mil'],
      pts: [0, 2, 3, 4] },
    { k: 'Pagamento', q: 'Como você pretende pagar?',
      opts: ['À vista', 'Com financiamento', 'Ainda não sei'],
      pts: [3, 2, 0] },
    { k: 'Visto / residência', q: 'Você tem visto americano ou residência nos EUA?',
      opts: ['Green card ou cidadania americana', 'Visto de turista (B1/B2) válido', 'Outro visto válido (trabalho, investidor)', 'Não tenho visto ou está vencido'],
      pts: [3, 2, 2, 1] },
    { k: 'Comprovação de renda', q: 'Como você comprova a sua renda hoje?',
      opts: ['Empresário/sócio, com imposto de renda', 'Assalariado, com imposto de renda', 'Autônomo ou profissional liberal', 'Renda de investimentos ou aluguéis'],
      pts: [3, 2, 2, 3] },
    { k: 'Já investiu nos EUA', q: 'Você já tem imóvel ou conta bancária nos Estados Unidos?',
      opts: ['Sim, já tenho imóvel ou conta', 'Não, seria a minha primeira vez'],
      pts: [2, 1] },
    { k: 'Prazo', q: 'Quando você pretende comprar?',
      opts: ['Nos próximos 3 meses', 'Entre 3 e 6 meses', 'Entre 6 e 12 meses', 'Ainda estou pesquisando'],
      pts: [5, 3, 1, 0] }
  ];
  var N = QS.length;           // passo do contato = N ; resultado = N + 1
  var VISTO = 4;               // índice da pergunta de visto
  var RESULTS = ['Renda em dólar com locação anual', 'Casa de férias para a sua família', 'Renda por temporada perto dos parques', 'Reforma ou construção para revenda', 'Mudança para os Estados Unidos'];

  // A temperatura é interna (CRM); o lead só vê o comentário.
  var COMMENTS = {
    quente: 'Pelas suas respostas, vale conversar já: entrada e prazo permitem começar a ver imóveis e simular o financiamento.',
    morno: 'Seu perfil tem uma boa base. Uma conversa ajuda a definir faixa de valor, entrada e o melhor momento para comprar.',
    frio: 'Você está na fase de pesquisa, e tudo bem. Uma conversa sem compromisso ajuda a entender os números antes de decidir.'
  };
  var VISTO_NOTE = 'Você não precisa de visto americano nem de green card para comprar. O visto só influencia as condições de financiamento, e o especialista explica o que se aplica ao seu caso.';

  var step = 0, answers = [], submitted = false, autoTimer = null;
  var $ = function (id) { return document.getElementById(id); };

  function temperature() {
    var s = 0;
    answers.forEach(function (a, i) { s += QS[i].pts[a]; });
    var t = s >= (C.HOT_MIN || 17) ? 'quente' : s >= (C.WARM_MIN || 10) ? 'morno' : 'frio';
    return { score: s, temp: t };
  }
  function rows() { return QS.map(function (q, i) { return { k: q.k, v: q.opts[answers[i]] }; }); }

  function render() {
    var total = N + 1;
    var shown = Math.min(step + 1, total);
    $('lbl').textContent = step > N ? 'Concluído' : 'Etapa ' + shown + ' de ' + total;
    $('prog').style.width = Math.round((step > N ? total : shown) / total * 100) + '%';
    $('s-q').classList.toggle('hidden', step >= N);
    $('s-c').classList.toggle('hidden', step !== N);
    $('s-r').classList.toggle('hidden', step !== N + 1);
    $('back').classList.toggle('hidden', step === 0 || step > N);

    $('intro').classList.toggle('hidden', step !== 0);
    if (step < N) {
      $('q').textContent = QS[step].q;
      var box = $('opts'); box.innerHTML = '';
      QS[step].opts.forEach(function (label, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt' + (answers[step] === i ? ' sel' : ''); b.textContent = label;
        b.onclick = function () { answers[step] = i; step++; render(); window.scrollTo(0, 0); };
        box.appendChild(b);
      });
    }
    if (step === N + 1) showResult();
  }

  function validate() {
    var ok = true, n = $('nome').value.trim(), w = $('whats').value.replace(/\D/g, ''), e = $('email').value.trim();
    $('e-nome').textContent = n.length < 2 ? (ok = false, 'Informe seu nome.') : '';
    $('e-whats').textContent = w.length < 10 ? (ok = false, 'Informe um WhatsApp com DDD.') : '';
    $('e-email').textContent = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) ? (ok = false, 'Informe um e-mail válido.') : '';
    return ok;
  }

  function message(lead) {
    var l = ['Olá! Fiz o quiz de perfil da Realize e quero marcar a minha consultoria estratégica sem custos.', ''];
    rows().forEach(function (r) { l.push('• ' + r.k + ': ' + r.v); });
    l.push('• Melhor horário: ' + lead.horario, '', 'Nome: ' + lead.nome, 'E-mail: ' + lead.email, 'Estratégia indicada: ' + RESULTS[answers[0]]);
    var q = new URLSearchParams(location.search), o = [];
    ['utm_source', 'utm_campaign', 'utm_content'].forEach(function (k) { if (q.get(k)) o.push(q.get(k)); });
    l.push('', '[QUIZ' + (o.length ? ' | ' + o.join(' / ') : '') + ']');
    return l.join('\n');
  }

  function showResult() {
    var lead = { nome: $('nome').value.trim(), whatsapp: $('whats').value.replace(/\D/g, ''), email: $('email').value.trim(), horario: $('horario').value };
    var t = temperature();
    $('r-title').textContent = RESULTS[answers[0]];
    $('r-comment').textContent = COMMENTS[t.temp] + ' ' + VISTO_NOTE;
    var s = $('summary'); s.innerHTML = '';
    rows().forEach(function (r) {
      var d = document.createElement('div');
      var b = document.createElement('b'); b.textContent = r.k;
      var sp = document.createElement('span'); sp.textContent = r.v;
      d.appendChild(b); d.appendChild(sp); s.appendChild(d);
    });
    var wa = $('wa'); wa.href = waLink(message(lead)); wa.target = '_blank'; wa.rel = 'noopener';
    wa.onclick = function () { track('Contact', { content_name: 'quiz_whatsapp' }); };
    var ag = $('agenda');
    if (C.AGENDA_URL) {
      ag.classList.remove('hidden'); wa.classList.add('sec'); wa.textContent = 'Falar no WhatsApp';
      ag.href = C.AGENDA_URL; ag.target = '_blank'; ag.rel = 'noopener';
      ag.onclick = function () { track('Schedule', { content_name: 'quiz_agenda', status: t.temp }); };
      $('r-note').textContent = 'Escolha o melhor dia e horário. Suas respostas já foram enviadas ao especialista.';
    } else {
      ag.classList.add('hidden');
      wa.classList.remove('sec');
      wa.textContent = 'Marcar minha consultoria no WhatsApp';

      // Abre o WhatsApp sozinho, com as respostas já escritas (4 segundos, dá para cancelar)
      clearInterval(autoTimer);
      var left = 4, note = $('r-note');
      note.innerHTML = '';
      var txt = document.createElement('span');
      var cancel = document.createElement('button');
      cancel.type = 'button'; cancel.className = 'back'; cancel.textContent = 'Cancelar';
      cancel.style.cssText = 'display:inline;margin:0 0 0 8px;padding:0;text-decoration:underline';
      function paint() { txt.textContent = 'Abrindo o WhatsApp em ' + left + 's, com as suas respostas já escritas. '; }
      paint(); note.appendChild(txt); note.appendChild(cancel);
      autoTimer = setInterval(function () {
        left--;
        if (left <= 0) {
          clearInterval(autoTimer);
          track('Contact', { content_name: 'quiz_whatsapp_auto' });
          window.location.href = wa.href;
        } else { paint(); }
      }, 1000);
      cancel.onclick = function () {
        clearInterval(autoTimer);
        note.textContent = 'Tudo bem. Quando quiser, toque no botão acima para enviar as suas respostas pelo WhatsApp.';
      };
    }

    if (submitted) return;
    submitted = true;
    track('Lead', { content_name: 'quiz_florida', value: t.score, currency: 'BRL', status: t.temp, variante: window.VARIANTE });
    if (C.CRM_WEBHOOK) {
      var payload = {
        origem: 'quiz-florida', variante: window.VARIANTE, temperatura: t.temp, pontuacao: t.score,
        nome: lead.nome, whatsapp: lead.whatsapp, email: lead.email, melhor_horario: lead.horario,
        visto: QS[VISTO].opts[answers[VISTO]],
        respostas: rows(), estrategia: RESULTS[answers[0]],
        utm: Object.fromEntries(new URLSearchParams(location.search)),
        criado_em: new Date().toISOString(),
        pagina: location.href
      };
      try {
        // Envio "simples" (sem preflight), aceito pelo Google Apps Script. A resposta não é lida; o lead chega mesmo se a pessoa fechar a página.
        fetch(C.CRM_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
      } catch (e) {}
    }
  }

  $('back').onclick = function () { step = Math.max(0, step - 1); render(); };
  $('finish').onclick = function () { if (validate()) { step = N + 1; render(); window.scrollTo(0, 0); } };
  $('restart').onclick = function () { clearInterval(autoTimer); step = 0; answers = []; submitted = false; render(); };
  render();
})();
