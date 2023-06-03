import { saveAs } from "file-saver";
import * as ExcelJs from 'exceljs'

function saveWorkbook(workbook, filename) {
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), filename);
  });
}

export  function handleExport({columns, data, name}) {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet(name);
    worksheet.properties.defaultColWidth = 20;
    worksheet.columns = columns;

    worksheet.addRows(data);
    saveWorkbook(workbook, `${name}.xlsx`);
 }
