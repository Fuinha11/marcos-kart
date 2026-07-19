/* ============================================================
   MARCOS KART — PÁGINA DE FASES
   Timeline (passadas / atual / futuras) + chave de cada fase.
   ============================================================ */

/* ---------- Card de fase (clicável) ---------- */
function faseCardHTML(fase) {
  const meta =
    fase.status === "passada" ? "Encerrada" :
    fase.status === "atual"   ? "Em andamento" : "Em breve";
  const quando = fase.quando ? ` · ${fase.quando.data}` : "";
  return `
    <button class="fase-card ${fase.status}" data-fase="${fase.id}">
      <span class="fc-icon">${fase.icon}</span>
      <span>
        <span class="fc-nome">${fase.nome}</span><br />
        <span class="fc-meta">${meta}${quando}</span>
      </span>
    </button>`;
}

/* ---------- Horários de uma fase ---------- */
function horariosHTML(fase) {
  if (!fase.quando) return "";
  if (!fase.quando.horarios || !fase.quando.horarios.length) {
    return `<div style="margin-top:8px"><span class="pill">📅 ${fase.quando.data}</span></div>`;
  }
  const chips = fase.quando.horarios
    .map((h) => `<span class="pill" style="margin:2px">${h.flag} ${h.hora} ${h.pais}</span>`)
    .join(" ");
  return `<div style="margin-top:8px"><b>📅 ${fase.quando.data}</b><br />${chips}</div>`;
}

