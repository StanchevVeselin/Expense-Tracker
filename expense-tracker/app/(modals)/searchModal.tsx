import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ScreenWrapper from '@/components/ScreenWrapper'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageServise'
import * as Icons from "phosphor-react-native" 
import Animated from 'react-native-reanimated'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { TransactionType, UserDataType, WalletType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"
import UploadImage from '@/components/UploadImage'
import { createORUpdateWallet, deleteWallet } from '@/services/walletSerice'
import { orderBy, where } from 'firebase/firestore'
import useFetchData from '@/hooks/useFetchData'
import TransactionList from '@/components/TransactionList'

const SearchModal = () => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const {user, updateUserData} = useAuth();
    const router = useRouter();
    const shouldFetch = !!user?.uid;

    const constraints = shouldFetch
    ? [
        where("uid", "==", user?.uid),
        orderBy("date", "desc"),
      ]
    : [];
   
    const {data: allTransactions, loading: transactionsLoading, error} = useFetchData<TransactionType>(
     "transactions",constraints);

     const filteredTransactions = allTransactions.filter((item) => {
        if(search.length>1) {
            if(
                item.category?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) ||
                item.type?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) ||
                item.description?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) 
            ) {
                return true;
            }
            return false;
        }
        return true;
     })

    return (
        <ModalWrapper style={{backgroundColor: colors.neutral900}}>
      <View style={styles.container}>
        <Header title={"Search"} leftIcon={<BackButton />} style={{marginBottom: spacingY._10}} />

      {/* form */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContainer}>
            < Input 
                placeholder='search...'
                value={search}
                placeholderTextColor={colors.neutral400}
                containerStyle={{backgroundColor:colors.neutral800}}
                onChangeText={(value)=> setSearch(value)}
            />
        </View>
        <View>
            <TransactionList
                loading={transactionsLoading}
                data={filteredTransactions}
                emptyListMessage='No transtactions match your search keywords'
            />
        </View>
      </ScrollView>
    </View>

    </ModalWrapper>
  )
}

export default SearchModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,

    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    inputContainer: {
        gap: spacingY._10
    }
})