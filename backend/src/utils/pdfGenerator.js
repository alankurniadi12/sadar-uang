import PDFDocument from "pdfkit";

import { formatDateIndonesia } from "./formatDate.js";
import { formatRupiah } from "./formatRupiah.js";

const COLORS = {
  ink: "#12312A",
  muted: "#647067",
  faint: "#EEF5EF",
  border: "#DCE8DE",
  brand: "#1F7A4D",
  danger: "#C2410C",
  blue: "#2563EB",
  white: "#FFFFFF",
};

const PAGE = {
  margin: 38,
  width: 595.28,
  height: 841.89,
};

const CATEGORY_COLORS = [
  COLORS.danger,
  COLORS.brand,
  COLORS.blue,
  "#9333EA",
  "#CA8A04",
  "#0F766E",
  "#BE123C",
];

const formatPercent = (value) => `${Math.round(value)}%`;

const formatCompactRupiah = (amount) => {
  if (amount >= 1000000) {
    const value = amount / 1000000;
    const formatted = Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
    return `Rp ${formatted} jt`;
  }

  if (amount >= 1000) {
    return `Rp ${Math.round(amount / 1000)} rb`;
  }

  return formatRupiah(amount);
};

const ratio = (value, total) => {
  if (!total) return 0;
  return (value / total) * 100;
};

const formatShortDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const ensureSpace = (doc, height) => {
  if (doc.y + height <= PAGE.height - PAGE.margin - 18) return false;
  doc.addPage();
  return true;
};

const drawHeader = (doc, report) => {
  const x = PAGE.margin;
  const y = 30;
  const width = PAGE.width - PAGE.margin * 2;

  doc.roundedRect(x, y, width, 72, 8).fill(COLORS.ink);

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Sadar Uang", x + 18, y + 15);

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#DDEBE2")
    .text(`Laporan Bulanan - ${report.period.label}`, x + 18, y + 42)
    .text(`${report.user.name} | ${report.user.email}`, x + 18, y + 56);

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#C8D8CE")
    .text(`Dicetak ${formatDateIndonesia(report.printedAt)}`, x + width - 172, y + 18, {
      width: 144,
      align: "right",
    });

  doc.y = y + 92;
};

const drawSectionTitle = (doc, title) => {
  ensureSpace(doc, 28);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.ink).text(title, PAGE.margin, doc.y);
  doc.moveDown(0.45);
};

const drawMetricCard = (doc, x, y, width, label, value, color) => {
  doc.roundedRect(x, y, width, 58, 7).fillAndStroke(COLORS.white, COLORS.border);
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted).text(label, x + 11, y + 10, { width: width - 22 });
  doc
    .font("Helvetica-Bold")
    .fontSize(12.5)
    .fillColor(color)
    .text(value, x + 11, y + 29, { width: width - 22, lineBreak: false });
};

const drawSummaryCards = (doc, report) => {
  const { incomeTotal, expenseTotal, balance, transactionCount } = report.summary;
  const gap = 8;
  const width = (PAGE.width - PAGE.margin * 2 - gap * 3) / 4;
  const y = doc.y;

  drawMetricCard(doc, PAGE.margin, y, width, "Pemasukan", formatRupiah(incomeTotal), COLORS.brand);
  drawMetricCard(doc, PAGE.margin + (width + gap), y, width, "Pengeluaran", formatRupiah(expenseTotal), COLORS.danger);
  drawMetricCard(
    doc,
    PAGE.margin + (width + gap) * 2,
    y,
    width,
    "Sisa uang",
    formatRupiah(balance),
    balance >= 0 ? COLORS.brand : COLORS.danger,
  );
  drawMetricCard(doc, PAGE.margin + (width + gap) * 3, y, width, "Transaksi", String(transactionCount), COLORS.ink);

  doc.y = y + 72;
};

const drawCashRatio = (doc, report) => {
  const { incomeTotal, expenseTotal, balance } = report.summary;
  const expenseRatio = ratio(expenseTotal, incomeTotal);
  const balanceRatio = ratio(balance, incomeTotal);
  const x = PAGE.margin;
  const y = doc.y;
  const width = PAGE.width - PAGE.margin * 2;

  doc.roundedRect(x, y, width, 58, 7).fillAndStroke(COLORS.white, COLORS.border);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.ink).text("Rasio terhadap pemasukan", x + 12, y + 10);

  const barX = x + 156;
  const barWidth = width - 285;

  doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted).text("Pengeluaran", x + 12, y + 31);
  doc.roundedRect(barX, y + 32, barWidth, 8, 4).fill("#E9EFEA");
  doc.roundedRect(barX, y + 32, Math.min(barWidth, (expenseRatio / 100) * barWidth), 8, 4).fill(COLORS.danger);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.ink).text(formatPercent(expenseRatio), barX + barWidth + 12, y + 28);

  doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted).text("Sisa uang", x + width - 86, y + 24, {
    width: 74,
    align: "right",
  });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(balance >= 0 ? COLORS.brand : COLORS.danger)
    .text(formatPercent(balanceRatio), x + width - 86, y + 37, { width: 74, align: "right" });

  doc.y = y + 72;
};

