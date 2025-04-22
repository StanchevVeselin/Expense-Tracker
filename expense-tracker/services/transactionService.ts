import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types"
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServise";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const { id, type, walletId, amount, image } = transactionData;

        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Ivalid Transaction Data" }
        }

        if (id) {
            //    update existing transaction
            const oldTransactionSnapshot = await getDoc(doc(firestore, "transactions", id));
            const oldTransaction =  oldTransactionSnapshot.data() as TransactionType;
            const shouldRevertOriginal = oldTransaction.type != type || oldTransaction.amount != amount || oldTransaction.walletId != walletId;
            if(shouldRevertOriginal) {
                let res = await revertAndUpdateWallets(oldTransaction,Number(amount), type, walletId);
                if(!res.success) return res;
            }
        } else {
            //    update wallet for new transaction
            //    update wallet - function
            let res = await updateWalletForNewTransaction(
                walletId!,
                Number(amount!),
                type
            );

            if (!res.success) return res;
        }

        if (image) {
            const imageUploadRes = await uploadFileToCloudinary(image, "transactions");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to upload receipt" };
            }
            transactionData.image = imageUploadRes.data;
        }

        const transactionRef = id? doc(firestore,"transactions",id) : doc(collection(firestore,"transactions"));

        await setDoc(transactionRef, transactionData, {merge: true});

        return { success: true, data: {...transactionData, id: transactionRef.id}};
    } catch (error: any) {
        console.log("Transaction Service:Creating or updating transactions", error);

        return { success: false, msg: error.message };
    }
}

const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);

        if (!walletSnapshot.exists()) {
            console.log("Transaction Service: Error updating wallet for the new transaction");
            return { success: false, msg: "Wallet not found" };
        }

        const walletData = walletSnapshot.data() as WalletType;

        if (type == "expense" && walletData.amount! - amount < 0) {
            return { success: false, msg: "Selected wallet don't have enough balance" };
        }

        const updateType = type == "income" ? "totalIncome" : "totalExpenses";

        const updatedWalletAmount = type == "income"
            ? Number(walletData.amount) + amount
            : Number(walletData.amount) - amount;

        const updatedTotals = type == "income"
            ? Number(walletData.totalIncome) + amount
            : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        })
        return { success: true };
    } catch (error: any) {
        console.log("Transaction Service: Error updating wallet for the new transaction", error);
        return { success: false, msg: error.message };
    }

}

const revertAndUpdateWallets = async (
    oldTransaction: TransactionType
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);

        if (!walletSnapshot.exists()) {
            console.log("Transaction Service: Error updating wallet for the new transaction");
            return { success: false, msg: "Wallet not found" };
        }

        const walletData = walletSnapshot.data() as WalletType;

        if (type == "expense" && walletData.amount! - amount < 0) {
            return { success: false, msg: "Selected wallet don't have enough balance" };
        }

        const updateType = type == "income" ? "totalIncome" : "totalExpenses";

        const updatedWalletAmount = type == "income"
            ? Number(walletData.amount) + amount
            : Number(walletData.amount) - amount;

        const updatedTotals = type == "income"
            ? Number(walletData.totalIncome) + amount
            : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        })
        return { success: true };
    } catch (error: any) {
        console.log("Transaction Service: Error updating wallet for the new transaction", error);
        return { success: false, msg: error.message };
    }

}

