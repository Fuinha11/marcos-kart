/* ============================================================
   MARCOS KART — MOTOR DE PONTUAÇÃO
   ------------------------------------------------------------
   Regras implementadas:
   - Cada corrida pontua por posição (PONTUACAO, estilo MK8).
   - PNC (Player Não Competinte) NÃO pontua: se ele termina numa
     posição, os pontos daquela posição "evaporam" (ele rouba de
     quem pontuaria). Os demais recebem os pontos da sua posição.
   - Vencedor da fase = maior soma de pontos nas 12 corridas.
   - Classificados p/ final = top 3 (que pontuam) de cada grupo.
   ============================================================ */

/* Busca um competidor pelo id */
function getComp(id) {
  return COMPETIDORES.find((c) => c.id === id) ||
    (typeof NPCS !== "undefined" && NPCS.find((c) => c.id === id)) ||
    { id, nome: id, personagem: "", cor: "#999", emoji: "❔" };
}

/* PNCs de uma fase (lista de ids), a partir de fase.pncs {grupo: id} */
function pncsDaFase(fase) {
  if (!fase.pncs) return [];
  return Object.values(fase.pncs).filter(Boolean);
}

/* Total de corridas já lançadas numa fase */
function corridasLancadas(fase) {
  return fase.copas.reduce((n, c) => n + (c.placar ? 4 : (c.corridas ? c.corridas.length : 0)), 0);
}

/* Pontos de uma posição (0 = 1º lugar) */
function pontosPosicao(pos) {
  return PONTUACAO[pos] != null ? PONTUACAO[pos] : 0;
}

/* ------------------------------------------------------------
   Calcula a pontuação de uma fase inteira.
   Retorna:
   {
     porCopa: [{ nome, cc, icon, classe, corridas, pontos:{id:pts} }],
     total:   { id: { comp, pontos, vitorias, corridas } },
     ranking: [ { comp, pontos, vitorias, isPNC } ]  (ordenado)
   }
   ------------------------------------------------------------ */
function calcularFase(fase) {
  const pncs = pncsDaFase(fase);
  const total = {};

  function garante(id) {
    if (!total[id]) {
      const comp = getComp(id);
      total[id] = { comp, pontos: 0, vitorias: 0, corridas: 0, isPNC: pncs.includes(id), isWO: !!comp.wo, isNPC: !!comp.npc };
    }
    return total[id];
  }

  const porCopa = fase.copas.map((copa) => {
    const pontosCopa = {};
    if (copa.placar) {
      // Resultado FINAL lançado direto (espelha a tela do jogo).
      // CPUs ocupam posição e pontuam como no jogo — roubam pontos dos pilotos.
      copa.placar.forEach((e) => {
        const reg = garante(e.id);
        const pts = reg.isPNC ? 0 : e.pts;
        reg.pontos += pts;
        pontosCopa[e.id] = (pontosCopa[e.id] || 0) + pts;
      });
    } else {
      // Ordem de chegada corrida a corrida (12 karts). Pontos pela colocação
      // ABSOLUTA: o CPU que chega na frente tira os pontos do piloto.
      (copa.corridas || []).forEach((ordem) => {
        ordem.forEach((id, pos) => {
          const reg = garante(id);
          reg.corridas += 1;
          const pts = reg.isPNC ? 0 : pontosPosicao(pos);
          reg.pontos += pts;
          if (pos === 0 && !reg.isPNC) reg.vitorias += 1;
          pontosCopa[id] = (pontosCopa[id] || 0) + pts;
        });
      });
    }
    return { ...copa, pontosCopa };
  });

  // W.O.: membros do grupo que não compareceram entram na classificação
  // por último, sem pontos (só depois que a fase já tem resultado).
  if (fase.tipo === "grupo" && fase.grupo && corridasLancadas(fase) > 0) {
    COMPETIDORES
      .filter((c) => c.grupo === fase.grupo && c.wo)
      .forEach((c) => garante(c.id));
  }

  // Classificação da fase = só os pilotos (CPUs não contam para o placar
  // geral). W.O. sempre por último.
  const ranking = Object.values(total)
    .filter((r) => !r.isNPC)
    .sort((a, b) => {
      if (!!a.isWO !== !!b.isWO) return a.isWO ? 1 : -1;
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
      return a.comp.nome.localeCompare(b.comp.nome);
    });

  return { porCopa, total, ranking };
}

/* ------------------------------------------------------------
   Classificação de um grupo (busca a fase de grupo correspondente).
   Retorna o ranking com posição, útil para saber quem avança.
   ------------------------------------------------------------ */
function rankingDoGrupo(grupoId) {
  const fase = FASES.find((f) => f.tipo === "grupo" && f.grupo === grupoId);
  if (!fase) return { fase: null, ranking: [] };
  return { fase, ranking: calcularFase(fase).ranking };
}

