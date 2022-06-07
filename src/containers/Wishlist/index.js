import React, { useState,useEffect } from 'react'
import { View, Text, Image,BackHandler, TouchableOpacity,ScrollView, FlatList,ToastAndroid, TextInput, Alert } from 'react-native';
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
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
export default function Wishlist() {
    const navigation = useNavigation();
    const [scrollEndMessage,setScrollEndMessage] = useState('*****');
    const [fcmTokenValue,setFcmToken] = useState('');

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
      }

      const [wishListProductsData, setWishListProductsData] = useState([]);

    useEffect(() => {
        getUserData(),
        getScrollEndMessage()

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

      function getScrollEndMessage(){
        Services(Constants.API_BASE_URL + "/settings","GET")
          .then((response) => {
            if(response !== null){
              setScrollEndMessage(response.quotes)
            }
          })
      }

      const getUserData = async () => {
        try {
            const user_id = await AsyncStorage.getItem('@USER_ID')
            if(user_id !== null) {
                wishListProducts(user_id)
            }
          } catch(e) {
            // error reading value
          }
      }

      function wishListProducts (user_id) {
        Services(Constants.API_BASE_URL + "wishlist_products/"+user_id,"GET")
            .then((response) => {
                //console.log(response.data);
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
                      <FastImage source={{ uri: item.thumbnail }} style={{flex:1,width: null, height: null,resizeMode:'stretch'}} resizeMode="contain">
      
                      </FastImage>
                  </View>
      
                  {/* <View style={{backgroundColor:'#f7f8fc',borderRadius:0,padding:10}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                          <View style={{flexDirection:'row',backgroundColor:'white',alignSelf:'center',borderRadius:0,padding:5}}>
                              <Text style={{color:'orange',fontSize:13}}>{item.rating}</Text>
                              <Image style={{width:15,height:15,marginLeft:8,tintColor:'orange',alignSelf:'center'}} source={Images.icons.star}/>
                              
                          </View>
                      </View>
      
                  <Image source={{ uri: item.thumbnail }} style={styles.img} resizeMode="contain" />
                  </View> */}
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
                <Header title="Wishlist" />
            </View>
            <View style={{ marginBottom: 0,flex:1 }}>

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
                        style={{marginTop:10,padding:0,marginBottom:5}}
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
                <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>No Products in your Wishlist.</Text>
                </View>
              )}
                </View>
        </View>
    )
}