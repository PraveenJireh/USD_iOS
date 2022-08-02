import React,{useState,useEffect} from 'react'
import { View, Text, FlatList,BackHandler,Image,TouchableOpacity,ActivityIndicator,SafeAreaView,Alert } from 'react-native'
import { Header } from "@components";
import { Constants,Images } from "@themes";
import styles from './styles';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmptyArray } from 'formik';
export default function MyCart() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [cartData, setCartData] = useState({});
    const [cartDataItem, setCartDataItem] = useState([]);
    const [data, setData] = useState(null);
    const [userId, setUserId] = useState(0);
    const [userRole, setUserRole] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData()
      }, [isFocused])

    const getData = async () => {
        try {
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            setUserId(user_id)
            getUserData(user_id);
            getCartDetails(user_id)
          }else
          {
            setCartData(null)
          }
        } catch(e) {
          // error reading value
        }
      }
      
      function getUserData(user_id) {
        if(user_id !== null) {
          Services(Constants.API_BASE_URL + "get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              console.log("Get User Detailsssss",user_id);
              if(response.status === 1){
                  setData(response.data)
                  setUserRole(response.data.role)
                  //alert(response.data[0].role)
              }else{
                  //alert(response.msg)
              }
          })
        }
    }

    function getCartDetails(user_id){
        setLoading(true)
        Services(Constants.API_BASE_URL + "view_cart/"+user_id,"GET")
        .then((response) => {
            if(response.status === 1){
                setLoading(false)
                setCartData(response.data)
                if(response.data != null){
                    setCartDataItem(response.data.item)
                }
                
            }else{
                setCartData(null)
                setLoading(false)
                alert(response.msg)
            }
        })
    }


    function _renderItem({ item, index }) {
        return (
            <View style={{flex:1,padding:10}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:0.3,borderRadius:8,backgroundColor:'#f7f8fc',padding:4}}>
                    <Image source={{ uri: item.thumbnail }} style={{flex:1,height:80,marginLeft:0}} resizeMode="contain" />

                    </View>

                    <View style={{flex:1,marginStart:15}}>
                        <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>{item.product_name}</Text>

                        <Text style={{fontSize:14,color:'black',fontWeight:'bold',marginTop:5}}>Design No : {item.design_no}</Text>

                    <View style={{flexDirection:'row',marginTop:8}}>
                    <FlatList
                            data={item.size}
                            renderItem={_renderItemDetails}
                            keyExtractor={item => item.id}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            style={{marginTop:0,flex:1,marginEnd:0}}
                        />
                    </View>

                    
                    </View>
                </View>
                <View style={{flex:1,height:1,backgroundColor:'#b9d2d7',marginTop:10}}/>
            </View>
            
        )
    }

    function _renderItemDetails({ item, index }) {
        return (
            <View style={{flex:1,marginTop:5}}>
                <View style={{flexDirection:'row',marginTop:0}}>
                    {/* <Text>Status : {item.stock_status}</Text> */}
                    {item.stock_status === 1 ? (
                        <View style={{flexDirection:'row'}}>
                            <View style={{borderRadius:12,marginStart:0,justifyContent:'center',paddingStart:0,paddingEnd:0,borderWidth:0,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize: 14,marginEnd:10,fontWeight: "bold",marginTop: 0,
                                        color: "red",}}>{'\u20B9'}{" "}{item.price}</Text>
                                </View>

                                <View style={{borderRadius:12,marginStart:0,justifyContent:'center',paddingStart:10,paddingEnd:10,borderWidth:0,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}>Qty: {item.quantity}</Text>
                                </View>

                                <View style={{borderRadius:12,marginStart:10,justifyContent:'center',paddingStart:0,paddingEnd:0,borderWidth:0,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize: 14,marginEnd:10,fontWeight: "bold",marginTop: 0,
                                        color: "red",}}>{'\u20B9'}{" "}{Number.parseFloat(item.cart_item_price).toFixed(1)}</Text>
                                </View>
                            </View>
                    ):(
                        <View>
                            <Text style={{fontSize:16,color:'red',fontWeight:'bold'}}>OUT OF STOCK</Text>
                        </View>
                    )}

                    <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                "Cart",
                                "Are you sure you want to remove this product.",
                                [
                                    { text: "Ok", onPress: () => onDelete(item) },
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                    },
                    
                                ]
                            );
                        }}>
                        <Image source={Images.icons.del} style={{height:25,width:25,marginLeft:0}} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>

                        <View style={{flex:1,borderRadius:12,justifyContent:'center',flexDirection:'row',paddingStart:0,paddingEnd:10,borderWidth:0,borderColor:'#b9d2d7'}}>
                            <Text style={{flex:0.25,fontSize:14,color:'black',fontWeight:'bold'}}>Size</Text>
                            <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}> : </Text>
                            <Text style={{flex:0.75,fontSize:14,color:'black',fontWeight:'normal'}}>{item.size}</Text>
                        </View>

                        <View style={{flex:1,borderRadius:12,marginTop:5,justifyContent:'center',flexDirection:'row',paddingStart:0,paddingEnd:10,borderWidth:0,borderColor:'#b9d2d7'}}>
                            <Text style={{flex:0.25,fontSize:14,color:'black',fontWeight:'bold'}}>Color</Text>
                            <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}> : </Text>
                            <Text style={{flex:0.75,fontSize:14,color:'black',fontWeight:'normal'}}>{item.color}</Text>
                        </View>
               
            </View>
            
        )
    }

    function _renderRatioItem({ item, index }) {
        return (
            <View style={{flex:1,marginTop:0,alignItems:'center',paddingStart:0,paddingEnd:8}}>
                <Text style={{fontSize:15,color:'black'}}>
                    {item.product_size}
                </Text>

                <Text style={{fontSize:15,color:'black',marginTop:6}}>
                {item.product_qty}
                </Text>
            </View>
        )
    }

    function onDelete(item) {
        Services(Constants.API_BASE_URL + "delete_cart_item/"+item.cart_id,"GET")
            .then((response) => {
                console.log(response.data);
                if(response.status === 1){
                    getData();
                    Alert.alert("Success",response.msg)
                }else{
                    Alert.alert("Failed",response.msg)
                }
        })
    }

    function _renderB2BItem({ item, index }) {
        return (
            <View style={{flex:1}}>
                
                <View style={{flex:1,height:40,justifyContent:'flex-end',alignItems:'flex-end'}}>
                        <TouchableOpacity style={{flex:1,height:40,justifyContent:'center',alignItems:'center'}}
                        onPress={() => {

                            Alert.alert(
                                "Cart",
                                "Are you sure you want to remove this product.",
                                [
                                    { text: "Ok", onPress: () => onDelete(item) },
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                    },
                    
                                ]
                            );
                        }}
                        >
                            <Image source={Images.icons.del} style={{flex:1,height:25,width:25,marginLeft:0}} resizeMode="contain" />
                        {/* <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}>Remove</Text> */}
                        </TouchableOpacity>
                    </View>

                <View style={{flex:1,flexDirection:'row',marginTop:0}}>

                    <View style={{flex:0.3,borderRadius:8,backgroundColor:'#f7f8fc',padding:4}}>
                    <Image source={{ uri: item.thumbnail }} style={{flex:1,height:80,marginLeft:0}} resizeMode="contain" />

                    </View>

                    <View style={{flex:1,marginStart:15}}>
                        <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>{item.product_name}</Text>

                        {item.stock_status === 1 ? (
                            <View style={{flexDirection:'row',marginTop:8}}>
                                <View style={{height:35,borderRadius:12,marginStart:0,justifyContent:'center',alignItems:'center',paddingStart:15,paddingEnd:20,borderWidth:1,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                        color: "red",}}>{'\u20B9'}{" "}{item.price}</Text>
                                </View>

                                <View style={{height:35,borderRadius:12,marginStart:15,marginEnd:15,justifyContent:'center',paddingStart:10,paddingEnd:10,borderWidth:1,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}>Qty: {item.quantity}</Text>
                                </View>

                                <View style={{height:35,borderRadius:12,marginStart:0,justifyContent:'center',alignItems:'center',paddingStart:15,paddingEnd:20,borderWidth:1,borderColor:'#b9d2d7'}}>
                                <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                        color: "red",}}>{'\u20B9'}{" "}{Number.parseFloat(item.cart_item_price).toFixed(1)}</Text>
                                </View>
                            </View>
                        ):(
                            <View>
                                <Text style={{fontSize:16,color:'red',fontWeight:'bold',marginTop:8}}>OUT OF STOCK</Text>
                            </View>
                        )}

                    {/* <View style={{flex:1,borderRadius:12,marginTop:6,marginEnd:10,flexDirection:'row'}}>
                        <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                color: "black",}}>{"Design No"} {" : "}</Text>

                        <Text style={{flex:1,fontSize: 14,marginEnd:0,marginTop: 0,
                                color: "black",}}>{item.color}</Text>
                    </View> */}

                    <View style={{flex:1,borderRadius:12,marginTop:6,marginEnd:10,flexDirection:'row'}}>
                        <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                color: "black",}}>{"Design no"} {" : "}</Text>

                        <Text style={{flex:1,fontSize: 14,marginEnd:0,marginTop: 0,
                                color: "black",}}>{item.design_no}</Text>
                    </View>

                    <View style={{flex:1,borderRadius:12,marginTop:6,marginEnd:10,flexDirection:'row'}}>
                        <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                color: "black",}}>{"Color"} {" : "}</Text>

                        <Text style={{flex:1,fontSize: 14,marginEnd:0,marginTop: 0,
                                color: "black",}}>{item.color}</Text>
                    </View>

                    {item.set_ratio.length !== 0 && item.set_ratio !== null && item.set_ratio !== undefined ?(
                        <View>
                            <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 5,
                                    color: "black",}}>{"Set Ratio :"}</Text>

                            <FlatList
                                data={item.set_ratio}
                                renderItem={_renderRatioItem}
                                keyExtractor={item => item.id}
                                horizontal={true}
                                style={{marginTop:0,marginBottom:0,padding:0}}
                            />
                        </View>
                    ):(
                        <View style={{borderRadius:12,marginTop:6,flexDirection:'row'}}>
                            <Text style={{fontSize: 14,marginEnd:0,fontWeight: "bold",marginTop: 0,
                                    color: "black",}}>{"Size"} {" : "}</Text>

                            <Text style={{fontSize: 14,marginEnd:0,marginTop: 0,
                                    color: "black",}}>{item.size}</Text>
                        </View>
                    )}
                    </View>
                </View>
                {/* <View style={{flex:1,height:1,backgroundColor:'#b9d2d7',marginTop:10}}/> */}
                {/* <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,height:40,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity style={{flex:1,height:40,justifyContent:'center',alignItems:'center'}}
                        onPress={() => {
                            Services(Constants.API_BASE_URL + "delete_cart_item/"+item.cart_id,"GET")
                                .then((response) => {
                                    //console.log(response.data);
                                    if(response.status === 1){
                                        getData();
                                        Alert.alert("Success",response.msg)
                                    }else{
                                        Alert.alert("Failed",response.msg)
                                    }
                                })
                        }}
                        >
                        <Text style={{fontSize:14,color:'black',fontWeight:'bold'}}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{flex:1,height:1,backgroundColor:'#b9d2d7',marginTop:10}}/>
            </View>

            )
    }

    function _renderWoleSalerItem({ item, index }) {
        return (

            <View style={{flex:1,padding:0}}>

                <View style={{flex:1,height:40,backgroundColor:'#eef1fc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>{item.product_name}</Text>
                </View>   

                <FlatList
                    data={item.product_item}
                    renderItem={_renderB2BItem}
                    keyExtractor={item => item.id}
                    style={{marginTop:0,marginBottom:10,padding:0}}
                />

        </View>
            
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Cart" />
            </View>

            {loading ? (
                <ActivityIndicator
                    color='black'
                    size='large'
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    />
            ) : (
                <View style={styles.container}>
                    {cartData !== null ? (
                    <View style={styles.content}>
                    <View style={{flex:1,backgroundColor:'white'}}>
    
                        {/* <Text>{userRole}</Text> */}
    
                    {userRole !== "3" ? (
                        <FlatList
                            data={cartDataItem}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                            style={{marginTop:10,marginBottom:10,padding:10}}
                        />
                    ) : (
                            <FlatList
                                data={cartDataItem}
                                renderItem={_renderWoleSalerItem}
                                keyExtractor={item => item.id}
                                style={{marginTop:10,marginBottom:10,padding:0}}
                            />
                    )}
    
                    </View>
    
                    <View style={{flex:0.47,backgroundColor:'#f7f8fc',padding:15}}>
                        <View style={{flexDirection:'row'}}>
                        <View style={{flex:1.4}}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Subtotal{" "}({cartData.item_nos} Nos)</Text>
                        </View>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text 
                        numberOfLines={1}
                        style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {cartData.sub_total}</Text>
                        </View>
                        </View>

                        {/* <View style={{flexDirection:'row',marginTop:10}}>
                        <View style={{flex:1}}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Items Nos</Text>
                        </View>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>({cartData.item_nos} Nos)</Text>
                        </View>
                        </View> */}

                        {cartData.incl_tax == "0" ? (
                            <View/>
                        ):(
                            <View style={{flexDirection:'row',marginTop:10}}>
                                <View style={{flex:1.4}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>{cartData.tax_text}</Text>
                                </View>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text 
                                numberOfLines={1}
                                style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {cartData.incl_tax}</Text>
                                </View>
                            </View>
                            
                        )}

                        {cartData.incl_tax2 == "0" ? (
                            <View/>
                            
                        ):(
                            <View style={{flexDirection:'row',marginTop:10}}>
                                <View style={{flex:1.4}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>{cartData.tax_text2}</Text>
                                </View>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text 
                                numberOfLines={1}
                                style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {cartData.incl_tax2}</Text>
                                </View>
                            </View>
                        )}
    
                        <View style={{flexDirection:'row',marginTop:10}}>
                        <View style={{flex:1.4}}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Delivery Fee</Text>
                        </View>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                        {cartData.shipping_cost !== "" &&  cartData.shipping_cost !== "Free" ? (
                            <Text 
                            numberOfLines={1}
                            style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {cartData.shipping_cost}</Text>
                        ) : (
                            <Text 
                            numberOfLines={1}
                            style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>Free</Text>    
                        )}
                        </View>
                        </View>
    
                        <View style={{flexDirection:'row',marginTop:10}}>
                        <View style={{flex:1.4}}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Total</Text>
                        </View>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text 
                        numberOfLines={1}
                        style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {cartData.total}</Text>
                        </View>
                        </View>
    
                        <View style={styles.button}>
                                <LinearGradientButton title="CHECKOUT" onPress={() => navigation.push("Checkout")} />
                        </View>
    
                    </View>
                </View>
                    ) : (
                        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>Your cart is empty.</Text>
                        </View>
                    )}
                </View>
            )}

        </View>
        
    )
}
