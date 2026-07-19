/* ============================================================
   MARCOS KART — BASE DE DADOS
   ------------------------------------------------------------
   >>> É AQUI QUE VOCÊ EDITA TUDO. <<<
   Nomes, grupos, PNCs e os resultados das corridas.
   Nenhum outro arquivo precisa ser tocado para atualizar o torneio.
   ============================================================ */

/* --- Info geral do torneio (usada na home) --- */
const TORNEIO = {
  nome: "Marcos Kart",
  edicao: "1º Torneio Internacional, Intercontinental e Inter-essante",
  anfitriao: "Wii Familii",
  data: "Domingo, 19/07",
  local: "No seu próprio sofá 🛋️",
  horarios: [
    { pais: "Brasília",  flag: "🇧🇷", hora: "15h" },
    { pais: "Lisboa",    flag: "🇵🇹", hora: "19h" },
    { pais: "Alemanha",  flag: "🇩🇪", hora: "20h" },
  ],
};

/* --- Pontuação por posição (estilo Mario Kart 8 Deluxe) ---
   índice 0 = 1º lugar. Posições além da lista valem 0 pontos. */
const PONTUACAO = [15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/* --- Grupos --- */
const GRUPOS = {
  recolonial: {
    id: "recolonial",
    nome: "Grupo Recolonial",
    lema: "Recolonizados pela imigração (leia: quem tá na Europa) 🌍",
    cor: "#049cd8",
    classe: "grp-recolonial",
  },
  defensoria: {
    id: "defensoria",
    nome: "Defensoria das Origens",
    lema: "Mantém a tradição ativa (leia: Br Br hu3 hu3) 🇧🇷",
    cor: "#43b047",
    classe: "grp-defensoria",
  },
};

/* --- Competidores ---
   Edite 'nome' (troque "A definir" pelos nomes reais).
   'grupo' = 'recolonial' | 'defensoria'
   'participa: false' esconde o piloto (ex.: Sulivan só se confirmar). */
const COMPETIDORES = [
  // ---------- GRUPO RECOLONIAL (Europa) ----------
  { id: "rec1", nome: "Marcos",              personagem: "", emoji: "🏍️", cor: "#e4000f", grupo: "recolonial", anfitriao: true },
  { id: "rec2", nome: "Bruna",               personagem: "", emoji: "💃🏻", cor: "#f06292", grupo: "recolonial" },
  { id: "rec3", nome: "Sabryna",             personagem: "", emoji: "🍍", cor: "#f9a825", grupo: "recolonial", apelido: "byna" },
  { id: "rec4", nome: "Thiagão, aka Vice",   personagem: "", emoji: "🔪", cor: "#039be5", grupo: "recolonial" },
  { id: "rec5", nome: "Rafael",              personagem: "", emoji: "🎮", cor: "#43b047", grupo: "recolonial", wo: true },
  { id: "rec6", nome: "Hi my name is Julia", personagem: "", emoji: "🍷", cor: "#7b3fa0", grupo: "recolonial", wo: true },

  // ---------- GRUPO DEFENSORIA DAS ORIGENS (Brasil) ----------
  { id: "def1", nome: "Gu",       personagem: "", emoji: "👶🏻", cor: "#2e7d32", grupo: "defensoria" },
  { id: "def2", nome: "Gui",      personagem: "", emoji: "🩺", cor: "#00897b", grupo: "defensoria" },
  { id: "def3", nome: "Daniboy",  personagem: "", emoji: "💪🏾", cor: "#6d4c41", grupo: "defensoria" },
  { id: "def4", nome: "Rena",     personagem: "", emoji: "💅🏻", cor: "#ec407a", grupo: "defensoria" },
  { id: "def5", nome: "Brunão",   personagem: "", emoji: "🧠", cor: "#5e35b1", grupo: "defensoria" },
  { id: "def6", nome: "Mari",     personagem: "", emoji: "🎨", cor: "#fb8c00", grupo: "defensoria" },
  { id: "def7", nome: "Paulinha", personagem: "", emoji: "🍁", cor: "#c62828", grupo: "defensoria" },
];

/* --- CPUs do jogo (personagens controlados pela máquina) ---
   Entram nas corridas para a tabela ficar IGUAL à tela do jogo,
   mas NÃO pontuam e não disputam o torneio (npc: true).
   Não ficam em COMPETIDORES de propósito: assim não aparecem na
   página de pilotos nem na classificação geral. getComp() os acha. */
const NPCS = [
  // Torneio 1 (100cc)
  { id: "n_toad",         nome: "Toad",            emoji: "🍄", cor: "#9e9e9e", npc: true },
  { id: "n_babymario",    nome: "Baby Mario",      emoji: "👶", cor: "#9e9e9e", npc: true },
  { id: "n_wendy",        nome: "Wendy",           emoji: "🎀", cor: "#9e9e9e", npc: true },
  { id: "n_villager",     nome: "Villager",        emoji: "🪓", cor: "#9e9e9e", npc: true },
  { id: "n_luigi",        nome: "Luigi",           emoji: "🟢", cor: "#9e9e9e", npc: true },
  { id: "n_pgp",          nome: "Pink Gold Peach", emoji: "👑", cor: "#9e9e9e", npc: true },
  { id: "n_morton",       nome: "Morton",          emoji: "🐢", cor: "#9e9e9e", npc: true },
  { id: "n_babyrosalina", nome: "Baby Rosalina",   emoji: "⭐", cor: "#9e9e9e", npc: true },
  // Torneio 2 (150cc)
  { id: "n_isabelle",     nome: "Isabelle",        emoji: "🐶", cor: "#9e9e9e", npc: true },
  { id: "n_link",         nome: "Link",            emoji: "⚔️", cor: "#9e9e9e", npc: true },
  { id: "n_wario",        nome: "Wario",           emoji: "🧄", cor: "#9e9e9e", npc: true },
  { id: "n_babydaisy",    nome: "Baby Daisy",      emoji: "🌼", cor: "#9e9e9e", npc: true },
  { id: "n_inklinggirl",  nome: "Inkling Girl",    emoji: "🦑", cor: "#9e9e9e", npc: true },
  { id: "n_roy",          nome: "Roy",             emoji: "🐢", cor: "#9e9e9e", npc: true },
  // Torneio 3
  { id: "n_inklingboy",   nome: "Inkling Boy",     emoji: "🐙", cor: "#9e9e9e", npc: true },
  { id: "n_lakitu",       nome: "Lakitu",          emoji: "☁️", cor: "#9e9e9e", npc: true },
  { id: "n_babyluigi",    nome: "Baby Luigi",      emoji: "👶", cor: "#9e9e9e", npc: true },
  { id: "n_catpeach",     nome: "Cat Peach",       emoji: "🐱", cor: "#9e9e9e", npc: true },
  { id: "n_drybowser",    nome: "Dry Bowser",      emoji: "💀", cor: "#9e9e9e", npc: true },
  { id: "n_larry",        nome: "Larry",           emoji: "🐢", cor: "#9e9e9e", npc: true },
  { id: "n_iggy",         nome: "Iggy",            emoji: "👓", cor: "#9e9e9e", npc: true },
];

/* --- Modelos dos 3 torneios de cada fase ---
   Os torneios NÃO são pré-definidos: são escolhidos na hora
   (o último colocado do torneio anterior escolhe o próximo).
   O que muda é a CILINDRADA, que aumenta; o 3º é sempre surpresa.
   - Fases de grupo: 100 → 150 → surpresa
   - Fases finais:   150 → 200 → surpresa                        */
const COPAS_GRUPO = [
  { nome: "A escolher na hora", cc: "100cc",       icon: "🎲", classe: "secreta" },
  { nome: "A escolher na hora", cc: "150cc",       icon: "🎲", classe: "secreta" },
  { nome: "A escolher na hora", cc: "cc surpresa", icon: "❓", classe: "secreta" },
];
const COPAS_FINAL = [
  { nome: "A escolher na hora", cc: "150cc",       icon: "🎲", classe: "secreta" },
  { nome: "A escolher na hora", cc: "200cc",       icon: "🎲", classe: "secreta" },
  { nome: "A escolher na hora", cc: "cc surpresa", icon: "❓", classe: "secreta" },
];

/* ============================================================
   FASES DO TORNEIO
   ------------------------------------------------------------
   status: 'passada' | 'atual' | 'futura'
   tipo:   'grupo'  -> disputa dentro de um grupo
           'final'  -> fase final com classificados + PNCs
   Cada copa tem 'corridas'. Cada corrida é a ORDEM DE CHEGADA:
   um array de ids do 1º ao último lugar. Ex.: ["rec1","rec3","rec2",...]
   O motor calcula os pontos automaticamente.
   Os dados abaixo são DE EXEMPLO — troque pelos resultados reais.
   ============================================================ */
const FASES = [

  /* ---------------- FASE 1: GRUPO RECOLONIAL ---------------- */
  {
    id: "fase1",
    nome: "Fase 1 — Grupo Recolonial",
    icon: "🌍",
    status: "passada",
    tipo: "grupo",
    grupo: "recolonial",
    descricao: "Os recolonizados abrem a temporada. Top 3 avançam para a Grande Final.",
    quando: {
      data: "Domingo, 19/07",
      horarios: [
        { pais: "Brasília",       flag: "🇧🇷", hora: "11h" },
        { pais: "Lisboa",         flag: "🇵🇹", hora: "15h" },
        { pais: "Alemanha (CEST)", flag: "🇩🇪", hora: "16h" },
      ],
    },
    copas: [
      { ...COPAS_GRUPO[0], nome: "1º Torneio", corridas: [
        // Ordem de chegada COMPLETA (12 karts), igual à tela do jogo.
        // Fu = Marcos (rec1) · Bru = Bruna (rec2) · Byna = Sabryna (rec3) · Thiago (rec4)
        // 1ª: Thiago, Bru, Fu, Byna (entre os pilotos)
        ["rec4", "n_toad", "n_babymario", "rec2", "rec1", "n_wendy", "n_villager", "n_luigi", "n_pgp", "rec3", "n_morton", "n_babyrosalina"],
        // 2ª: Thiago, Byna, Fu, Bru
        ["n_wendy", "rec4", "rec3", "rec1", "n_babymario", "n_toad", "rec2", "n_babyrosalina", "n_luigi", "n_pgp", "n_villager", "n_morton"],
        // 3ª: Thiago, Fu, Byna, Bru
        ["rec4", "rec1", "n_babymario", "n_wendy", "rec3", "n_villager", "n_toad", "n_pgp", "rec2", "n_luigi", "n_babyrosalina", "n_morton"],
        // 4ª: Thiago, Bru, Byna, Fu
        ["rec4", "rec2", "rec3", "rec1", "n_babymario", "n_wendy", "n_villager", "n_pgp", "n_babyrosalina", "n_luigi", "n_morton", "n_toad"],
      ] },
      // 2º Torneio (150cc) — só temos o placar final (não corrida a corrida).
      { ...COPAS_GRUPO[1], nome: "2º Torneio", placar: [
        { id: "rec4", pts: 60 },          // Thiago
        { id: "n_isabelle", pts: 41 },
        { id: "rec1", pts: 40 },          // Fu
        { id: "n_link", pts: 32 },
        { id: "rec3", pts: 30 },          // Byna
        { id: "rec2", pts: 28 },          // Bru
        { id: "n_villager", pts: 27 },
        { id: "n_wario", pts: 18 },
        { id: "n_babydaisy", pts: 14 },
        { id: "n_babyrosalina", pts: 13 },
        { id: "n_inklinggirl", pts: 13 },
        { id: "n_roy", pts: 12 },
      ] },
      // 3º Torneio — placar final.
      { ...COPAS_GRUPO[2], nome: "3º Torneio", cc: "150cc invertido", icon: "🪞", classe: "", placar: [
        { id: "rec4", pts: 60 },          // Thiago
        { id: "n_inklingboy", pts: 44 },
        { id: "rec1", pts: 35 },          // Fu
        { id: "rec2", pts: 33 },          // Bru
        { id: "n_link", pts: 31 },
        { id: "rec3", pts: 29 },          // Byna
        { id: "n_lakitu", pts: 23 },
        { id: "n_babyluigi", pts: 21 },
        { id: "n_catpeach", pts: 18 },
        { id: "n_drybowser", pts: 12 },
        { id: "n_larry", pts: 12 },
        { id: "n_iggy", pts: 10 },
      ] },
    ],
  },

  /* ---------------- FASE 2: DEFENSORIA DAS ORIGENS ---------------- */
  {
    id: "fase2",
    nome: "Fase 2 — Defensoria das Origens",
    icon: "🇧🇷",
    status: "atual",
    tipo: "grupo",
    grupo: "defensoria",
    descricao: "O hu3 hu3 defende a tradição. Top 3 avançam para a Grande Final.",
    quando: {
      data: "Domingo, 19/07",
      horarios: [
        { pais: "Brasília",  flag: "🇧🇷", hora: "15h" },
        { pais: "Lisboa",    flag: "🇵🇹", hora: "19h" },
        { pais: "Alemanha",  flag: "🇩🇪", hora: "20h" },
      ],
    },
    copas: [
      { ...COPAS_GRUPO[0], corridas: [] },
      { ...COPAS_GRUPO[1], corridas: [] },
      { ...COPAS_GRUPO[2], corridas: [] },
    ],
  },

  /* ---------------- FASE 3: GRANDE FINAL ---------------- */
  {
    id: "fase3",
    nome: 'Final — "Vencedores Nunca Serão Perdedores"',
    icon: "🏆",
    status: "futura",
    tipo: "final",
    descricao: "Os 3 melhores de cada grupo + 1 PNC por grupo. Disputa pelo título de CAMPEÃO.",
    quando: { data: "A definir", horarios: [] },
    // Classificados vêm dos top 3 de cada grupo (calculado automaticamente).
    // Defina os PNCs escolhidos por cada grupo no início desta fase:
    pncs: {
      recolonial: null,  // ex.: "rec6"
      defensoria: null,  // ex.: "def7"
    },
    copas: [
      { ...COPAS_FINAL[0], corridas: [] },
      { ...COPAS_FINAL[1], corridas: [] },
      { ...COPAS_FINAL[2], corridas: [] },
    ],
  },

  /* ---------------- FASE 4: WHAT A LOOOOOSER ---------------- */
  {
    id: "fase4",
    nome: 'Fase — "What a Loooooser"',
    icon: "🍌",
    status: "futura",
    tipo: "final",
    descricao: "Todos os que sobraram + os 2 PNCs. Disputa pelo título de menos BUNDA (Brincalhão Unânimemente Nomeado Durante Acordo).",
    quando: { data: "A definir", horarios: [] },
    pncs: {
      recolonial: null,
      defensoria: null,
    },
    copas: [
      { ...COPAS_FINAL[0], corridas: [] },
      { ...COPAS_FINAL[1], corridas: [] },
      { ...COPAS_FINAL[2], corridas: [] },
    ],
  },
];
