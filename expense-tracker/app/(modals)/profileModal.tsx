import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
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

const ProfileModal = () => {
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title='Update Profile' leftIcon={<BackButton />} style={{marginBottom: spacingY._10}} />

      {/* form */}
      <Animated.ScrollView contentContainerStyle={styles.form}>
        <View style={styles.avatarContainer} >
            <Image 
                style={styles.avatar}
                source={getProfileImage(null)}
                contentFit='cover'
                transition={100}
            />
            <TouchableOpacity style={styles.editIcon}>
                <Icons.Pencil size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
        </View>
      </Animated.ScrollView>
    </View>
    </ModalWrapper>
  )
}

export default ProfileModal

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