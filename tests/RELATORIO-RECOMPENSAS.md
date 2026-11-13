# Revisão do sistema de recompensas

Validação executada no Chrome headless, em perfil de teste separado. O teste principal usa baús gerados pelo jogo, interação pela tecla E, alternativas e confirmação da interface. O posicionamento é preparado pelo carregamento de estado existente e o ciclo de combate fica suspenso para isolar as recompensas. O segundo baú fica no andar seguinte, acessado pelas escadas reais.

| Teste obrigatório | Resultado |
| --- | --- |
| 1. Abrir/interagir com um baú | Passou: desafio exibido e exploração pausada; item entregue após confirmação. |
| 2. Responder corretamente | Passou: resposta reconhecida. |
| 3. Receber 50 XP | Passou: 50 XP totais, nível 2, 10/80 XP na barra. |
| 4. Receber 20 moedas | Passou: saldo e HUD atualizados imediatamente. |
| 5. Responder incorretamente | Passou: erro reconhecido, com efeito próprio. |
| 6. Não receber recompensa pelo erro | Passou: XP, moedas e inventário inalterados. |
| 7. Clicar repetidamente na confirmação | Passou: 25 cliques após acerto e após erro, sem duplicar XP, moedas, itens ou contagem de desafios. |
| 8. Abrir outro baú e acertar outra pergunta | Passou: baú real do próximo andar e pergunta seguinte. |
| 9. Acumular recompensas | Passou: 100 XP totais, 40 moedas, nível 2 e 60/80 XP na barra. |
| 10. Atualizar página | Passou: valores preservados mesmo com coleta de item pendente. |
| 11. Fechar e reabrir o navegador | Passou: duas execuções independentes do Chrome com o mesmo perfil de teste. |
| 12. Conferir persistência de XP e moedas | Passou: 100 XP totais e 40 moedas restaurados, sem reaplicar recompensas. |

## Correções desta revisão

- A notificação de um desafio já recompensado informava novamente +50 XP e +20 OURO, embora o saldo não aumentasse. Agora informa que a recompensa já foi recebida e não reproduz moedas ou XP flutuante.
- Um desafio recompensado, mas ainda sem coleta do item, podia apresentar outra pergunta depois de resolver outros desafios. Agora recupera a pergunta original registrada.
- A confirmação consome a ação de abertura antes de executá-la, protegendo também contra chamadas repetidas durante a abertura.
- A contagem de desafios concluídos só avança se o baú aceitar a abertura. Um callback rejeitado não altera esse progresso; a conclusão é salva após a abertura.

## Verificações adicionais

- Três classes: XP, ouro, atributos, pontos de atributo/habilidade, nível e HUD passaram.
- Dez perguntas: alternativa incorreta, correta e confirmação repetida passaram para cada pergunta.
- Nenhum erro JavaScript ou rejeição de Promise observado nas interações monitoradas. Verificação de sintaxe dos três arquivos JavaScript carregados pelo jogo e `git diff --check` passaram.
- Inventário, baús abertos, dados adicionais do salvamento e atributos preservados.
- Animações de acerto e erro, moedas, partículas, XP, saída automática e modo de movimento reduzido passaram.
- Nenhuma funcionalidade removida.

## Arquivos de teste

- `reward-review.html`: fluxo com baús reais, atualização e reinício do navegador. Executar duas vezes com o mesmo perfil isolado; a primeira execução termina em `awaiting-browser-restart` e a segunda em `passed`. Usar um perfil novo para reiniciar o cenário completo.
- `reward-progression.html`: três classes e as dez perguntas.
- `reward-effects.html`: animações e movimento reduzido.
- `reward-persistence.html`: preservação dos dados e compatibilidade com salvamentos anteriores.

Os cenários de persistência devem ser executados em perfil isolado, pois criam uma partida de teste. Os resultados aparecem no elemento `#results` e no atributo `body[data-audit]`.