/* Top N (apenas quem pontua) de um grupo */
function topDoGrupo(grupoId, n = 3) {
  return rankingDoGrupo(grupoId).ranking.filter((r) => !r.isPNC && !r.isWO && !r.isNPC).slice(0, n);
}

/* ------------------------------------------------------------
   Monta os classificados de uma fase final.
   - fase3 ("Vencedores"): top 3 de cada grupo + 1 PNC por grupo.
   - fase4 ("Loooooser"):  o resto de cada grupo + os 2 PNCs.
   Retorna { porGrupo: { grupoId: { qualificados:[], pnc } }, prontos:bool }
   ------------------------------------------------------------ */
function classificadosFinal(fase) {
  const grupos = ["recolonial", "defensoria"];
  const out = { porGrupo: {}, prontos: true };

  grupos.forEach((g) => {
    const rk = rankingDoGrupo(g);
    const grupoTemResultado = rk.fase && corridasLancadas(rk.fase) > 0;
    if (!grupoTemResultado) out.prontos = false;

    const semPNC = rk.ranking.filter((r) => !r.isPNC && !r.isWO && !r.isNPC);
    const pncId = fase.pncs ? fase.pncs[g] : null;

    if (fase.id === "fase3") {
      out.porGrupo[g] = {
        qualificados: semPNC.slice(0, 3).map((r) => r.comp),
        pnc: pncId ? getComp(pncId) : null,
      };
    } else {
      // fase4: os que sobraram (fora do top 3) + PNC entra aqui também
      out.porGrupo[g] = {
        qualificados: semPNC.slice(3).map((r) => r.comp),
        pnc: pncId ? getComp(pncId) : null,
      };
    }
  });

  return out;
}

/* ------------------------------------------------------------
   Ranking de UM torneio (copa) específico de uma fase.
   Usado pelas abas da chave (1º/2º/3º torneio).
   ------------------------------------------------------------ */
function rankingPorCopa(fase, idx) {
  const pncs = pncsDaFase(fase);
  const map = {};
  const copa = fase.copas[idx] || {};
  function garante(id) {
    if (!map[id]) {
      const comp = getComp(id);
      map[id] = { comp, pontos: 0, vitorias: 0, corridas: 0, isPNC: pncs.includes(id), isWO: !!comp.wo, isNPC: !!comp.npc };
    }
    return map[id];
  }
  if (copa.placar) {
    // Resultado final: CPUs entram interligados, com os pontos reais do jogo.
    copa.placar.forEach((e) => {
      const reg = garante(e.id);
      reg.pontos += reg.isPNC ? 0 : e.pts;
    });
  } else {
    (copa.corridas || []).forEach((ordem) => {
      ordem.forEach((id, pos) => {
        const reg = garante(id);
        reg.corridas += 1;
        reg.pontos += reg.isPNC ? 0 : pontosPosicao(pos);
        if (pos === 0 && !reg.isPNC) reg.vitorias += 1;
      });
    });
  }
  // Aba de torneio mostra o grid COMPLETO como no jogo (CPUs incluídos);
  // só os W.O. ficam por último. Empate no ponto → ordem alfabética
  // (espelha a tela do jogo; não usa vitórias como desempate).
  return Object.values(map).sort((a, b) => {
    if (!!a.isWO !== !!b.isWO) return a.isWO ? 1 : -1;
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    return a.comp.nome.localeCompare(b.comp.nome);
  });
}

/* ------------------------------------------------------------
   CLASSIFICAÇÃO GERAL do torneio (todas as fases somadas).
   Critérios de ordenação:
     1º) melhor colocação alcançada nas fases (menor = melhor)
     2º) pontos totais somados (desempate)
   ------------------------------------------------------------ */
function classificacaoGeral() {
  const acc = {};
  FASES.forEach((fase) => {
    if (corridasLancadas(fase) === 0) return;
    calcularFase(fase).ranking.forEach((r, i) => {
      if (r.isNPC) return; // CPUs não entram na classificação geral
      const id = r.comp.id;
      if (!acc[id]) acc[id] = { comp: r.comp, pontosTotais: 0, melhorPos: Infinity, fases: 0 };
      acc[id].pontosTotais += r.pontos;
      acc[id].fases += 1;
      if (!r.isPNC && i + 1 < acc[id].melhorPos) acc[id].melhorPos = i + 1;
    });
  });
  const list = Object.values(acc);
  list.forEach((a) => { if (a.melhorPos === Infinity) a.melhorPos = 99; });
  list.sort((a, b) => {
    if (a.melhorPos !== b.melhorPos) return a.melhorPos - b.melhorPos; // 1º critério
    return b.pontosTotais - a.pontosTotais;                            // desempate
  });
  return list;
}

/* Medalha por posição (para as tabelas) */
function medalha(pos) {
  return ["🥇", "🥈", "🥉"][pos] || "";
}
