# 🏎️ Marcos Kart — Wii Familii

Site oficial do **1º Torneio Internacional, Intercontinental e Inter-essante de Marcos Kart**.

🔗 **No ar em:** https://fuinha11.github.io/marcos-kart/

Site estático (HTML/CSS/JS puro, sem build) hospedado no GitHub Pages.

## 📄 Páginas
| Página | Arquivo | O que tem |
|--------|---------|-----------|
| Início | `index.html` | Apresentação, horários, as 3 copas |
| Regras | `regras.html` | Regulamento da CARÁI, PNC, anti-cheat |
| Competidores | `competidores.html` | Pilotos por grupo (gerado dos dados) |
| Fases | `fases.html` | Timeline + chave de cada fase (pontos automáticos) |

## ✏️ Como atualizar o torneio
**Você só edita um arquivo: `js/data.js`.** O resto se calcula sozinho.

- **Nomes dos pilotos** → troque `"A definir"` pelos nomes reais em `COMPETIDORES`.
  - `grupo: "recolonial"` (Europa) ou `"defensoria"` (Brasil).
  - `participa: false` esconde um piloto (ex.: Mademoiselle Sulivan até confirmar).
- **Resultado de uma corrida** → em `FASES`, dentro da copa, adicione a **ordem de chegada**
  (array de ids, do 1º ao último). Exemplo:
  ```js
  ["rec1", "rec3", "rec2", "rec5", "rec4", "rec6"]
  ```
  A pontuação (15/12/10/9…) é aplicada automaticamente pela posição.
- **Trocar a fase atual** → mude o campo `status` da fase para
  `"passada"`, `"atual"` ou `"futura"`.
- **Definir o PNC de uma fase final** → em `fase3`/`fase4`, preencha
  `pncs: { recolonial: "rec6", defensoria: "def7" }`. O PNC aparece marcado e **não pontua**.

> Os resultados que já estão no arquivo são **exemplos** para o site nascer "vivo".
> Apague/edite conforme os jogos reais acontecerem.

## 🖼️ Flyer
Salve a imagem do flyer como **`assets/flyer.png`** para ela aparecer na home
(se o arquivo não existir, a seção some sozinha).

## 🚀 Publicar / atualizar
```bash
git add .
git commit -m "Atualiza resultados"
git push
```
O GitHub Pages republica automaticamente em ~1 minuto.

## 🖥️ Rodar localmente
Basta abrir `index.html` no navegador (duplo clique). Não precisa de servidor.
