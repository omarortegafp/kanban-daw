/*
 * Kanban DAW06 - Gestió de Tasques
 * Issues 2 + 3 + 4: Persistència + CRUD + Filtres/Estadístiques
 * Clau localStorage: 'tasquesKanban'
 */

// ========= CONFIGURACIÓ GLOBAL =========
const STORAGE_KEY = "tasquesKanban";
let tasques = [];
let editantId = null;

// ========= ISSUE 2: PERSISTÈNCIA =========

/**
 * Carrega les tasques des de localStorage
 * @returns {Array} Array de tasques o array buit
 */
function carregarTasques() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error carregant tasques:", err);
    return [];
  }
}

/**
 * Guarda les tasques a localStorage
 * @param {Array} llistaTasques - Array de tasques a guardar
 */
function guardarTasques(llistaTasques) {
  try {
    if (!Array.isArray(llistaTasques)) {
      throw new Error("guardarTasques: s'espera un array");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(llistaTasques));
  } catch (err) {
    console.error("Error guardant tasques:", err);
  }
}

// ========= ISSUE 3: CRUD =========

/**
 * Crea una nova tasca i la guarda
 * @param {Object} dades - { titol, descripcio, prioritat, dataVenciment }
 */
function crearTasca(dades) {
  const novaTasca = {
    id: String(Date.now()),
    titol: dades.titol,
    descripcio: dades.descripcio || "",
    prioritat: dades.prioritat || "mitjana",
    dataVenciment: dades.dataVenciment || "",
    estat: "perFer",
    creatEl: new Date().toISOString(),
  };
  tasques.push(novaTasca);
  guardarTasques(tasques);
  return novaTasca;
}

/**
 * Actualitza una tasca existent
 * @param {string} id - ID de la tasca
 * @param {Object} dades - Noves dades
 */
function editarTasca(id, dades) {
  const idx = tasques.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasques[idx] = { ...tasques[idx], ...dades };
  guardarTasques(tasques);
  return tasques[idx];
}

/**
 * Elimina una tasca per ID amb confirmació
 * @param {string} id - ID de la tasca a eliminar
 */
function eliminarTasca(id) {
  if (!confirm("Vols eliminar aquesta tasca?")) return;
  tasques = tasques.filter((t) => t.id !== id);
  guardarTasques(tasques);
  console.log("Tasca eliminada:", id);
}

/**
 * Carrega les dades d'una tasca al formulari per editar-la
 * @param {Object} tasca - La tasca a editar
 */
function carregarPerEditar(tasca) {
  document.getElementById("titol").value = tasca.titol || "";
  document.getElementById("descripcio").value = tasca.descripcio || "";
  document.getElementById("prioritat").value = tasca.prioritat || "mitjana";
  document.getElementById("data-venciment").value = tasca.dataVenciment || "";

  editantId = tasca.id;
  const btnSubmit = document.getElementById("btn-submit");
  if (btnSubmit) btnSubmit.textContent = "Guardar Canvis";
  const btnCancel = document.getElementById("btn-cancelar");
  if (btnCancel) btnCancel.classList.remove("hidden");
}

// ========= ISSUE 4: FILTRES I CERCA =========

/**
 * Obté les tasques filtrades segons els criteris actius
 * @returns {Array} Array de tasques filtrades
 */
function obtenirTasquesFiltrades() {
  const filtreEstat = document.getElementById("filtre-estat")?.value || "tots";
  const filtrePrioritat = document.getElementById("filtre-prioritat")?.value || "totes";
  const cercaText = document.getElementById("cerca-text")?.value.trim().toLowerCase() || "";

  return tasques.filter((tasca) => {
    // Filtre per estat
    if (filtreEstat !== "tots" && tasca.estat !== filtreEstat) return false;

    // Filtre per prioritat
    if (filtrePrioritat !== "totes" && tasca.prioritat !== filtrePrioritat) return false;

    // Cerca de text (títol o descripció)
    if (cercaText) {
      const titol = (tasca.titol || "").toLowerCase();
      const descripcio = (tasca.descripcio || "").toLowerCase();
      if (!titol.includes(cercaText) && !descripcio.includes(cercaText)) return false;
    }

    return true;
  });
}

// ========= ISSUE 4: ESTADÍSTIQUES =========