const drawCategoryBars = (doc, report, x, y, width, height) => {
  const items = report.categorySummary.slice(0, 7);
  const expenseTotal = report.summary.expenseTotal;
  const rowHeight = 23;
  const barWidth = width - 190;

  doc.roundedRect(x, y, width, height, 7).fillAndStroke(COLORS.white, COLORS.border);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.ink).text("Pengeluaran per Kategori", x + 12, y + 11);

  if (items.length === 0) {
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.muted).text("Belum ada pengeluaran.", x + 12, y + 36);
    return;
  }

  items.forEach((item, index) => {
    const rowY = y + 34 + index * rowHeight;
    const percent = ratio(item.total, expenseTotal);
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

    doc.font("Helvetica-Bold").fontSize(7.8).fillColor(COLORS.ink).text(item.category, x + 12, rowY, {
      width: 72,
      lineBreak: false,
    });
    doc.roundedRect(x + 88, rowY + 2, barWidth, 7, 3.5).fill("#E9EFEA");
    doc.roundedRect(x + 88, rowY + 2, Math.max(3, (percent / 100) * barWidth), 7, 3.5).fill(color);
    doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text(formatPercent(percent), x + width - 92, rowY - 1, {
      width: 24,
      align: "right",
    });
    doc.font("Helvetica-Bold").fontSize(7.4).fillColor(COLORS.ink).text(formatCompactRupiah(item.total), x + width - 61, rowY - 1, {
      width: 49,
      align: "right",
    });
  });
};

const drawDataCharts = (doc, report) => {
  ensureSpace(doc, 214);
  const width = PAGE.width - PAGE.margin * 2;
  const y = doc.y;
  const categoryHeight = 198;

  drawCategoryBars(doc, report, PAGE.margin, y, width, categoryHeight);

  doc.y = y + categoryHeight + 14;
};

const drawTransactionTable = (doc, report) => {
  const columns = {
    date: PAGE.margin,
    type: PAGE.margin + 78,
    category: PAGE.margin + 126,
    description: PAGE.margin + 214,
    amount: PAGE.margin + 408,
  };

  drawSectionTitle(doc, "Detail Transaksi");

  if (report.transactions.length === 0) {
    doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted).text("Belum ada transaksi pada periode ini.");
    return;
  }

  const drawTableHeader = () => {
    ensureSpace(doc, 28);
    const y = doc.y;
    doc.roundedRect(PAGE.margin, y, PAGE.width - PAGE.margin * 2, 22, 5).fill(COLORS.faint);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.ink);
    doc.text("Tanggal", columns.date + 8, y + 7, { width: 64 });
    doc.text("Tipe", columns.type, y + 7, { width: 42 });
    doc.text("Kategori", columns.category, y + 7, { width: 76 });
    doc.text("Catatan", columns.description, y + 7, { width: 184 });
    doc.text("Nominal", columns.amount, y + 7, { width: 72, align: "right" });
    doc.y = y + 28;
  };

  drawTableHeader();

  report.transactions.forEach((transaction) => {
    const addedPage = ensureSpace(doc, 24);

    if (addedPage) {
      drawTableHeader();
    }

    const y = doc.y;
    const typeLabel = transaction.type === "income" ? "Masuk" : "Keluar";
    const amountColor = transaction.type === "income" ? COLORS.brand : COLORS.danger;

    doc.font("Helvetica").fontSize(7.4).fillColor(COLORS.muted);
    doc.text(formatShortDate(transaction.date), columns.date + 8, y, { width: 64, lineBreak: false });
    doc.fillColor(amountColor).font("Helvetica-Bold").text(typeLabel, columns.type, y, { width: 42 });
    doc.fillColor(COLORS.ink).font("Helvetica").text(transaction.category, columns.category, y, {
      width: 78,
      lineBreak: false,
    });
    doc.text(transaction.description, columns.description, y, { width: 184, lineBreak: false });
    doc.font("Helvetica-Bold").fillColor(amountColor).text(formatRupiah(transaction.amount), columns.amount, y, {
      width: 72,
      align: "right",
    });

    doc
      .moveTo(PAGE.margin, y + 17)
      .lineTo(PAGE.width - PAGE.margin, y + 17)
      .strokeColor(COLORS.border)
      .lineWidth(0.4)
      .stroke();

    doc.y = y + 21;
  });
};

const drawFooter = (doc) => {
  const pages = doc.bufferedPageRange();

  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(`Sadar Uang - Halaman ${i + 1} dari ${pages.count}`, PAGE.margin, PAGE.height - 56, {
        width: PAGE.width - PAGE.margin * 2,
        align: "center",
        lineBreak: false,
      });
  }
};

export const generateMonthlyReportPdf = (report) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE.margin,
      bufferPages: true,
    });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, report);
    drawSectionTitle(doc, "Ringkasan Bulanan");
    drawSummaryCards(doc, report);
    drawCashRatio(doc, report);
    drawDataCharts(doc, report);
    drawTransactionTable(doc, report);
    drawFooter(doc);

    doc.end();
  });
};
