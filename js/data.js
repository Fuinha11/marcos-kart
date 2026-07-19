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
  { id: "rec3", nome: "Sabryna",             personagem: "", emoji: "🍍", cor: "#f9a825", grupo: "recolonial" },
  { id: "rec4", nome: "Thiagão, aka Vice",   personagem: "", emoji: "🔪", cor: "#039be5", grupo: "recolonial" },
  { id: "rec5", nome: "Rafael",              personagem: "", emoji: "🎮", cor: "#43b047", grupo: "recolonial" },
  { id: "rec6", nome: "Hi my name is Julia", personagem: "", emoji: "🍷", cor: "#7b3fa0", grupo: "recolonial" },

  // ---------- GRUPO DEFENSORIA DAS ORIGENS (Brasil) ----------
  { id: "def1", nome: "Gu",       personagem: "", emoji: "👶🏻", cor: "#2e7d32", grupo: "defensoria" },
  { id: "def2", nome: "Gui",      personagem: "", emoji: "🩺", cor: "#00897b", grupo: "defensoria" },
  { id: "def3", nome: "Daniboy",  personagem: "", emoji: "💪🏾", cor: "#6d4c41", grupo: "defensoria" },
  { id: "def4", nome: "Rena",     personagem: "", emoji: "💅🏻", cor: "#ec407a", grupo: "defensoria" },
  { id: "def5", nome: "Brunão",   personagem: "", emoji: "🧠", cor: "#5e35b1", grupo: "defensoria" },
  { id: "def6", nome: "Mari",     personagem: "", emoji: "🎨", cor: "#fb8c00", grupo: "defensoria" },
  { id: "def7", nome: "Paulinha", personagem: "", emoji: "🍁", cor: "#c62828", grupo: "defensoria" },
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
      { ...COPAS_GRUPO[0], corridas: [
        ["rec1","rec3","rec2","rec5","rec4","rec6"],
        ["rec2","rec1","rec4","rec3","rec6","rec5"],
        ["rec3","rec2","rec1","rec6","rec5","rec4"],
        ["rec1","rec2","rec3","rec4","rec5","rec6"],
      ]},
      { ...COPAS_GRUPO[1], corridas: [
        ["rec2","rec3","rec1","rec5","rec6","rec4"],
        ["rec1","rec4","rec2","rec3","rec5","rec6"],
        ["rec4","rec1","rec3","rec2","rec6","rec5"],
        ["rec2","rec1","rec5","rec3","rec4","rec6"],
      ]},
      { ...COPAS_GRUPO[2], corridas: [
        ["rec1","rec2","rec4","rec3","rec6","rec5"],
        ["rec3","rec1","rec2","rec4","rec5","rec6"],
        ["rec2","rec4","rec1","rec6","rec3","rec5"],
        ["rec1","rec3","rec2","rec5","rec4","rec6"],
      ]},
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
    descricao: "O hu3 hu3 entra na pista. Copa Cogumelo em andamento — faltam Flor de Fogo e a Secreta.",
    quando: {
      data: "Domingo, 19/07",
      horarios: [
        { pais: "Brasília",  flag: "🇧🇷", hora: "15h" },
        { pais: "Lisboa",    flag: "🇵🇹", hora: "19h" },
        { pais: "Alemanha",  flag: "🇩🇪", hora: "20h" },
      ],
    },
    copas: [
      { ...COPAS_GRUPO[0], corridas: [
        ["def1","def2","def3","def4","def5","def6","def7"],
        ["def2","def1","def4","def3","def6","def5","def7"],
        ["def3","def2","def1","def5","def4","def7","def6"],
        ["def1","def3","def2","def6","def5","def4","def7"],
      ]},
      { ...COPAS_GRUPO[1], corridas: [] }, // ainda não disputada
      { ...COPAS_GRUPO[2], corridas: [] }, // ainda não disputada
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