/* ---------- Tabela de classificação ---------- */
function standingsTableHTML(ranking, opts = {}) {
  const top = opts.qualifyTop || 0;
  if (!ranking.length) return `<p class="empty-note">Sem corridas lançadas ainda.</p>`;
  const rows = ranking.map((r, i) => {
    const cls = r.isPNC ? "pnc" : (top && i < top ? "qualif" : "");
    const pncTag = r.isPNC ? `<span class="tag-pnc">PNC · não pontua</span>` : "";
    return `
      <tr class="${cls}">
        <td class="pos">${i + 1}</td>
        <td>
          <span class="dot" style="background:${r.comp.cor}"></span>
          ${medalha(i)} <b>${r.comp.nome}</b>
          <span style="color:#8a7c53">(${r.comp.personagem})</span> ${pncTag}
        </td>
        <td>${r.vitorias}🏆</td>
        <td class="pts">${r.pontos}</td>
      </tr>`;
  }).join("");
  return `
    <table class="standings">
      <thead><tr><th>#</th><th>Piloto</th><th>Vit.</th><th style="text-align:right">Pts</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ---------- Resumo por copa ---------- */
function copasResumoHTML(calc) {
  return `
    <div class="copas" style="margin-top:14px">
      ${calc.porCopa.map((copa) => {
        const nCorr = (copa.corridas || []).length;
        let vencedor = "—";
        if (nCorr) {
          const top = Object.entries(copa.pontosCopa).sort((a, b) => b[1] - a[1])[0];
          if (top) vencedor = `${getComp(top[0]).nome} <span style="color:#8a7c53">(${top[1]} pts)</span>`;
        }
        return `
          <div class="copa ${copa.classe}">
            <div class="icon">${copa.icon}</div>
            <div><b>${copa.nome}</b></div>
            <div class="cc">${copa.cc}</div>
            <div style="margin-top:8px; font-size:.85rem">
              ${nCorr ? `${nCorr}/4 corridas<br />🥇 ${vencedor}` : `<span style="color:#8a7c53">aguardando</span>`}
            </div>
          </div>`;
      }).join("")}
    </div>`;
}

/* ---------- Chave de uma fase de grupo ---------- */
function chaveGrupoHTML(fase) {
  const calc = calcularFase(fase);
  const grupo = GRUPOS[fase.grupo];
  const temResultado = corridasLancadas(fase) > 0;
  return `
    <div class="chave-grid">
      <div class="chave-box">
        <h4>🏁 Classificação — ${grupo.nome}</h4>
        ${standingsTableHTML(calc.ranking, { qualifyTop: 3 })}
        ${temResultado ? `<p style="margin-top:10px; font-size:.9rem; color:#6b5f3e">
          <span class="dot" style="background:#43b047"></span> As <b>3 primeiras posições</b> avançam para a Grande Final.</p>` : ""}
      </div>
      <div class="chave-box">
        <h4>🏆 As 3 copas</h4>
        ${copasResumoHTML(calc)}
      </div>
    </div>`;
}

/* ---------- Chave de uma fase final ---------- */
function chaveFinalHTML(fase) {
  const cl = classificadosFinal(fase);
  const temResultado = corridasLancadas(fase) > 0;

  const colunas = Object.keys(cl.porGrupo).map((gid) => {
    const g = GRUPOS[gid];
    const info = cl.porGrupo[gid];
    const seeds = info.qualificados.map((c, i) => `
      <div class="finalist-row">
        <span class="seed">${i + 1}º</span>
        <span class="dot" style="background:${c.cor}"></span>
        <b>${c.nome}</b> <span style="color:#8a7c53">(${c.personagem})</span>
      </div>`).join("") || `<p class="empty-note">Definido após a fase de grupo.</p>`;
    const pnc = info.pnc
      ? `<div class="finalist-row" style="border-color:#7b3fa0; background:#f7f0fb">
           <span class="seed">🎭</span>
           <span class="dot" style="background:${info.pnc.cor}"></span>
           <b>${info.pnc.nome}</b> <span class="tag-pnc">PNC</span>
         </div>`
      : `<div class="finalist-row" style="border-style:dashed">
           <span class="seed">🎭</span> <span style="color:#8a7c53">PNC a escolher pelo grupo</span>
         </div>`;
    return `
      <div class="chave-box">
        <h4 style="color:${g.cor}">${g.nome}</h4>
        <div class="finalists">${seeds}${pnc}</div>
      </div>`;
  }).join("");

  const titulo = fase.id === "fase3"
    ? `<div class="empty-note" style="border-color:#fbd000; text-align:center">
         🏆 Em jogo: <b>Título de Campeão do Marcos Kart</b></div>`
    : `<div class="empty-note" style="border-color:#7b3fa0; text-align:center">
         🍌 Em jogo: <b>Título de menos BUNDA</b></div>`;

  let standings = "";
  if (temResultado) {
    const calc = calcularFase(fase);
    standings = `<div class="chave-box" style="margin-top:18px">
        <h4>🏁 Classificação da fase</h4>${standingsTableHTML(calc.ranking, { qualifyTop: 1 })}
        ${copasResumoHTML(calc)}</div>`;
  }

  const pncNota = fase.id === "fase3"
    ? `<p style="margin-top:10px; font-size:.9rem; color:#6b5f3e">🎭 O <b>PNC não pontua</b>, mas pode terminar em 1º e roubar a pontuação de quem faria.</p>`
    : `<p style="margin-top:10px; font-size:.9rem; color:#6b5f3e">🎭 Os dois PNCs entram nesta fase junto com os demais.</p>`;

  return `
    ${titulo}
    <div class="chave-grid" style="margin-top:16px">${colunas}</div>
    ${pncNota}
    ${standings}`;
}

/* ---------- Renderiza o detalhe (chave) de uma fase ---------- */
function renderDetalhe(fase) {
  const statusTxt = { passada: "Passada", atual: "Fase atual", futura: "Próxima" }[fase.status];
  const corpo = fase.tipo === "grupo" ? chaveGrupoHTML(fase) : chaveFinalHTML(fase);
  document.getElementById("detalhe").innerHTML = `
    <div class="detalhe" id="det-panel">
      <div class="det-head">
        <span class="icon">${fase.icon}</span>
        <h2>${fase.nome}</h2>
        <span class="status-badge status-${fase.status}">${statusTxt}</span>
      </div>
      <p style="color:#6b5f3e; margin:4px 0">${fase.descricao}</p>
      ${horariosHTML(fase)}
      <hr style="border:none; border-top:2px dashed #ddd; margin:16px 0" />
      ${corpo}
    </div>`;
}

/* ---------- Seleção de fase ---------- */
function selecionarFase(id, scroll = true) {
  const fase = FASES.find((f) => f.id === id);
  if (!fase) return;
  document.querySelectorAll(".fase-card").forEach((el) => {
    el.classList.toggle("is-selected", el.dataset.fase === id);
  });
  renderDetalhe(fase);
  if (scroll) document.getElementById("det-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Boot ---------- */
(function init() {
  const atual = FASES.find((f) => f.status === "atual") || FASES.find((f) => f.status === "futura") || FASES[0];

  // Destaque da fase atual
  document.getElementById("destaque-atual").innerHTML = `
    <div class="fase-atual-destaque">
      <span class="flag-now">🚦 Fase Atual</span>
      <div style="font-size:2.6rem">${atual.icon}</div>
      <h2>${atual.nome}</h2>
      <p style="opacity:.9">${atual.descricao}</p>
      ${horariosHTML(atual)}
      <button class="btn" data-fase="${atual.id}">Abrir a chave 🏁</button>
    </div>`;

  // Colunas
  document.getElementById("col-passadas").innerHTML =
    FASES.filter((f) => f.status === "passada").map(faseCardHTML).join("") ||
    `<p class="empty-note">Nenhuma fase encerrada ainda.</p>`;
  document.getElementById("col-proximas").innerHTML =
    FASES.filter((f) => f.status === "futura").map(faseCardHTML).join("") ||
    `<p class="empty-note">Sem próximas fases.</p>`;

  // Cliques (delegação)
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fase]");
    if (btn) selecionarFase(btn.dataset.fase);
  });

  // Abre a fase atual por padrão (sem rolar)
  selecionarFase(atual.id, false);
})();
