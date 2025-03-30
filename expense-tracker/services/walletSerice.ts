import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageServise";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createORUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    if(!walletData?.id) {
        // new Wallet
        walletToSave.amount = 0;
        walletToSave.totalIncome = 0;
        walletToSave.totalExpenses = 0;
        walletToSave.created = new Date();
    }

    const walletRef = walletData?.id 
    ? doc(firestore, "wallets", walletData?.id)
    : doc(collection(firestore, "wallets"));

    // udates only the data provided
    await setDoc(walletRef, walletToSave, {merge: true})
    return {success: true, data: {...walletToSave, id: walletRef.id}};
  } catch (error: any) {
    console.log("error creating or updating the  wallett");
    return { success: false, msg: error.message };
  }
};
