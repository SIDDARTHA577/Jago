import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { exportReportToExcel } from '../../lib/exportExcel';
import { exportReportToPdf } from '../../lib/exportPdf';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, FileSpreadsheet, FileText } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const getReportDetails = (tabIndex: number) => {
    switch (tabIndex) {
      case 1:
        return {
          title: 'Application-Wise Driver Verification Report',
          fileName: 'Jago_Driver_Verification_Report',
          data: reportService.getApplicationWiseReport(),
          columns: [
            { header: 'Reference', key: 'public_reference' },
            { header: 'Driver Name', key: 'pilot_name' },
            { header: 'Vehicle Plate', key: 'vehicle_number' },
            { header: 'Status', key: 'status' },
            { header: 'Total Docs', key: 'total_documents' },
            { header: 'Verified Docs', key: 'verified_documents' },
            { header: 'Pending Docs', key: 'pending_documents' },
            { header: 'Assigned Verifier', key: 'assigned_verifier' }
          ]
        };
      case 2:
        return {
          title: 'Pending Document Verification Report',
          fileName: 'Jago_Pending_Document_Verification_Report',
          data: reportService.getPendingDocumentsReport(),
          columns: [
            { header: 'Reference', key: 'public_reference' },
            { header: 'Driver Name', key: 'pilot_name' },
            { header: 'Document Name', key: 'document_name' },
            { header: 'Mandatory', key: 'mandatory' },
            { header: 'Version', key: 'version_number' },
            { header: 'Uploaded Date', key: 'uploaded_at' },
            { header: 'Assigned Verifier', key: 'assigned_verifier' }
          ]
        };
      case 3:
        return {
          title: 'Verified Drivers & Applications Report',
          fileName: 'Jago_Verified_Drivers_Report',
          data: reportService.getVerifiedApplicationsReport(),
          columns: [
            { header: 'Reference', key: 'public_reference' },
            { header: 'Driver Name', key: 'pilot_name' },
            { header: 'DL Number', key: 'license_number' },
            { header: 'Vehicle Plate', key: 'vehicle_number' },
            { header: 'Assigned Verifier', key: 'assigned_verifier' },
            { header: 'Status', key: 'status' },
            { header: 'Verified Date', key: 'verified_at' }
          ]
        };
      case 4:
        return {
          title: 'Rejected Documents & Application Report',
          fileName: 'Jago_Rejected_Documents_Report',
          data: reportService.getRejectedReport(),
          columns: [
            { header: 'Reference', key: 'public_reference' },
            { header: 'Driver Name', key: 'pilot_name' },
            { header: 'Document Type', key: 'document_type' },
            { header: 'Version', key: 'version' },
            { header: 'Rejection Reason', key: 'rejection_reason' },
            { header: 'Verifier Remarks', key: 'rejection_remarks' },
            { header: 'Rejected By', key: 'rejected_by' },
            { header: 'Date', key: 'rejected_at' }
          ]
        };
      case 5:
        return {
          title: 'Permission Granted Official Report',
          fileName: 'Jago_Permission_Granted_Report',
          data: reportService.getPermissionGrantedReport(),
          columns: [
            { header: 'Reference', key: 'public_reference' },
            { header: 'Driver Name', key: 'pilot_name' },
            { header: 'DL Number', key: 'license_number' },
            { header: 'Vehicle Plate', key: 'vehicle_number' },
            { header: 'Authorized Approver', key: 'approved_by' },
            { header: 'Approval Remarks', key: 'approval_remarks' },
            { header: 'Permission Granted Date', key: 'permission_granted_at' }
          ]
        };
      case 6:
        return {
          title: 'Verifier-Wise Activity Report',
          fileName: 'Jago_Verifier_Wise_Activity_Report',
          data: reportService.getVerifierActivityReport(),
          columns: [
            { header: 'Verifier Name', key: 'verifier_name' },
            { header: 'Verifier Email', key: 'verifier_email' },
            { header: 'Assigned Apps', key: 'total_assigned_applications' },
            { header: 'Docs Verified', key: 'documents_verified' },
            { header: 'Docs Rejected', key: 'documents_rejected' },
            { header: 'Permissions Granted', key: 'permissions_granted' }
          ]
        };
      default:
        return {
          title: 'Date-Wise Approval & Verification Report',
          fileName: 'Jago_Date_Wise_Activity_Report',
          data: reportService.getDateWiseActivityReport(),
          columns: [
            { header: 'Date', key: 'date' },
            { header: 'Verifications Completed', key: 'verifications' },
            { header: 'Rejections Recorded', key: 'rejections' },
            { header: 'Permissions Granted', key: 'permissions' }
          ]
        };
    }
  };

  const report = getReportDetails(activeTab);

  const handleExportExcel = () => {
    exportReportToExcel({
      fileName: report.fileName,
      reportTitle: report.title,
      columns: report.columns,
      data: report.data
    });
  };

  const handleExportPdf = () => {
    exportReportToPdf({
      fileName: report.fileName,
      reportTitle: report.title,
      columns: report.columns,
      data: report.data
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Operational & Compliance Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export driver verification operational reports to Excel XLSX or PDF format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
          >
            Export Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPdf}
            icon={<FileText className="w-4 h-4" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 1, label: '1. App-Wise Status' },
          { id: 2, label: '2. Pending Verification' },
          { id: 3, label: '3. Verified Apps' },
          { id: 4, label: '4. Rejected Items' },
          { id: 5, label: '5. Permission Granted' },
          { id: 6, label: '6. Verifier Activity' },
          { id: 7, label: '7. Date-Wise Report' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader
          title={report.title}
          description={`Showing ${report.data.length} records`}
        />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {report.columns.map(col => (
                  <th key={col.key} className="p-4">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {report.data.length === 0 ? (
                <tr>
                  <td colSpan={report.columns.length} className="p-8 text-center text-slate-500">
                    No data records currently available for this report.
                  </td>
                </tr>
              ) : (
                report.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {report.columns.map(col => (
                      <td key={col.key} className="p-4 font-mono text-slate-800">
                        {String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
