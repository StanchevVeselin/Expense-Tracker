import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import * as Icons from "phosphor-react-native"
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'


const Register = () => {

    const emailRef = useRef("")
    const passwordRef = useRef("")
    const nameRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const {register: registerUser} = useAuth()

    const handleSubmit = async () => {
        if(!emailRef.current || !passwordRef.current || !nameRef.current) {
            console.log("emty fields");
            Alert.alert('Sign up', 'Please fill all the fields')
            return
        }
        setIsLoading(true)
        const res = await registerUser(emailRef.current, passwordRef.current, nameRef.current)
        
        setIsLoading(false)
        console.log(res);
        if(!res.success) {
            Alert.alert("Sign in", "Please fill all the fields")
        }
    }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
         {/* back button */}
         <BackButton iconSize={28} />
         <View style={{gap: 5, marginTop: spacingY._20}}>
            <Typo>Let's</Typo>
            <Typo>get started</Typo>
         </View>

         {/* form */}
         <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
                Create an account to track your expenses
            </Typo>
            {/* Input */}
            <Input 
                placeholder='Enter your name'
                onChangeText={(value) => (nameRef.current = value)}
                icon={<Icons.User size={verticalScale(26)} color={colors.neutral300}  weight='fill'/>}
            />

            <Input 
                placeholder='Enter your email'
                onChangeText={(value) => (emailRef.current = value)}
                icon={<Icons.At size={verticalScale(26)} color={colors.neutral300}  weight='fill'/>}
            />

            <Input 
                placeholder='Enter your password'
                secureTextEntry
                onChangeText={(value) => (passwordRef.current = value)}
                icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300}  weight='fill'/>}
            />

            <Button loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight={"700"} color={colors.black} size={21}>Sign up</Typo>
            </Button>
         </View>
         {/* footer */}
         <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <Pressable onPress={()=> router.navigate("/(auth)/login")}>
                <Typo fontWeight={"700"} color={colors.primary} size={15}>Login</Typo>
            </Pressable>
         </View>
      </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text,
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15)
    }
})