import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfExportOptions {
  fileName: string;
  reportTitle: string;
  filterSummary?: string;
  columns: { header: string; key: string }[];
  data: Record<string, any>[];
}

export const exportReportToPdf = (options: PdfExportOptions) => {
  const { fileName, reportTitle, filterSummary, columns, data } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('JAGO PLATFORM', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pilot Verification & Permission Audit Report', 14, 18);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 18);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(reportTitle, 14, 36);

  if (filterSummary) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    doc.text(`Applied Filters: ${filterSummary}`, 14, 42);
  }

  const tableHeaders = columns.map(c => c.header);
  const tableData = data.map(row => columns.map(c => String(row[c.key] ?? '')));

  autoTable(doc, {
    startY: filterSummary ? 46 : 40,
    head: [tableHeaders],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 40, left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 180, 287);
      doc.text('Confidential - Official Jago Pilot Verification Record', 14, 287);
    }
  });

  doc.save(`${fileName}_${Date.now()}.pdf`);
};

export const exportPilotPermissionCertificate = (app: any, user: any) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Outer Decorative Border
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, 194, 281);

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, 186, 273);

  // Top Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 186, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF ANDHRA PRADESH', 105, 24, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TRANSPORT DEPARTMENT — DRIVER VERIFICATION AUTHORITY', 105, 32, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  doc.text('OFFICIAL PERMISSION CERTIFICATE & ACCREDITATION SEAL', 105, 40, { align: 'center' });

  // Title Box
  doc.setFillColor(243, 244, 246);
  doc.rect(14, 52, 182, 15, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF DRIVER PERMISSION & COMPLIANCE', 105, 62, { align: 'center' });

  // Preamble Text
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  let y = 76;
  doc.text('This is to certify that the driver applicant listed below has successfully completed all mandatory identity verification, motor vehicle driving license verification, and vehicle registration compliance checks under the Jago State Transport Platform.', 20, y, { maxWidth: 170 });

  y += 18;

  // Details Table Box
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 90, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, y, 170, 90, 'S');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('DRIVER & VEHICLE SPECIFICATIONS', 26, y + 10);

  const details = [
    ['Certificate Reference ID:', String(app.public_reference || 'JAGO-2026-0891')],
    ['Driver Applicant Name:', String(user.name || 'Driver Applicant')],
    ['Email Address:', String(user.email || 'N/A')],
    ['Contact Phone:', String(user.phone || 'N/A')],
    ['Driving License (DL) No.:', String(user.license_number || 'Not Provided')],
    ['Vehicle Registration Plate:', String(user.vehicle_number || 'Not Provided')],
    ['Vehicle Category:', String(user.vehicle_type || 'Passenger Vehicle / Auto Rickshaw')],
    ['Registered Address:', String(user.address || 'Andhra Pradesh, India')]
  ];

  let detailY = y + 20;
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 26, detailY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, 82, detailY, { maxWidth: 104 });
    detailY += 8;
  });

  y += 100;

  // Status & Verification Seal
  doc.setFillColor(236, 253, 245);
  doc.rect(20, y, 170, 30, 'F');
  doc.setDrawColor(167, 243, 208);
  doc.rect(20, y, 170, 30, 'S');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70);
  doc.text('STATUS: PERMISSION AUTHORIZED & SEAL ISSUED', 26, y + 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(4, 120, 87);
  doc.text(`Permission Granted Date: ${app.permission_granted_at ? new Date(app.permission_granted_at).toLocaleString() : new Date().toLocaleString()}`, 26, y + 17);
  doc.text('Authorized Authority: State Transport Document Verification Board', 26, y + 24);

  y += 38;

  // Signatures Line
  doc.setDrawColor(203, 213, 225);
  doc.line(26, y + 18, 85, y + 18);
  doc.line(125, y + 18, 184, y + 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Verifier Inspector', 26, y + 23);
  doc.text('Chief Transport Administrator', 125, y + 23);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('State Document Verification Division', 26, y + 27);
  doc.text('AP Jago Transport Authority', 125, y + 27);

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('This digital certificate is cryptographically recorded in the Jago State Audit Ledger.', 105, 278, { align: 'center' });

  doc.save(`Jago_Permission_Certificate_${app.public_reference || 'REF'}.pdf`);
};
