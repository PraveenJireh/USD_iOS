import React, { useState,useEffect } from 'react'
import { View, Text, Image, TouchableOpacity,ScrollView,BackHandler, FlatList,ToastAndroid, TextInput, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Header } from "@components";
import { Constants, Images, Colors } from "@themes";
import styles from "./styles";
import { useNavigation } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Services from "@Services";
import { Formik, } from 'formik';
import * as Yup from 'yup';
import messaging from '@react-native-firebase/messaging';
export default function FilterProducts({ route }) {
    const navigation = useNavigation();
    const [fcmTokenValue,setFcmToken] = useState('');
    const [scrollEndMessage,setScrollEndMessage] = useState('*****');
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
          setFcmToken(fcmToken)
        //console.log(fcmToken);
      } 
      }

    const productNavigation = async (item) => {
      const fcmToken = await messaging().getToken();
            if (fcmToken) {
                setFcmToken(fcmToken)
                navigation.navigate("ProductDetails", {
                productId: item.id,
                productURL:item.base_url,
                orderRating:"",
                fcmTokenValue:fcmToken
                });
            }
        // navigation.navigate("ProductDetails", {
        //   productId: item.id,
        //   productURL:item.base_url,
        //   orderRating:"",
        //   fcmTokenValue:fcmTokenValue
        // });
      }

    const { min_amount } = route.params;
    const { max_amount } = route.params;
    const [wishListProductsData, setWishListProductsData] = useState([]);

    useEffect(() => {
        getUserData(),
        getScrollEndMessage()
      }, [])

      const getUserData = async () => {
        try {
            const user_id = await AsyncStorage.getItem('@USER_ID')
            //if(user_id !== null) {
                wishListProducts(user_id)
            //}
          } catch(e) {
            // error reading value
          }
      }

      function getScrollEndMessage(){
        Services(Constants.API_BASE_URL + "/settings","GET")
          .then((response) => {
            if(response !== null){
              setScrollEndMessage(response.quotes)
            }
          })
      }

      function wishListProducts (user_id) {
        Services(Constants.API_BASE_URL + "get_product_price_filter/"+min_amount+"/"+max_amount,"GET")
            .then((response) => {
                console.log(response.data);
                if(response.status === 1){
                    setWishListProductsData(response.data)
                }else{
                    alert(response.msg)
                }
            })
      }

      const numColumns = 2;

      function formatData(wishListProductsData, numColumns){
          const totalRows = Math.floor(wishListProductsData.length / numColumns)

          let totalLastRow = wishListProductsData.length - (totalRows * numColumns)


          while(totalLastRow !== 0 && totalLastRow !== numColumns){
            wishListProductsData.push({key:'blank', empty : true})
              totalLastRow++
          }

          return wishListProductsData
      }

    function _renderItem({ item, index }) {

            if(item.empty){
                return <View style = {styles.itemInvisible}/>
            }

        return (
            <View style={{flex:1,padding:0,borderColor:'#cccccc',borderWidth:0.5}}>
    <TouchableOpacity style={[styles.row]} onPress={productNavigation.bind(this, item)}>

            <View style={{flex:1,height:250,backgroundColor:'#f7f8fc',padding:5}}>
                <Image source={{ uri: item.thumbnail }} style={{flex:1,width: null, height: null,resizeMode:'stretch'}} resizeMode="contain">

                </Image>
            </View>

            <View style={{backgroundColor:'white',padding:5}}>
              <Text 
              numberOfLines={2}
              style={styles.title}>{item.product_name}</Text>

              <View style={{flexDirection:'row',marginTop:4}}>
                      <Text style={{fontSize: 14,fontWeight: "bold",color: "orange"}}>
                        Design No : 
                      </Text>

                      <Text style={{fontSize: 14,fontWeight: "bold",color: "black"}}>
                        {item.sku}
                      </Text>
                    </View>
              
              <View style={{flex:1,flexDirection:'row',marginTop:8,alignItems:'center'}}>
              <Text style={{fontSize: 14,fontWeight: "bold",marginTop: 0,
                              color: "red",}}>{'\u20B9'}{" "}{item.discount_price}</Text>

              <Text style={{fontSize: 14,marginStart:15,fontWeight: "bold",marginTop: 0,textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                              color: "grey",alignSelf:'flex-end',alignContent:'flex-end'}}>{'\u20B9'}{" "}{item.price}</Text>
                <View style={{width:1,height:10,backgroundColor:'lightgrey',marginStart:15,marginEnd:15}}/>

                <View style={{flexDirection:'row',alignSelf:'center',borderRadius:0,padding:0}}>
                        <Text style={{color:'orange',fontSize:12}}>{item.rating}</Text>
                        <Image style={{width:12,height:12,marginLeft:8,tintColor:'orange',alignSelf:'center'}} source={Images.icons.star}/>
                        
                    </View>
              </View>
            </View>
        </TouchableOpacity>
        </View>
            
        )
    }
    return (
        <View style={styles.container}>

            
            <View style={styles.header}>
                    <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center',}}>
                        <TouchableOpacity onPress={() => navigation.push("Home")}>
                            <Image style={{height: 35, width: 35, tintColor: Colors.black }} source={Images.icons.back} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', color: "black", fontSize: 16}}>Products</Text>
                    </View>

                    <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center',}}>

                    </View>
                {/* <Header title="Products" /> */}
             </View>
            <View style={{ marginBottom: 0,flex:1 }}>

                <Text style={{fontSize:16,marginTop:10,fontWeight:'bold',padding:10}}>
                    Showing Result : {'\u20B9'} {min_amount} {"  to  "} {'\u20B9'} {max_amount}
                </Text>

                {wishListProductsData.length != 0 ? (
                    <ScrollView showsVerticalScrollIndicator={null}>
                    <View  style={{flex: 1}}>
                            <FlatList
                                data={formatData(wishListProductsData,numColumns)}
                                renderItem={_renderItem}
                                keyExtractor={item => item.id}
                                numColumns={numColumns}
                                columnWrapperStyle={{justifyContent:'space-between', }}
                                showsHorizontalScrollIndicator={false}
                                style={{marginTop:0,padding:0,marginBottom:5}}
                                
                            />

                        <View style={{marginTop:10,padding:10,justifyContent:'center',alignItems:'center'}}>

                          <View style={{width:100,height:1,backgroundColor:'grey'}}></View>

                          <Text style={{color:'black',fontStyle:'italic',textAlign:'center',fontSize:14,marginTop:15,marginBottom:15}}>
                            {scrollEndMessage}
                          </Text>

                        </View>

                </View>
                </ScrollView>
              ) : (
                <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>No Products under this Request.</Text>
                </View>
              )}
                </View>
        </View>
    )
}