/**
 * Actualitza el panell d'estadístiques
 * Calcula sobre el total de tasques (no filtrades)
 */
function actualitzarEstadistiques() {
  const total = tasques.length;
  const perFer = tasques.filter((t) => t.estat === "perFer").length;
  const enCurs = tasques.filter((t) => t.estat === "enCurs").length;
  const fet = tasques.filter((t) => t.estat === "fet").length;
  const percentatge = total === 0 ? 0 : Math.round((fet / total) * 100);

  // Actualitza el panell lateral d'estadístiques
  const elTotal = document.getElementById("total-tasques");
  const elPerFer = document.getElementById("count-perFer");
  const elEnCurs = document.getElementById("count-enCurs");
  const elFet = document.getElementById("count-fet");
  const elPercentatge = document.getElementById("percentatge-completat");

  if (elTotal) elTotal.textContent = total;
  if (elPerFer) elPerFer.textContent = perFer;
  if (elEnCurs) elEnCurs.textContent = enCurs;
  if (elFet) elFet.textContent = fet;
  if (elPercentatge) elPercentatge.textContent = `${percentatge}%`;

  // Actualitza els comptadors de les capçaleres de les columnes (correcció Issue 5)
  const elPerFerHeader = document.getElementById("count-perFer-header");
  const elEnCursHeader = document.getElementById("count-enCurs-header");
  const elFetHeader = document.getElementById("count-fet-header");

  if (elPerFerHeader) elPerFerHeader.textContent = perFer;
  if (elEnCursHeader) elEnCursHeader.textContent = enCurs;
  if (elFetHeader) elFetHeader.textContent = fet;
}

// ========= RENDERITZACIÓ (ISSUE 3 + 4) =========

/**
 * Pinta les tasques a les columnes segons el seu estat
 * Utilitza les tasques FILTRADES, no totes
 */
function renderTauler() {
  const tasquesAMostrar = obtenirTasquesFiltrades();
  const colPerFer = document.getElementById("col-perFer");
  const colEnCurs = document.getElementById("col-enCurs");
  const colFet = document.getElementById("col-fet");

  if (!colPerFer || !colEnCurs || !colFet) return;

  // Netejar columnes
  colPerFer.innerHTML = "";
  colEnCurs.innerHTML = "";
  colFet.innerHTML = "";

  // Si no hi ha tasques (filtrades), mostrar missatge
  if (tasquesAMostrar.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.className = "text-gray-400 text-sm text-center italic py-4";
    placeholder.textContent =
      tasques.length === 0 ? "Cap tasca. Crea-ne una!" : "Cap tasca coincideix amb els filtres.";
    colPerFer.appendChild(placeholder.cloneNode(true));
    colEnCurs.appendChild(placeholder.cloneNode(true));
    colFet.appendChild(placeholder.cloneNode(true));

    // Actualitzar estadístiques encara que no hi hagi resultats visibles
    actualitzarEstadistiques();
    return;
  }

  // Pintar cada tasca FILTRADA
  tasquesAMostrar.forEach((tasca) => {
    const card = document.createElement("div");
    // Classes dinàmiques per prioritat
    let borderClass = "border-l-green-500"; // Baixa per defecte
    if (tasca.prioritat === "alta") borderClass = "border-l-red-500";
    else if (tasca.prioritat === "mitjana") borderClass = "border-l-yellow-500";

    card.className = `tasca-card bg-white p-4 rounded-lg shadow mb-3 border-l-4 ${borderClass}`;
    card.dataset.id = tasca.id;

    card.innerHTML = `
      <h4 class="font-semibold text-gray-800 mb-1">${tasca.titol}</h4>
      ${tasca.descripcio ? `<p class="text-sm text-gray-600 mb-2">${tasca.descripcio}</p>` : ""}
      ${tasca.dataVenciment ? `<p class="text-xs text-gray-500 mb-2">${tasca.dataVenciment}</p>` : ""}
      <div class="flex flex-wrap gap-2 mt-2">
        <select class="select-estat text-sm border rounded px-2 py-1 bg-white" data-id="${tasca.id}">
          <option value="perFer" ${tasca.estat === "perFer" ? "selected" : ""}>Per fer</option>
          <option value="enCurs" ${tasca.estat === "enCurs" ? "selected" : ""}>En curs</option>
          <option value="fet" ${tasca.estat === "fet" ? "selected" : ""}>Fet</option>
        </select>
        <button class="btn-editar text-blue-600 hover:text-blue-800 text-sm font-medium" data-id="${tasca.id}">Editar</button>
        <button class="btn-eliminar text-red-600 hover:text-red-800 text-sm font-medium" data-id="${tasca.id}">Eliminar</button>
      </div>
    `;

    // Afegir a la columna corresponent
    if (tasca.estat === "perFer") colPerFer.appendChild(card);
    else if (tasca.estat === "enCurs") colEnCurs.appendChild(card);
    else colFet.appendChild(card);
  });

  // Afegir events als botons dinàmics
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const tasca = tasques.find((t) => t.id === id);
      if (tasca) carregarPerEditar(tasca);
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      eliminarTasca(id);
      renderTauler(); // Re-renderitzar per aplicar filtres
    });
  });

  document.querySelectorAll(".select-estat").forEach((select) => {
    select.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const tasca = tasques.find((t) => t.id === id);
      if (tasca) {
        tasca.estat = e.target.value;
        guardarTasques(tasques);
        renderTauler();
      }
    });
  });

  // Actualitzar estadístiques després de renderitzar
  actualitzarEstadistiques();
}

