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
import { UserDataType, WalletType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"
import UploadImage from '@/components/UploadImage'

const WalletModal = () => {
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null
    });
    const [loading, setLoading] = useState(false);
    const {user, updateUserData} = useAuth();
    const router = useRouter();
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.5
        });

        console.log(result);

        if(!result.canceled) {
            // setUserData({...userData, image: result.assets[0]})
        }
        
    }

    const onSubmit = async () => {
        let {name, image} = wallet;
        if(!name.trim() || !image) {
            Alert.alert("User", "Please fill all the fields")
            return;
        }
        
        setLoading(true);
        const res = await updateUser(user?.uid as string , wallet);
        setLoading(false)
        if(res.success) {
            // user is updated
            updateUserData(user?.uid as string);
            router.back();
        } else {
            Alert.alert("User", res.msg)
        }
    };

    return (
        <ModalWrapper>
      <View style={styles.container}>
        <Header title='New Wallet' leftIcon={<BackButton />} style={{marginBottom: spacingY._10}} />

      {/* form */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            < Input 
                placeholder='Salary'
                value={wallet.name}
                onChangeText={(value)=> setWallet({...wallet, name: value})}
            />
        </View>

        <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
                  {/* image input */}
                  <UploadImage 
                  file={wallet.image} 
                  onClear={() => setWallet({...wallet, image: null})}
                  onSelect={file => setWallet({...wallet, image: file})} 
                  placeholder='Upload image' />
        </View>
      </ScrollView>
    </View>

    <View style={styles.footer} >
        <Button 
            onPress={onSubmit}
            style={{flex: 1}}
            loading={loading}
        >
            <Typo color={colors.black} fontWeight={"700"}>
                Add Wallet
            </Typo>
        </Button>
    </View>
    </ModalWrapper>
  )
}

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20
    },
    footer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: spacingX._20,
        marginBottom: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        borderTopWidth: 1
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,

    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    avatar: {   
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height:0},
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._10
    },
    inputContainer: {
        gap: spacingY._10
    }
})