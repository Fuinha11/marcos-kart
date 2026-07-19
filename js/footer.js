/* ============================================================
   MARCOS KART — RODAPÉ COM EMOJIS EM ORDEM DE CLASSIFICAÇÃO
   Preenche #footer-emojis (existe em todas as páginas).
   ============================================================ */
(function () {
  const el = document.getElementById("footer-emojis");
  if (!el || typeof COMPETIDORES === "undefined") return;

  let ordenados;
  let temResultado = false;
  if (typeof classificacaoGeral === "function") {
    const rank = classificacaoGeral();                     // já ordenado
    temResultado = rank.length > 0;
    const vistos = new Set(rank.map((r) => r.comp.id));
    const semResultado = COMPETIDORES.filter((c) => c.participa !== false && !vistos.has(c.id));
    ordenados = [...rank.map((r) => r.comp), ...semResultado];
  } else {
    ordenados = COMPETIDORES.filter((c) => c.participa !== false);
  }

  el.innerHTML = ordenados
    .map((c, i) => {
      // Coroa só para o líder quando já houver resultados lançados
      const lider = temResultado && i === 0 ? " lider" : "";
      const titulo = temResultado ? `${i + 1}º — ${c.nome}` : c.nome;
      return `<span class="fe${lider}" title="${titulo}">${c.emoji || "🏎️"}</span>`;
    })
    .join("");
})();
