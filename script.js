(function () {
'use strict';
// Todo o conteúdo é local e funciona sem internet.
const questions = [
  {topic:'Fundamentos',question:'Qual é a principal função de um roteador em uma rede?',answers:['Conectar dispositivos entre redes diferentes.','Armazenar arquivos compartilhados na rede.','Converter nomes de domínio em endereços IP.','Proteger o computador contra vírus.'],correct:0,explanation:'O roteador encaminha pacotes entre redes diferentes, usando endereços IP e sua tabela de roteamento para escolher o caminho.'},
  {topic:'Protocolos e serviços',question:'Qual serviço traduz nomes de domínio em endereços IP?',answers:['DHCP','FTP','DNS','SMTP'],correct:2,explanation:'O DNS (Domain Name System) permite consultar registros de domínio, incluindo endereços IP usados para acessar sites pelo nome.'},
  {topic:'Fundamentos',question:'O que caracteriza uma rede LAN?',answers:['Interliga exclusivamente países diferentes.','Conecta dispositivos em uma área local, como uma casa ou escritório.','Funciona somente sem fio.','Dispensa protocolos de comunicação.'],correct:1,explanation:'Uma LAN (Local Area Network) conecta dispositivos em uma área limitada e pode usar cabos, Wi-Fi ou ambos.'},
  {topic:'Protocolos e serviços',question:'Qual protocolo oferece entrega confiável e ordenada de dados?',answers:['UDP','IP','ARP','TCP'],correct:3,explanation:'O TCP usa números de sequência, confirmações e retransmissões para oferecer um fluxo de bytes confiável e ordenado entre aplicações.'},
  {topic:'Fundamentos',question:'Quantos bits possui um endereço IPv4?',answers:['32 bits','16 bits','64 bits','128 bits'],correct:0,explanation:'O IPv4 possui 32 bits, normalmente representados por quatro números separados por pontos. O IPv6 possui 128 bits.'},
  {topic:'Protocolos e serviços',question:'Para que serve o protocolo DHCP?',answers:['Criptografar páginas web.','Enviar mensagens de e-mail.','Atribuir automaticamente configurações de rede aos dispositivos.','Transferir arquivos entre servidores.'],correct:2,explanation:'O DHCP pode fornecer automaticamente endereço IP, máscara de sub-rede, gateway padrão e servidores DNS.'},
  {topic:'Conectividade e segurança',question:'Qual é a principal diferença entre HTTPS e HTTP?',answers:['HTTPS só funciona em redes locais.','HTTPS utiliza TLS para proteger a comunicação.','HTTP sempre é mais seguro.','HTTPS dispensa endereços IP.'],correct:1,explanation:'O HTTPS usa TLS para criptografar a comunicação, proteger sua integridade e autenticar o servidor por certificados. Isso não garante que o conteúdo do site seja confiável.'},
  {topic:'Fundamentos',question:'Como um switch Ethernet encaminha quadros unicast conhecidos?',answers:['Sempre envia para todas as portas.','Usa apenas o nome do computador.','Consulta o endereço IP público do dispositivo.','Usa sua tabela de endereços MAC para escolher a porta de destino.'],correct:3,explanation:'O switch aprende endereços MAC de origem e suas portas. Quando conhece o MAC de destino, encaminha o quadro pela porta correspondente.'},
  {topic:'Conectividade e segurança',question:'Qual é a função principal de um firewall?',answers:['Filtrar o tráfego de rede com base em regras de segurança.','Aumentar a velocidade contratada da internet.','Substituir todos os cabos de rede.','Atribuir nomes aos computadores.'],correct:0,explanation:'Um firewall permite ou bloqueia tráfego conforme regras de segurança, considerando informações como endereços, portas e estado das conexões.'},
  {topic:'Conectividade e segurança',question:'O que a latência de uma rede representa?',answers:['A quantidade de dispositivos conectados.','O volume máximo de dados armazenados.','O tempo que os dados levam para percorrer um caminho.','O tamanho físico de um cabo.'],correct:2,explanation:'Latência é o atraso na comunicação, normalmente medido em milissegundos. É diferente de largura de banda, que indica a capacidade de transmissão.'}
];
const game = window.DungeonGame;
const el = id => document.getElementById(id);
let reward = null;
let selected = null;
let answered = false;
let solved = false;
let questionIndex = 0;
let previousFocus = null;

function renderAnswers() {
  selected = null;
  answered = false;
  solved = false;
  el('networkFeedback').hidden = true;
  el('networkConfirm').disabled = true;
  el('networkConfirm').textContent = 'Confirmar resposta';
  el('networkAnswers').replaceChildren();
  const q = questions[questionIndex];
  el('networkQuestion').textContent = q.question;
  q.answers.forEach((text, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'network-answer';
    button.textContent = `${String.fromCharCode(65 + index)}. ${text}`;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (answered) return;
      selected = index;
      [...el('networkAnswers').children].forEach((item, i) => {
        item.classList.toggle('selected', i === index);
        item.setAttribute('aria-pressed', String(i === index));
      });
      el('networkConfirm').disabled = false;
    });
    el('networkAnswers').append(button);
  });
}

