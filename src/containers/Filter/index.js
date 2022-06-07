import React,{useState,useEffect} from 'react'
import { View, Text, TextInput, FlatList,ScrollView, Image,BackHandler, TouchableOpacity } from 'react-native'
import { Header } from "@components";
import { Content } from "native-base";
import { Constants, Images, Colors } from "@themes";
import styles from "./styles";
import { LinearGradientButton,Picker } from "@common";
//import RNPickerSelect from 'react-native-picker-select';
//import RangeSelector from 'reactnative-range-selector'
//import RangeSlider from '@webileapps/rn-range-slider';
import Services from "@Services";
import { useNavigation } from '@react-navigation/native';
export default function Filter() {

    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');
    const [minAmount, setMinAmount] = useState('0');
    const [maxAmount, setMaxAmount] = useState('2500');
    const navigation = useNavigation();
    //console.log(data);
    useEffect(() => {
        getData()

        const backAction = () => {
            // Alert.alert("Urban Stop Design", "Are you sure you want to Exit USD App?", [
            //   {
            //     text: "Cancel",
            //     onPress: () => null,
            //     style: "cancel"
            //   },
            //   { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            navigation.pop()
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [])

    const getData = async () => {
        Services(Constants.API_BASE_URL + "/category","GET")
            .then((response) => {
                //console.log("Categoriessss",response.data);
                if(response.status === 1){
                    setData(response.data)
                }else{
                    alert(response.msg)
                }
            })
      }

    function slideToChange({ min, max }){
        console.log(min, max)
      }

    function getUserType(value) {
        console.log(value, "-------")
    }
    function _renderItem({ item, index }) {
        return (
            <TouchableOpacity style={{flex:1,marginEnd:5,marginStart:5}}>

                    <View style={{width:40,height:40,borderRadius:20,justifyContent:'center',alignItems:'center',padding:5,borderWidth:0.5,borderColor:'lightgrey'}}>
                        <View style={{width:40,height:40,borderRadius:20,backgroundColor:item.color}}>                            
                        </View>
                    </View>
            </TouchableOpacity>
        )
    }

    function _sizerenderItem({ item, index }) {
        return (
            <TouchableOpacity style={{flex:1,marginEnd:5,marginStart:5}}>

                    <View style={{width:40,height:40,borderRadius:20,marginStart:0,justifyContent:'center',alignItems:'center',padding:5,borderWidth:1,borderColor:'#9abec6'}}>
                        <Text style={{size:16,color:'#9abec6',fontWeight:'bold'}}>
                            {item.size}
                        </Text>
                    </View>
            </TouchableOpacity>
        )
    }

    const productNavigation = async (minAmount,maxAmount) => {
        navigation.navigate("FilterProducts", {
          min_amount: minAmount,
          max_amount:maxAmount
        });
      }

      const categoryNavigation = async (item) => {
        navigation.navigate("ListScreen", {
          categoryId: item.id
        });
      }

    function _categoriesRenderItem({ item, index }) {
        return (
            <View style={{flex:1,padding:2}}>
            <TouchableOpacity 
            onPress={categoryNavigation.bind(this, item)}
            style={[styles.row, {
                marginLeft: index === 0 ? 4 : 0,
            }]}>
                <Text style={styles.title}>{item.category}</Text>
            
            </TouchableOpacity>
            </View>
        )
    }

    function _brandsRenderItem({ item, index }) {
        return (
            <View style={{flex:1,padding:2}}>
            <TouchableOpacity style={[styles.row, {
                marginLeft: index === 0 ? 4 : 0,
            }]}>
                <Text style={styles.title}>{item.title}</Text>
            
            </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Filter" />
            </View>

            <View style={{flex:1}}>
                <View style={{flex:1}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 10 }}>                     

                <View style={{padding:10,marginStart:10,marginEnd:10,marginTop:10}}>
                <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Prize Range</Text>

                <View style={{flex:1,marginTop:10}}>

                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:0.2}}>
                        <TextInput
                            style={{height: 40,
                                margin: 1,
                                justifyContent:'center',
                                borderWidth: 1,}}
                            placeholder="0"
                            value = {minAmount}
                            onChangeText={(min_amount) => setMinAmount(min_amount)}
                            textAlign={'center'}
                            keyboardType="numeric"
                        />
                        </View>
                        <View style={{flex:0.6,justifyContent:'center'}}>
                        <Text style={{height:15}}>
                            ---------------------------------------------------------------------------------------------------
                            </Text>
                        </View>
                        <View style={{flex:0.2}}>
                        <TextInput
                            style={{height: 40,
                                margin: 1,
                                borderWidth: 1,}}
                            placeholder="0"
                            textAlign={'center'}
                            value = {maxAmount}
                            onChangeText={(max_amount) => setMaxAmount(max_amount)}
                            keyboardType="numeric"
                        />
                        </View>
                    </View>
                
                </View>

                    <Text style={{fontSize: 16,fontWeight:'bold',color: "black",marginTop:10}}>Categories</Text>

                    <View style={{marginTop:10}}>
                    <FlatList
                            data={data}
                            renderItem={_categoriesRenderItem}
                            keyExtractor={item => item.id}
                            //horizontal={true}
                            numColumns={2}
                            //showsHorizontalScrollIndicator={false}
                            style={{marginTop:0,flex:1}}
                    />
                    </View>
                </View>
                </View>
            </ScrollView>
                </View>

                <View style={{flex:0.11,flexDirection:'row'}}>
                {/* <View style={{flex:1,justifyContent:'center'}}>
                       <View style={styles.buttonWhite}>
                       <Text style={{fontSize:16,color:'red',fontWeight:'bold'}}>RESET</Text>
                       </View>
                       </View> */}

                       <View style={{flex:1,justifyContent:'center'}}>
                       <View style={styles.button}>
                            <LinearGradientButton title="APPLY" 
                            onPress={productNavigation.bind(this, minAmount,maxAmount)}/>
                       </View>
                       </View>
                </View>
            </View>
            
        </View>
    )
}
