/* ============================================================
   MARCOS KART — FUNDO ANIMADO
   Injeta itens do Mario Kart flutuando atrás do conteúdo.
   Incluído em todas as páginas.
   ============================================================ */
(function () {
  const ITENS = ["🍄", "⭐", "🍌", "🐢", "💰", "🏁", "👑", "🔥", "🏆", "💥", "🍄", "⭐"];
  const QTD = 16;

  function montar() {
    if (document.querySelector(".bg-fx")) return;
    const fx = document.createElement("div");
    fx.className = "bg-fx";
    for (let i = 0; i < QTD; i++) {
      const s = document.createElement("span");
      s.className = "bg-item";
      s.textContent = ITENS[i % ITENS.length];
      const dur = 16 + Math.random() * 20;          // 16s a 36s
      s.style.left = (Math.random() * 100).toFixed(2) + "vw";
      s.style.fontSize = (18 + Math.random() * 26).toFixed(0) + "px";
      s.style.animationDuration = dur.toFixed(1) + "s";
      s.style.animationDelay = (-Math.random() * dur).toFixed(1) + "s";
      s.style.setProperty("--drift", (Math.random() * 60 - 30).toFixed(0) + "px");
      fx.appendChild(s);
    }
    document.body.appendChild(fx);
  }

  if (document.body) montar();
  else document.addEventListener("DOMContentLoaded", montar);
})();
