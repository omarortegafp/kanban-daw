/*
 * Issue 2: Model de dades i persistència amb localStorage
 * Clau: 'tasquesKanban'
 */

const STORAGE_KEY = "tasquesKanban";

// Model de dades d'una tasca
// { id: string, titol: string, descripcio: string, prioritat: 'baixa'|'mitjana'|'alta', dataVenciment: string, estat: 'perFer'|'enCurs'|'fet', creatEl: string }

let tasques = [];

/**
 * Carrega les tasques des de localStorage
 * @returns {Array} Array de tasques o array buit si no n'hi ha
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

// Inicialització bàsica (Issue 2)
document.addEventListener("DOMContentLoaded", () => {
  tasques = carregarTasques();
  console.log("App inicialitzada. Tasques carregades:", tasques.length);

  // Dades de prova només si està buit (Issue 2)
  if (tasques.length === 0) {
    console.log("No hi ha tasques guardades. App buida.");
  }
});

// Exposar per proves a consola
window.carregarTasques = carregarTasques;
window.guardarTasques = guardarTasques;
