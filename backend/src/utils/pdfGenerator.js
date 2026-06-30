import PDFDocument from "pdfkit";

import { formatDateIndonesia } from "./formatDate.js";
import { formatRupiah } from "./formatRupiah.js";

const writeSummaryRow = (doc, label, value) => {
  doc.font("Helvetica-Bold").text(label, { continued: true });
  doc.font("Helvetica").text(` ${value}`);
};

export const generateMonthlyReportPdf = (report) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
    });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(20).text("Sadar Uang");
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Laporan Bulanan - ${report.period.label}`)
      .moveDown(0.5)
      .text(`Nama: ${report.user.name}`)
      .text(`Email: ${report.user.email}`)
      .text(`Tanggal cetak: ${formatDateIndonesia(report.printedAt)}`)
      .moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Ringkasan");
    doc.fontSize(11).moveDown(0.5);
    writeSummaryRow(doc, "Total pemasukan:", formatRupiah(report.summary.incomeTotal));
    writeSummaryRow(doc, "Total pengeluaran:", formatRupiah(report.summary.expenseTotal));
    writeSummaryRow(doc, "Sisa uang:", formatRupiah(report.summary.balance));
    writeSummaryRow(doc, "Total transaksi:", String(report.summary.transactionCount));
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Pengeluaran Berdasarkan Kategori");
    doc.font("Helvetica").fontSize(11).moveDown(0.5);

    if (report.categorySummary.length === 0) {
      doc.text("Belum ada pengeluaran pada periode ini.");
    } else {
      report.categorySummary.forEach((item) => {
        doc.text(`${item.category}: ${formatRupiah(item.total)}`);
      });
    }

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text("Daftar Transaksi");
    doc.font("Helvetica").fontSize(10).moveDown(0.5);

    if (report.transactions.length === 0) {
      doc.text("Belum ada transaksi pada periode ini.");
    } else {
      report.transactions.forEach((transaction) => {
        const typeLabel = transaction.type === "income" ? "Uang Masuk" : "Uang Keluar";
        doc.text(
          `${formatDateIndonesia(transaction.date)} | ${typeLabel} | ${transaction.category} | ${transaction.description} | ${formatRupiah(transaction.amount)}`,
        );
      });
    }

    doc.end();
  });
};