function closeChallenge() {
  reward = null;
  el('networkModal').hidden = true;
  game.setNetworkModalActive(false);
  game.resumeDungeon();
  if (previousFocus && previousFocus.isConnected) previousFocus.focus();
}

game.onChestChallenge = openChest => {
  if (reward) return;
  const knowledge = game.networkKnowledge || (game.networkKnowledge = {});
  const completed = Number.isInteger(knowledge.completed) && knowledge.completed >= 0 ? knowledge.completed : 0;
  questionIndex = completed % questions.length;
  reward = openChest;
  previousFocus = document.activeElement;
  game.stopDungeon();
  game.setNetworkModalActive(true);
  el('networkProgress').textContent = `Selo ${questionIndex + 1} / ${questions.length} · ${questions[questionIndex].topic} · ${completed} baú(s) decifrado(s)`;
  renderAnswers();
  el('networkModal').hidden = false;
  el('networkTitle').focus();
};

el('networkConfirm').addEventListener('click', () => {
  if (!reward) return;
  if (answered) {
    if (!solved) { renderAnswers(); el('networkAnswers').firstElementChild.focus(); return; }
    const openChest = reward;
    const knowledge = game.networkKnowledge;
    knowledge.completed = (Number.isInteger(knowledge.completed) && knowledge.completed >= 0 ? knowledge.completed : 0) + 1;
    // Opening the chest persists both the treasure and learning progress together.
    openChest();
    closeChallenge();
    return;
  }
  if (selected === null) return;
  answered = true;
  const q = questions[questionIndex];
  solved = selected === q.correct;
  [...el('networkAnswers').children].forEach((button, i) => {
    button.disabled = true;
    button.classList.toggle('correct', i === q.correct);
    button.classList.toggle('wrong', i === selected && !solved);
    if (i === q.correct) button.textContent += ' ✓ Correta';
    else if (i === selected) button.textContent += ' ✕ Incorreta';
  });
  el('networkFeedback').textContent = `${solved ? 'Selo decifrado!' : 'O selo permanece fechado. Leia a explicação e tente novamente.'} ${q.explanation}`;
  el('networkFeedback').hidden = false;
  el('networkConfirm').textContent = solved ? 'Receber tesouro e continuar' : 'Tentar novamente';
});
el('networkLeave').addEventListener('click', closeChallenge);
el('networkModal').addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeChallenge(); }
  if (event.key !== 'Tab') return;
  const buttons = [...el('networkModal').querySelectorAll('button:not(:disabled)')];
  const first = buttons[0], last = buttons[buttons.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === el('networkTitle'))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
})();
