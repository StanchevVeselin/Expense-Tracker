import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types"
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServise";
import { createORUpdateWallet } from "./walletSerice";

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
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string,

) => {
    try {
        const originalWalletSnapshot = await getDoc(doc(firestore, "wallets", oldTransaction.walletId)); 
        const originalWallet = originalWalletSnapshot.data() as WalletType;
        
        let newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
        let newWallet = newWalletSnapshot.data() as WalletType;

        const revertType = oldTransaction.type == "income"? "totalIncome" : "totalExpenses";
        const revertIncomeExpenses: number = oldTransaction.type == "income"? -Number(oldTransaction.amount) : Number(oldTransaction.amount)
        const revertedWalletAmount = Number(originalWallet.amount) + revertIncomeExpenses;
        // wallet amount, after the transaction is removed

        const revertIncomeExpensesAmount = Number(originalWallet[revertType]) - Number(oldTransaction.amount);

        if(newTransactionType == "expense") {
            // if user tries convert income to expense on the same wallet
            // or if the user tries to increase the expense amount and don't have enough balance
            if(oldTransaction.walletId == newWalletId && revertedWalletAmount < newTransactionAmount) {
                return {success: false, msg: "The selected wallet don't have enough balance"}
            }

             // if user tries to add expense from a new wallet but the wallet don't have enough balance
             if(newWallet.amount! < newTransactionAmount){
                return {success: false, msg: "The selected wallet don't have enough balance"}
             }
        }

        await createORUpdateWallet({
            id: oldTransaction.walletId,
            amount: revertedWalletAmount,
            [revertType]: revertIncomeExpensesAmount
        });
        // revert completed
        // /////////////////////////////////////////////////////////////

        // refetch the newwallet beacause we may have just updated it
        newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
        newWallet = newWalletSnapshot.data() as WalletType;

        const updateType = newTransactionType == "income" ? "totalIncome" : "totalExpenses";

        const updatedTransactionAmount: number = newTransactionType == "income" ? Number(newTransactionAmount) : -Number(newTransactionAmount);

        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

        const newIncomeExpenseAmount = Number(newWallet[updateType]! + Number(newTransactionAmount));

        await createORUpdateWallet({
            id: newWallet.id,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        })
        return { success: true };
    } catch (error: any) {
        console.log("Transaction Service: Error updating wallet for the new transaction", error);
        return { success: false, msg: error.message };
    }

}

export const deleteTransaction = async (
    transactionId: string,
    walletId: string
) => {
    try{
        const transactionRef = doc(firestore, "transactions", transactionId);
        const transactionSnapshot = await getDoc(transactionRef);

        if(!transactionSnapshot.exists()) {
            return { success: false, msg: "Transaction not found" };
        }

        const transactionData =  transactionSnapshot.data() as TransactionType;

        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;

        // fetch wallet to update amount, totalincome andtotalexpnse
       const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
       const walletData = walletSnapshot.data() as WalletType;

        // check fields to be updated
        const updateType = transactionType == "income" ? "totalIncome" : "totalExpenses";
        const newWalletAmount = walletData?.amount! - (transactionType == "income" ? transactionAmount : -transactionAmount);
        const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

        //  if its expense and and wallet amount can go below zero
        if(transactionType == "expense" && newWalletAmount<0) {
            return { success: false, msg: "You cannot delete this transaction" };
        }

        await createORUpdateWallet({
            id: walletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        })

        await deleteDoc(transactionRef)

        return { success: true };
    }catch (error: any) {
        console.log("Transaction Service: Error updating wallet for the new transaction", error);
        return { success: false, msg: error.message };
    }
}

