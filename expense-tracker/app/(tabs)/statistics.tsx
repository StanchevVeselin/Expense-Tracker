import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import {BarChart} from "react-native-gifted-charts"
import Typo from "@/components/Typo";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/authContext";
import { fetchWeeklyStats } from "@/services/transactionService";
import TransactionList from "@/components/TransactionList";


// chartData here from 6.12 minute - expo-linear-gradient
// const barChartData = [
//   {
//     value:40,
//     label: "Mon",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:40, frontColor: colors.rose},
//   {
//     value:50,
//     label: "Tue",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:40, frontColor: colors.rose},
//   {
//     value:75,
//     label: "Wed",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:25, frontColor: colors.rose},
//   {
//     value:30,
//     label: "Thu",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:20, frontColor: colors.rose},
//   {
//     value:60,
//     label: "Fr",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:40, frontColor: colors.rose},
//   {
//     value:65,
//     label: "Sat",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:30, frontColor: colors.rose},
//   {
//     value:65,
//     label: "Sun",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.primary
//   },
//   {value:30, frontColor: colors.rose},
// ]
const Staitistics = () => {
  const {user} = useAuth();
  const [aktiveIndex, setAktiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);


  useEffect(()=> {
    if(aktiveIndex==0){
      getWeeklyStats();
    }
    if(aktiveIndex==1){
      getMonthlyStats();
    }
    if(aktiveIndex==2){
      getYearlyStats();
    }
  },[aktiveIndex]);

  const getWeeklyStats = async ()=>{
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if(res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else{
      Alert.alert("Error", res.msg)
    }
  };

  const getMonthlyStats = async ()=>{

  };

  const getYearlyStats = async ()=>{

  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100)
          }}
          showsVerticalScrollIndicator={false}

        >
          <SegmentedControl 
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={aktiveIndex}
            onChange={(event) => {
              setAktiveIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{...styles.segmentFontStyle, color: colors.white }}
          />
          <View style={styles.chartContainer}>
              {
                chartData.length>0 ? (
                  <BarChart 
                    data={chartData}
                    barWidth={scale(12)}
                    spacing={[1,2].includes(aktiveIndex)? scale(25) : scale(16)}
                    roundedTop
                    roundedBottom
                    hideRules
                    yAxisLabelPrefix="$"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisLabelWidth={[1,2].includes(aktiveIndex)? scale(38) : scale(35)}
                    // hideYAxisText
                    // maxValue={1000}
                    yAxisTextStyle={{color: colors.neutral350}}
                    xAxisLabelTextStyle={{
                      color: colors.neutral350,
                      fontSize: verticalScale(12)
                    }}
                    noOfSections={3}
                    minHeight={5}
                    // isAnimated={true}
                    // animationDuration={1000}
                  />
                ) : (
                 <View style={styles.noChart} />
                )}
                {
                  chartLoading && (
                    <View style={styles.chartLoadingContainer} >
                        <Loading color={colors.white} />
                    </View>
                  )
                }
          </View>
          {/* transactions */}
          <View>
            <TransactionList 
              title="Transactions"
              emptyListMessage="No Transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Staitistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {},
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
