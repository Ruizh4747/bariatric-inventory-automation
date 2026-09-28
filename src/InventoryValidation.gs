// Handles UI interactions, dependent dropdowns, and real-time stock validation
function onEdit(e) {
  const ss = e.source;
  const sheet = ss.getActiveSheet();
  const range = e.range;
  
  const HOJA_CONSUMO = "Consumo";
  const HOJA_DATA_LOTES = "DB_LOTES";
  const HOJA_PUENTE_QX = "DATA_IMPORT_QX"; 
  
  const COL_CODIGO = 2; // B
  const COL_LOTE = 4;   // D
  const COL_CANT = 5;   // E

  const fila = range.getRow();
  if (fila < 2 || sheet.getName() !== HOJA_CONSUMO) return;

  // --- 1. DYNAMIC DROPDOWNS LOGIC ---
  if (range.getColumn() === COL_CODIGO) {
    const codigoSeleccionado = range.getValue();
    const celdaLote = sheet.getRange(fila, COL_LOTE);

    if (codigoSeleccionado === "") {
      celdaLote.clearContent();
      celdaLote.clearDataValidations();
      return;
    }

    const dbLotes = ss.getSheetByName(HOJA_DATA_LOTES);
    const datos = dbLotes.getRange("A1:B" + dbLotes.getLastRow()).getValues();
    
    let listaLotes = datos
      .filter(filaData => filaData[1] == codigoSeleccionado) 
      .map(filaData => filaData[0]); 

    if (listaLotes.length > 0) {
      const regla = SpreadsheetApp.newDataValidation()
        .requireValueInList(listaLotes, true)
        .setAllowInvalid(false)
        .build();
      
      celdaLote.setDataValidation(regla);
      celdaLote.setValue(listaLotes.length === 1 ? listaLotes[0] : "Seleccione Lote...");
    } else {
      celdaLote.setValue("SIN LOTES");
      celdaLote.clearDataValidations();
    }
  }

  // --- 2. STOCK ALERT LOGIC (PREVENTS NEGATIVE INVENTORY) ---
  if (range.getColumn() === COL_LOTE || range.getColumn() === COL_CANT) {
    const codigo = sheet.getRange(fila, COL_CODIGO).getValue().toString().trim();
    const lote = sheet.getRange(fila, COL_LOTE).getValue().toString().trim();
    const cantidadPedida = sheet.getRange(fila, COL_CANT).getValue();
    
    const celdaLote = sheet.getRange(fila, COL_LOTE);
    const celdaCant = sheet.getRange(fila, COL_CANT);

    if (codigo && lote !== "" && lote !== "Seleccione Lote..." && lote !== "SIN LOTES") {
      const hojaQx = ss.getSheetByName(HOJA_PUENTE_QX);
      if (!hojaQx) return;
      
      const datosQx = hojaQx.getRange(2, 1, hojaQx.getLastRow(), 6).getValues();
      let stockDisponible = 0;
      let encontrado = false;

      for (let i = 0; i < datosQx.length; i++) {
        if (datosQx[i][0].toString().trim() === codigo && datosQx[i][1].toString().trim() === lote) {
          stockDisponible = Number(datosQx[i][5]); 
          encontrado = true;
          break;
        }
      }

      if (encontrado) {
        if (stockDisponible <= 0) {
          SpreadsheetApp.getUi().alert("❌ LOTE AGOTADO", `El lote [${lote}] no tiene existencias en el sistema (Stock: 0).`, SpreadsheetApp.getUi().ButtonSet.OK);
          celdaLote.setBackground("#ffcccc");
          return;
        }
        if (range.getColumn() === COL_CANT && cantidadPedida > stockDisponible) {
          SpreadsheetApp.getUi().alert("⚠️ SALDO INSUFICIENTE", `Solo quedan ${stockDisponible} unidades del lote [${lote}].\nNo puedes registrar ${cantidadPedida}.`, SpreadsheetApp.getUi().ButtonSet.OK);
          celdaCant.setBackground("#ffcccc");
        } else {
          celdaLote.setBackground(null);
          celdaCant.setBackground(null);
        }
      }
    }
  }
}
