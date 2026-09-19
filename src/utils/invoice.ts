import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import i18n from '@/lib/i18n';
import { formatDate, formatMoney, formatPaymentMethod, formatStatus } from '@/lib/format';

// jsPDF's built-in fonts can't draw the narrow/no-break spaces Intl uses in French numbers.
const pdfText = (value: string): string => value.replace(/[  ]/g, ' ');

// Define the Order interface locally to avoid circular dependencies
// You should ideally import this from a shared types file if available
interface InvoiceOrder {
    orderId: string;
    orderNumber?: string | null;
    createdAt: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
        address?: any;
    };
    items: Array<{
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    status: string;
}

export const generateInvoicePDF = (order: InvoiceOrder) => {
    const doc = new jsPDF();

    // Set fonts
    doc.setFont('helvetica', 'bold');

    // Required DRC company registration header — exact text/order per regulation.
    // Must appear top-left on every customer receipt/document.
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('WENZE TII NDAKU Marketplace.', 14, 16);
    doc.text('ID National N*: 01-S9502-N00001N.', 14, 22);
    doc.text('Kinshasa, R.D. CONGO.', 14, 28);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text('wenzetiindaku@outlook.com | +32 495 84 68 66', 14, 34);

    // Invoice details
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(pdfText(i18n.t('invoice.title')), 140, 20);

    doc.setFontSize(10);
    doc.text(pdfText(i18n.t('invoice.number', { number: order.orderNumber ?? order.orderId })), 140, 28);
    doc.text(pdfText(i18n.t('invoice.date', { date: formatDate(order.createdAt) })), 140, 34);
    doc.text(pdfText(i18n.t('invoice.status', { status: formatStatus(order.status).toUpperCase() })), 140, 40);

    // Line separator
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);

    // Bill To
    doc.setFont('helvetica', 'bold');
    doc.text(pdfText(i18n.t('invoice.billTo')), 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customer.name, 14, 61);
    doc.text(order.customer.email, 14, 67);
    if (order.customer.phone) doc.text(order.customer.phone, 14, 73);

    // Address formatting
    let yPos = 79;
    if (order.customer.address) {
        let addressStr = '';
        if (typeof order.customer.address === 'string') {
            addressStr = order.customer.address;
        } else {
            const addr = order.customer.address;
            const parts = [
                addr.street1,
                addr.street2,
                addr.city,
                addr.state,
                addr.postalCode,
                addr.country
            ].filter(Boolean);
            addressStr = parts.join(', ');
        }

        // Split address if too long
        const splitAddress = doc.splitTextToSize(addressStr, 80);
        doc.text(splitAddress, 14, yPos);
        yPos += (splitAddress.length * 6);
    }

    // Items Table
    const tableColumn = [i18n.t('invoice.item'), i18n.t('invoice.quantity'), i18n.t('invoice.price'), i18n.t('invoice.total')].map(pdfText);
    const tableRows = [];

    order.items.forEach(item => {
        const itemData = [
            item.productName,
            item.quantity,
            pdfText(formatMoney(item.price)),
            pdfText(formatMoney(item.subtotal))
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        startY: yPos + 10,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text(pdfText(i18n.t('invoice.paymentMethod', { method: formatPaymentMethod(order.paymentMethod) })), 14, finalY);

    doc.setFontSize(12);
    doc.text(pdfText(i18n.t('invoice.totalAmount', { amount: formatMoney(order.totalAmount) })), 140, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150);
    const pageHeight = doc.internal.pageSize.height;
    doc.text(pdfText(i18n.t('invoice.thankYou')), 105, pageHeight - 20, { align: 'center' });
    doc.text(pdfText(i18n.t('invoice.questions', { email: 'wenzetiindaku@outlook.com' })), 105, pageHeight - 15, { align: 'center' });

    // Save PDF
    doc.save(`invoice_${order.orderNumber ?? order.orderId}.pdf`);
};
