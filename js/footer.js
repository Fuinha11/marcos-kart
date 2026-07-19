/* ============================================================
   MARCOS KART — RODAPÉ COM EMOJIS EM ORDEM DE CLASSIFICAÇÃO
   Preenche #footer-emojis (existe em todas as páginas).
   ============================================================ */
(function () {
  const el = document.getElementById("footer-emojis");
  if (!el || typeof COMPETIDORES === "undefined") return;

  let ordenados;
  if (typeof classificacaoGeral === "function") {
    const rank = classificacaoGeral();                     // já ordenado
    const vistos = new Set(rank.map((r) => r.comp.id));
    const semResultado = COMPETIDORES.filter((c) => c.participa !== false && !vistos.has(c.id));
    ordenados = [...rank.map((r) => r.comp), ...semResultado];
  } else {
    ordenados = COMPETIDORES.filter((c) => c.participa !== false);
  }

  el.innerHTML = ordenados
    .map((c, i) => {
      const pos = i + 1;
      const lider = i === 0 ? " lider" : "";
      return `<span class="fe${lider}" title="${pos}º — ${c.nome}">${c.emoji || "🏎️"}</span>`;
    })
    .join("");
})();
