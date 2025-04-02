import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import ScreenWrapper from '@/components/ScreenWrapper'
import { verticalScale } from '@/utils/styling'
import { useAuth } from '@/contexts/authContext'
import * as Icons from "phosphor-react-native" 
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import { useRouter } from 'expo-router'


const Home = () => {
 const {user} = useAuth();
 const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{gap:4}}>
              <Typo size={16} color={colors.neutral400}>Helllo</Typo>
              <Typo size={20} fontWeight={"500"} color={colors.neutral400}>{user?.name}</Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass 
              size={verticalScale(22)}
              color={colors.neutral200}
              weight='bold'
            />
          </TouchableOpacity>
        </View>

        <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
        >
             {/* card */}
             <View>
                <HomeCard/>
             </View>

              <TransactionList data={[1,2,3,4,5,6]} loading={false} emptyListMessage='Not transactions yet' title="Recent Transactions"/>

        </ScrollView>

        <Button 
          style={styles.folatingButton}
          onPress={() => router.push('/(modals)/transactionModal')}
        >
          <Icons.Plus 
            color={colors.black}
            weight='bold'
            size={verticalScale(24)}
          />

        </Button>

      </View>
      
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8)
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10
  },
  searchIcon:{
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius:50
  },
  folatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30)
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap:spacingY._25
  }
})