// ========= GESTIÓ DEL FORMULARI =========

function gestionarSubmitForm(e) {
  e.preventDefault();
  const titol = document.getElementById("titol")?.value.trim();

  if (!titol) {
    alert("El títol és obligatori");
    return;
  }

  const dades = {
    titol,
    descripcio: document.getElementById("descripcio")?.value.trim() || "",
    prioritat: document.getElementById("prioritat")?.value || "mitjana",
    dataVenciment: document.getElementById("data-venciment")?.value || "",
  };

  if (editantId) {
    // Mode edició
    editarTasca(editantId, dades);
    editantId = null;
    const btnSubmit = document.getElementById("btn-submit");
    if (btnSubmit) btnSubmit.textContent = "Crear Tasca";
    const btnCancel = document.getElementById("btn-cancelar");
    if (btnCancel) btnCancel.classList.add("hidden");
  } else {
    // Mode creació
    crearTasca(dades);
  }

  e.target.reset();
  renderTauler(); // Això crida actualitzarEstadistiques() internament
}

function gestionarCancelForm() {
  const form = document.getElementById("form-tasca");
  if (form) form.reset();
  editantId = null;
  const btnSubmit = document.getElementById("btn-submit");
  if (btnSubmit) btnSubmit.textContent = "Crear Tasca";
  const btnCancel = document.getElementById("btn-cancelar");
  if (btnCancel) btnCancel.classList.add("hidden");
}

// ========= INICIALITZACIÓ =========

document.addEventListener("DOMContentLoaded", () => {
  // Carregar dades de localStorage
  tasques = carregarTasques();

  // Configurar formulari
  const form = document.getElementById("form-tasca");
  if (form) form.addEventListener("submit", gestionarSubmitForm);

  const btnCancel = document.getElementById("btn-cancelar");
  if (btnCancel) btnCancel.addEventListener("click", gestionarCancelForm);

  // ISSUE 4: Event listeners per als filtres
  const filtreEstat = document.getElementById("filtre-estat");
  const filtrePrioritat = document.getElementById("filtre-prioritat");
  const cercaText = document.getElementById("cerca-text");

  if (filtreEstat) filtreEstat.addEventListener("change", renderTauler);
  if (filtrePrioritat) filtrePrioritat.addEventListener("change", renderTauler);
  if (cercaText) cercaText.addEventListener("input", renderTauler);

  // Renderitzar tauler inicial
  renderTauler();

  console.log("App inicialitzada. Tasques carregades:", tasques.length);
});

// ========= EXPOSAR PER PROVES =========
window.carregarTasques = carregarTasques;
window.guardarTasques = guardarTasques;
window.crearTasca = crearTasca;
window.editarTasca = editarTasca;
window.eliminarTasca = eliminarTasca;
window.renderTauler = renderTauler;
window.obtenirTasquesFiltrades = obtenirTasquesFiltrades;
window.actualitzarEstadistiques = actualitzarEstadistiques;
