import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the Order interface locally to avoid circular dependencies
// You should ideally import this from a shared types file if available
interface InvoiceOrder {
    orderId: string;
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

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text('WENZE TII NDAKU', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Your Trusted Marketplace', 14, 26);

    // Invoice details
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', 140, 20);

    doc.setFontSize(10);
    doc.text(`Invoice #: ${order.orderId}`, 140, 28);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 34);
    doc.text(`Status: ${order.status.toUpperCase()}`, 140, 40);

    // Line separator
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);

    // Bill To
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 55);
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
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
        const itemData = [
            item.productName,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${item.subtotal.toFixed(2)}`
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
    doc.text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`, 14, finalY);

    doc.setFontSize(12);
    doc.text(`Total Amount: $${order.totalAmount.toFixed(2)}`, 140, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150);
    const pageHeight = doc.internal.pageSize.height;
    doc.text('Thank you for shopping with WENZE TII NDAKU!', 105, pageHeight - 20, { align: 'center' });
    doc.text('For questions, contact support@wenzetiindaku.com', 105, pageHeight - 15, { align: 'center' });

    // Save PDF
    doc.save(`invoice_${order.orderId}.pdf`);
};
