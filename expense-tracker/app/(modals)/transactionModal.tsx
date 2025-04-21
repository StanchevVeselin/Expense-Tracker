import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageServise";
import * as Icons from "phosphor-react-native";
import Animated from "react-native-reanimated";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { TransactionType, UserDataType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import UploadImage from "@/components/UploadImage";
import { createORUpdateWallet, deleteWallet } from "@/services/walletSerice";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionType } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const getValidDate = (value: any): Date => {
  if (value instanceof Date) return value;
  if (value?.toDate) return value.toDate(); // Firebase Timestamp
  return new Date(value);
};

const TransactionModal = () => {
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setshowDatePicker] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const onDateChange = (event: any, selectedDate?: any) => {
    const currentDate = selectedDate || getValidDate(transaction.date);
    setTransaction({ ...transaction, date: currentDate });
    setshowDatePicker(Platform.OS == "ios" ? true : false);
  };

  const showAndroidDatePicker = () => {
    const currentDate =
      transaction.date instanceof Date
        ? transaction.date
        : new Date(getValidDate(transaction.date));

    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: onDateChange,
      mode: "date",
      is24Hour: true,
    });
  };

  // useEffect(() => {
  //     if(oldTransaction?.id) {
  //         setTransaction({
  //             name: oldTransaction?.name,
  //             image: oldTransaction?.image,
  //         })
  //     }
  // },[])

  const onSubmit = async () => {
   const {type,image,description,category,walletId,amount,date} = transaction;

   if(!walletId || !date || !amount || (type == 'expense' && !category)) {
    Alert.alert("Transactions", "Please fill all the fields");
    return;
   }

   let transactionData: TransactionType = {
    type,
    amount,
    description,
    category,
    date,
    walletId,
    image,
    uid: user?.uid
   }
   console.log(transactionData);
   
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \nThis action will remove all the transactions!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete is canceled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* transaction types */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Type</Typo>

            {/* dropdown */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              //   placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropDownIcon}
              data={transactionType}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownitemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropdownListContainer}
              //   placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>

          {/* wallets input */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Wallet</Typo>

            {/* dropdown */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropDownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownitemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder="Select wallet"
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {/* expense categories */}
          {transaction.type == "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Expense category</Typo>
              <Dropdown
                style={styles.dropDownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropDownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropDownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownitemText}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder="Select category"
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          {/* date picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Date</Typo>

            {/* { showDatePicker && (
                        <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                            <DateTimePicker
                                themeVariant="dark"
                                value={transaction.date as Date}
                                textColor={colors.white}
                                mode="date"
                                display={Platform.OS == 'ios' ? "spinner" : "default"}
                                onChange={onDateChange}
                               
                            />
                            {
                                Platform.OS == "ios" && (
                                    <TouchableOpacity
                                        style={styles.datePickerButton}
                                        onPress={()=>setshowDatePicker(false)}
                                    >
                                        <Typo size={15} fontWeight={"500"}>
                                            OK
                                        </Typo>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    )}                 */}

            {Platform.OS === "android" ? (
              <TouchableOpacity
                onPress={showAndroidDatePicker}
                style={styles.dateInput}
              >
                <Typo>
                  {getValidDate(transaction.date).toLocaleDateString()}
                </Typo>
              </TouchableOpacity>
            ) : (
              showDatePicker && (
                <View style={styles.iosDatePicker}>
                  <DateTimePicker
                    themeVariant="dark"
                    value={getValidDate(transaction.date)}
                    textColor={colors.white}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                  />
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setshowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      OK
                    </Typo>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
          {/* amount */}
          <View style={styles.inputContainer} >
            <Typo color={colors.neutral200} size={16}>Amount</Typo>
            <Input
              // placeholder='Salary'
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>
            {/* description */}
        <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>Description</Typo>
                <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>

            <Input
              // placeholder='Salary'
              value={transaction.description}
              multiline
              containerStyle={{
                    flexDirection: "row",
                    height: verticalScale(100),
                    alignItems: "flex-start",
                    paddingVertical: 15
                }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>Receipt</Typo>
                <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>
            {/* image input */}
            <UploadImage
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._5,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: "red"
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownitemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropDownPlaceholder: {
    color: colors.white,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
