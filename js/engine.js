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
  return COMPETIDORES.find((c) => c.id === id) || { id, nome: id, personagem: "", cor: "#999", emoji: "❔" };
}

/* PNCs de uma fase (lista de ids), a partir de fase.pncs {grupo: id} */
function pncsDaFase(fase) {
  if (!fase.pncs) return [];
  return Object.values(fase.pncs).filter(Boolean);
}

/* Total de corridas já lançadas numa fase */
function corridasLancadas(fase) {
  return fase.copas.reduce((n, c) => n + (c.corridas ? c.corridas.length : 0), 0);
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
    if (!total[id]) total[id] = { comp: getComp(id), pontos: 0, vitorias: 0, corridas: 0, isPNC: pncs.includes(id) };
    return total[id];
  }

  const porCopa = fase.copas.map((copa) => {
    const pontosCopa = {};
    (copa.corridas || []).forEach((ordem) => {
      ordem.forEach((id, pos) => {
        const reg = garante(id);
        const pts = reg.isPNC ? 0 : pontosPosicao(pos);
        reg.pontos += pts;
        reg.corridas += 1;
        if (pos === 0) reg.vitorias += 1;
        pontosCopa[id] = (pontosCopa[id] || 0) + pts;
      });
    });
    return { ...copa, pontosCopa };
  });

  const ranking = Object.values(total).sort((a, b) => {
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
  return rankingDoGrupo(grupoId).ranking.filter((r) => !r.isPNC).slice(0, n);
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

    const semPNC = rk.ranking.filter((r) => !r.isPNC);
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
  const corridas = (fase.copas[idx] && fase.copas[idx].corridas) || [];
  corridas.forEach((ordem) => {
    ordem.forEach((id, pos) => {
      if (!map[id]) map[id] = { comp: getComp(id), pontos: 0, vitorias: 0, corridas: 0, isPNC: pncs.includes(id) };
      map[id].pontos += map[id].isPNC ? 0 : pontosPosicao(pos);
      map[id].corridas += 1;
      if (pos === 0) map[id].vitorias += 1;
    });
  });
  return Object.values(map).sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
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
