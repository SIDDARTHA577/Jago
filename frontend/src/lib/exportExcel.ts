import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  fileName: string;
  reportTitle: string;
  filterSummary?: string;
  columns: { header: string; key: string }[];
  data: Record<string, any>[];
}

export const exportReportToExcel = (options: ExcelExportOptions) => {
  const { fileName, reportTitle, filterSummary, columns, data } = options;

  const worksheetData: any[][] = [];

  worksheetData.push(['JAGO PILOT ACCESS & DOCUMENT VERIFICATION PLATFORM']);
  worksheetData.push([reportTitle.toUpperCase()]);
  worksheetData.push([`Generated On: ${new Date().toLocaleString()}`]);
  if (filterSummary) {
    worksheetData.push([`Filters Applied: ${filterSummary}`]);
  }
  worksheetData.push([]);

  worksheetData.push(columns.map(c => c.header));

  data.forEach(row => {
    worksheetData.push(columns.map(c => row[c.key] ?? ''));
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const colWidths = columns.map(c => ({ wch: Math.max(c.header.length + 5, 20) }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');

  XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
};
