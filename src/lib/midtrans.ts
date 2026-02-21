import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Snap client for creating transactions
export const snap = new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

// Core API client for checking transaction status
export const coreApi = new midtransClient.CoreApi({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

/**
 * Create a Snap transaction for payment
 */
export async function createSnapTransaction(params: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    itemName: string;
}) {
    const parameter = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.amount,
        },
        customer_details: {
            first_name: params.customerName,
            email: params.customerEmail,
        },
        item_details: [
            {
                id: params.orderId,
                price: params.amount,
                quantity: 1,
                name: params.itemName,
            },
        ],
    };

    const transaction = await snap.createTransaction(parameter);
    return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
    };
}

/**
 * Verify notification signature from Midtrans webhook
 */
export async function verifyNotification(notificationBody: Record<string, unknown>) {
    const statusResponse = await coreApi.transaction.notification(notificationBody);
    return {
        orderId: statusResponse.order_id as string,
        transactionStatus: statusResponse.transaction_status as string,
        fraudStatus: statusResponse.fraud_status as string,
        paymentType: statusResponse.payment_type as string,
        transactionId: statusResponse.transaction_id as string,
        grossAmount: statusResponse.gross_amount as string,
    };
}
