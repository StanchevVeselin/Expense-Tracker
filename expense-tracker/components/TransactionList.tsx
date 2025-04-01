import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TransactionListType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage
}: TransactionListType) => {
  return (
    <View style={styles.container}>
      <Text>TransactionList</Text>
    </View>
  )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17
    },
    list: {
        minHeight: 3
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._12,

        // list with  bacground 
        backgroundColor: colors.neutral800,
        padding:spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: radius._12,
        borderCurve: "continuous"
    },
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3
    }
})