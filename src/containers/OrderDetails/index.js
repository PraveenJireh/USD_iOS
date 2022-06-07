import React,{useState,useEffect,useContext} from 'react'
import { View, Text, ScrollView,BackHandler,Modal,Alert,StyleSheet,Dimensions, Image,FlatList,TouchableOpacity, TextInput,SafeAreaView, Linking,ActivityIndicator } from 'react-native'
import { Header, ListProduct,CarouselProductImages } from "@components";
import { Search } from "@common";
import { Colors, Images,Constants } from "@themes";
import styles from './styles';
import { LinearGradientButton, Picker } from "@common";
import { useNavigation,useIsFocused } from '@react-navigation/native';
import Services from "@Services";
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesmodal from './stylesmodal';
import { Content } from "native-base";
import ImagePicker from 'react-native-image-crop-picker';
import { UserContext } from '@context/user-context';
import base64 from 'react-native-base64';
import messaging from '@react-native-firebase/messaging';
import RNPickerSelect from 'react-native-picker-select';

export default function ProductDetails({ route }) {
    const navigation = useNavigation();

    const { orderId } = route.params;
    var order_id = orderId;
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [orderData, setOrderData] = useState([0]);
    const { user, setUser } = useContext(UserContext);
    //const [productColorData, setProductColorData] = useState([]);
    //const [productImagesData, setProductImagesData] = useState([]);
    //const [productSizesData, setProductSizesData] = useState([]);
    const [userId, setUserId] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const [reasonOfReturn, setReasonOfReturn] = useState('Exchange');
    const [returnNote, setReturnNote] = useState('');
    const [fileChosenText, setFileChosenText] = useState('No File Chosen');
    const [profilePic, setProfilePic] = useState('');
    const [profilePicBase64, setProfilePicBase64] = useState('');
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState(null);

    const departmentPlaceholder = {
        label: 'Select Reason',
        value: null,
        color: '#9EA0A4',
    };

    //console.log(data);
    useEffect(() => {
        getData()
        getProductDetails()
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
        
      }, [isFocused])


      const backAction = () => {

        if (!navigation.isFocused()) {
            return false;
          }
     
        navigation.pop()
        return true;
      };

    const getData = async () => {
        try {
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            getUserData(user_id);
            setUserId(user_id)
          }
        } catch(e) {
          // error reading value
        }
      }

      const productNavigation = async (item) => {
        const fcmToken = await messaging().getToken();
              if (fcmToken) {
                navigation.navigate("ProductDetails", {
                    productId: item.product_id,
                    productURL:item.base_url,
                    orderRating:"?order_id="+base64.encode(orderData.order_id)+"#product-review",
                    fcmTokenValue:fcmToken
                    });
              }
        }

      function getProductDetails() {
        if(order_id !== null) {
            setLoading(true);
            Services(Constants.API_BASE_URL + "order_details/"+orderId,"GET")
            .then((response) => {
                //console.log("Get Product Detailsssss",response.data);
                if(response.status === 1){
                    setOrderData(response.data);
                    setLoading(false);
                }else{
                    alert(response.msg);
                    setLoading(false);
                }
            })
          }
      }
      
      function getUserData(user_id) {
        if(user_id !== null) {
          Services(Constants.API_BASE_URL + "/get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              //console.log("Get User Detailsssss",response.data);
              if(response.status === 1){
                  setData(response.data)
              }else{
                  alert(response.msg)
              }
          })
        }
    }

    
    function onSelectPicker() {
        Alert.alert(
            "Choose Options",
            "",
            [
                { text: "Take Photo", onPress: () => onOpenCamera() },
                {
                    text: "Choose from Gallery",
                    onPress: () => onOpenGallery(),
                },
                {
                    text: "Cancel",
                }

            ],
        );
    }
    function onOpenCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            console.log(image, "------openCamera");
            setProfilePic(image.path)
            setFileChosenText(image.path)
            //setProfilePicBase64(`data:${image.mime};base64,` + image.data)
            setProfilePicBase64(image.data)
        });
    }
    function onOpenGallery() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            //console.log(`data:${image.mime};base64,` + image.data, "pp--------onOpenGallery");
            setProfilePic(image.path)
            setFileChosenText(image.path)
            setProfilePicBase64(image.data)
            //console.log(profilePicBase64)
        });
    }

    
    function _renderItem({ item, index }) {
        return (
            <View style={{flexDirection: 'row',
                    padding: 20,
                    borderBottomWidth: 1,
                    borderColor: Colors.e4e4e4}}>
                <View>
                    <Image source={{ uri: item.product_img }}
                        style={{ height: 80, width: 80 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.7,marginStart:10 }}>
                    <Text style={styles.title}>{item.product_name}</Text>
                    <Text style={styles.price}>₹ {item.cart_item_price}</Text>
                    <View style={{flex:1,flexDirection:"row"}}>
                    <Text style={styles.qty}>Size : {item.size}</Text>
                    {/* <Text style={styles.qty}>Qty: 1</Text> */}
                    </View>

                    <Text style={{color: "black",fontSize: 14,marginTop: 5,flex:1,fontWeight:'bold'  }}>
                        Color : {item.color}
                    </Text>
                
                </View>
            </View>

        )
    }

    
    function _renderB2BItem({ item, index }) {
        return (
            <View style={{flex:1}}>

                <View style={{flex:1,flexDirection:'row',marginTop:0}}>

                    <View style={{flex:0.3,borderRadius:8,backgroundColor:'#f7f8fc',padding:4}}>
                    <Image source={{ uri: item.product_img }} style={{flex:1,height:80,marginLeft:0}} resizeMode="contain" />

                    </View>

                    <View style={{flex:1,marginStart:15}}>
                        <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>{item.product_name}</Text>

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
                                color: "red",}}>{'\u20B9'}{" "}{item.cart_item_price}</Text>
                        </View>
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
                    {orderData.order_status === "Delivered" ? (
                            <TouchableOpacity 
                            onPress={productNavigation.bind(this, item)}
                                style={{marginTop:0,alignSelf:'flex-end'}}>
                                <View style={{padding:10}}>
                                    <Text style={{fontSize:15,color:'#337ab7',fontWeight:'400'}}>Write a Review</Text>
                                </View>
                            </TouchableOpacity>
                            ) : (
                            <View/> 
                        )}
                <View style={{flex:1,height:1,backgroundColor:'#b9d2d7',marginTop:10}}/>
            </View>

            )
    }

    function _B2BRenderItem({ item, index }) {
        return (
            <View style={{flex:1,marginTop:8}}>
                <View style={{flex:1,height:40,backgroundColor:'#eef1fc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>{item.product_name}</Text>
                </View>   

                <FlatList
                    data={item.product_item}
                    renderItem={_renderB2BItem}
                    keyExtractor={item => item.id}
                    style={{marginTop:8,marginBottom:10,padding:0}}
                />

                {/* <View style={{flexDirection: 'row',
                    padding: 20,
                    borderBottomWidth: 1,
                    borderColor: Colors.e4e4e4}}>
                <View>
                    <Image source={{ uri: item.product_img }}
                        style={{ height: 80, width: 80 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.7,marginStart:10 }}>
                    <Text style={styles.title}>{item.product_name}</Text>
                    <Text style={styles.price}>₹ {item.cart_item_price}</Text>
                    <View style={{flex:1,flexDirection:"row"}}>
                    <Text style={styles.qty}>Size : {item.size}</Text>
                    <Text style={styles.qty}>Qty: 1</Text>
                    </View>
                
                </View>
            </View> */}
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
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Header title="Order Details" />
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
               <SafeAreaView style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{flex:1,padding:10}}>

                                <View style={{marginTop:8,flexDirection:'row'}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Order Number : </Text>
                                    <Text style={{color:'red',fontWeight:'bold',fontSize:16}}>{orderData.order_no}</Text>
                                </View>

                                <View style={{marginTop:8,flexDirection:'row'}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Order Date : </Text>
                                    <Text style={{color:'lightgrey',fontWeight:'bold',fontSize:16}}>{orderData.order_date}</Text>
                                </View>

                                <View style={{marginTop:8,flexDirection:'row'}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Payment Type : </Text>
                                    <Text style={{color:'lightgrey',fontWeight:'bold',fontSize:16}}>{orderData.payment_type}</Text>
                                </View>

                                <View style={{marginTop:8,flexDirection:'row'}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Items : </Text>
                                    <Text style={{color:'lightgrey',fontWeight:'bold',fontSize:16}}>{orderData.item_count} {" "}{"(Items)"}</Text>
                                </View>

                                {orderData.order_status === "Delivered" ? (
                                <View style={{marginTop:8,flexDirection:'row',backgroundColor:'#ededed',padding:10}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Status : </Text>
                                    <Text style={{color:'green',fontWeight:'bold',fontSize:16}}>{orderData.order_status}{" "}{orderData.status_date}</Text>
                                </View>
                                ) : (
                                    <View style={{marginTop:8,flexDirection:'row',backgroundColor:'#ededed',padding:10}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Status : </Text>
                                    <Text style={{color:'orange',fontWeight:'bold',fontSize:16}}>{orderData.order_status}{" "}{orderData.status_date}</Text>
                                </View> 
                                )}

                                {orderData.track_url !== '' && orderData.track_url !== undefined ? (

                                    <View>
                                        { orderData.order_status !== "Delivered" ? (
                                            <TouchableOpacity style={{alignSelf:'flex-end',padding:10,marginTop:10}}
                                            onPress={() => {
                                                //alert(orderData.track_url)
                                                    Linking.openURL(orderData.track_url)
                                            }}
                                            >
                                                <Text style={{color:'green',fontSize:16,fontWeight:'bold'}}>Track Order</Text>
                                            </TouchableOpacity>
                                        ):(
                                            <View/>
                                        )}
                                    </View>
                                    
                                ):(
                                    <View/>
                                )}


                                {orderData.order_status !== "Delivered" ? (
                                <View style={{marginTop:8,flexDirection:'row',backgroundColor:'#ededed',padding:10}}>
                                    <Text style={{color:'black',fontSize:14}}>
                                    *For cancellation, please contact - +91 6364159599, +91 6366957985
                                    </Text>
                                </View>
                                ) : (
                                    <View/>
                                )}

                                <View style={{marginTop:8}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Billing Address</Text>

                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14,marginTop:6}}>{orderData.first_name}{" "}{orderData.last_name}</Text>
                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14,marginTop:6}}>{orderData.billing_address}</Text>
                                    <View style={{fontSize:14,flexDirection:'row',marginTop:6}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:14}}>Phone No: </Text>
                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14}}>{orderData.phone_no}</Text>
                                    </View>
                                    
                                </View>

                                <View style={{marginTop:8}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Delivery Address</Text>
                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14,marginTop:6}}>{orderData.pickup_person_name}</Text>
                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14,marginTop:6}}>{orderData.delivery_address}</Text>
                                    <View style={{fontSize:14,flexDirection:'row',marginTop:6}}>
                                    <Text style={{color:'black',fontWeight:'bold',fontSize:14}}>Phone No: </Text>
                                    <Text style={{color:'grey',fontWeight:'normal',fontSize:14}}>{orderData.pickup_person_phone}</Text>
                                    </View>
                                </View>

                                {orderData.invoice_url !== '' && orderData.invoice_url !== undefined ? (
                                    <TouchableOpacity style={{backgroundColor:'green',marginTop:10,justifyContent:'center',alignItems:'center',width:175,height:45,borderRadius:5}}
                                        onPress={() => {
                                            if(orderData.invoice_url !== '' && orderData.invoice_url !== undefined){
                                                Linking.openURL(orderData.invoice_url)
                                            }else{
                                                alert("Invoice not Generated")
                                            }
                                        }}
                                        >
                                        <View style={{backgroundColor:'green',justifyContent:'center',alignItems:'center',width:175,height:45,borderRadius:5}}>
                                            <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Download Invoice</Text>
                                        </View>
                                    </TouchableOpacity>
                                ):(
                                    <View/>
                                )}

                                {orderData.order_status === "Delivered" ? (
                                    <View>
                                        { orderData.return_status === 1 ? (
                                            <View>
                                                {orderData.goods_return !== null? (
                                                        <View style={{marginTop:8}}>
                                                                <Text style={{color:'brown',fontSize:16,fontWeight:'bold'}}>Return Information</Text>

                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Reason :</Text>
                                                                <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.reason_of_return}</Text>
                                                            </View>

                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Note :</Text>
                                                                <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.return_note}</Text>
                                                            </View>

                                                            <View style={{flex: 1,height:250,justifyContent:'flex-start',marginTop:8,alignContent:'flex-start',alignItems:'flex-start'}}>
                                                            <Image source={{ uri: orderData.goods_return.return_attachment }} style={{flex:1,width: '100%', height: '100%'}} resizeMode="contain"/>
                                                            </View>

                                                            {orderData.goods_return.return_amount !== "" && orderData.goods_return.return_amount !== null ?(
                                                                <View style={{flexDirection:'row',marginTop:8}}>
                                                                <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Amount : </Text>
                                                                <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{'\u20B9'}{" "}{orderData.goods_return.return_amount}</Text>
                                                            </View>
                                                            ):(
                                                                <View/>
                                                            )}

                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Status :</Text>
                                                                <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.return_status}</Text>
                                                            </View>

                                                            {orderData.goods_return.return_url !== '' && orderData.goods_return.return_url !== null ? (

                                                                <View>
                                                                        <TouchableOpacity style={{alignSelf:'flex-start',paddingTop:10,paddingBottom:10,marginTop:0}}
                                                                        onPress={() => {
                                                                            //alert(orderData.track_url)
                                                                                Linking.openURL(orderData.goods_return.return_url)
                                                                        }}
                                                                        >
                                                                            <Text style={{color:'green',fontSize:16,fontWeight:'bold'}}>Track Return Order</Text>
                                                                        </TouchableOpacity>
                                                                    
                                                                </View>

                                                                ):(
                                                                <View/>
                                                                )}
                                                            {orderData.goods_return.admin_return_note !== "" && orderData.goods_return.admin_return_note !== null ?(
                                                                <View style={{flexDirection:'row'}}>
                                                                <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Admin Return Note :</Text>
                                                                <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.admin_return_note}</Text>
                                                            </View>
                                                            ):(
                                                                <View/>
                                                            )}

                                                            {orderData.goods_return.admin_return_attachment !== "" && orderData.goods_return.admin_return_attachment !== null ?(
                                                                <View style={{flex: 1,height:250,justifyContent:'flex-start',marginTop:8,alignContent:'flex-start',alignItems:'flex-start'}}>
                                                                <Image source={{ uri: orderData.goods_return.admin_return_attachment }} style={{flex:1,width: '100%', height: '100%'}} resizeMode="contain"/>
                                                            </View>
                                                            ):(
                                                                <View/>
                                                            )}

                                                            </View>
                                                ):(
                                                        <View style={{marginTop:10}}>
                                                            <TouchableOpacity style={{backgroundColor:'#d9534f',justifyContent:'center',alignItems:'center',width:150,height:50,borderRadius:5}}
                                                            onPress={() => {
                                                                    setModalVisible(true)
                                                            }}>
                                                            <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Return Order</Text>
                                                            </TouchableOpacity>
            
                                                            <Text style={{marginTop:5,color:'red'}}>
                                                            Note: You can return the order within 15 days from the delivery date.
                                                            </Text>
            
                                                            <View style={{flexDirection:'row',marginTop:10}}>
            
                                                            <TouchableOpacity
                                                            onPress={() => {
                                                                Services(Constants.API_BASE_URL + "/reorder",{"order_id":orderId} ,"POST").then((response) => {
                                                                    console.log("Updateeeee",response);
                                                                    if(response.status === 1){
                                                                        Alert.alert("Sucess",response.msg)
                                                                        navigation.navigate("MyCart")
                                                                    }else{
                                                                        Alert.alert("Failed"+response.msg)
                                                                    }
                                                                })
                                                            }}
                                                            >
                                                            <View style={{
                                                                height: 45,
                                                                width:175,
                                                                borderColor:'#cccccc',
                                                                borderRadius:5,
                                                                paddingStart:8,
                                                                marginTop:0,
                                                                marginStart:15,
                                                                fontSize:16,
                                                                justifyContent:'center',
                                                                alignItems:'center',
                                                                borderWidth: 1
                                                            }}>
                                                            <Text style={{color:'grey',fontWeight:'bold',fontSize:16}}>Buy it Again</Text>
                                                            </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        ):(

                                            <View>
                                                {orderData.goods_return === null? (
                                                    <View/>
                                                ):(
                                                    <View style={{marginTop:8}}>
                                                        <Text style={{color:'brown',fontSize:16,fontWeight:'bold'}}>Return Information</Text>

                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Reason :</Text>
                                                        <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.reason_of_return}</Text>
                                                    </View>

                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Note :</Text>
                                                        <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.return_note}</Text>
                                                    </View>

                                                    <View style={{flex: 1,height:250,justifyContent:'flex-start',marginTop:8,alignContent:'flex-start',alignItems:'flex-start'}}>
                                                      <Image source={{ uri: orderData.goods_return.return_attachment }} style={{flex:1,width: '100%', height: '100%'}} resizeMode="contain"/>
                                                    </View>

                                                    {orderData.goods_return.return_amount !== "" && orderData.goods_return.return_amount !== null ?(
                                                        <View style={{flexDirection:'row',marginTop:8}}>
                                                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Amount : </Text>
                                                        <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{'\u20B9'}{" "}{orderData.goods_return.return_amount}</Text>
                                                    </View>
                                                    ):(
                                                        <View/>
                                                    )}

                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Return Status :</Text>
                                                        <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.return_status}</Text>
                                                    </View>

                                                    {orderData.goods_return.return_url !== '' && orderData.goods_return.return_url !== null ? (

                                                        <View>
                                                                <TouchableOpacity style={{alignSelf:'flex-start',paddingTop:10,paddingBottom:10,marginTop:0}}
                                                                onPress={() => {
                                                                    //alert(orderData.track_url)
                                                                        Linking.openURL(orderData.goods_return.return_url)
                                                                }}
                                                                >
                                                                    <Text style={{color:'green',fontSize:16,fontWeight:'bold'}}>Track Return Order</Text>
                                                                </TouchableOpacity>
                                                            
                                                        </View>

                                                        ):(
                                                        <View/>
                                                        )}
                                                    {orderData.goods_return.admin_return_note !== "" && orderData.goods_return.admin_return_note !== null ?(
                                                        <View style={{flexDirection:'row'}}>
                                                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Admin Return Note :</Text>
                                                        <Text style={{color:'gray',fontSize:14,fontWeight:'bold'}}>{" "}{orderData.goods_return.admin_return_note}</Text>
                                                    </View>
                                                    ):(
                                                        <View/>
                                                    )}

                                                    {orderData.goods_return.admin_return_attachment !== "" && orderData.goods_return.admin_return_attachment !== null ?(
                                                        <View style={{flex: 1,height:250,justifyContent:'flex-start',marginTop:8,alignContent:'flex-start',alignItems:'flex-start'}}>
                                                        <Image source={{ uri: orderData.goods_return.admin_return_attachment }} style={{flex:1,width: '100%', height: '100%'}} resizeMode="contain"/>
                                                      </View>
                                                    ):(
                                                        <View/>
                                                    )}

                                                    </View>
                                                )}
                                            </View>
                                            

                                        )}
                                    </View>
                                ):(
                                    <View>

                                    </View>
                                )}

                                {orderData.credit_status !== "0" ? (
                                    <View style={{marginTop:10}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Total Dues : </Text>
                                        <Text style={{color:'black',fontWeight:'normal',fontSize:16}}>₹ {orderData.credit_repay_date}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:5}}>
                                        <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Payment Due Date : </Text>
                                        <Text style={{color:'black',fontWeight:'normal',fontSize:16}}>{orderData.payment_credit}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:5,alignItems:'center'}}>
                                        <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Credit Payment URL : </Text>
                                        
                                        <TouchableOpacity style={{backgroundColor:'#f36523',justifyContent:'center',alignItems:'center',width:120,height:50,borderRadius:25}}
                                        
                                        onPress = {() =>{
                                            var options = {
                                                description: '',
                                                image: userImage,
                                                currency: 'INR',
                                                key: 'rzp_live_5L6aXiDVB1aqeP',
                                                amount: parseInt(totalValue) * 100,
                                                name: userName,
                                                prefill: {
                                                email: userEmail,
                                                contact: userMobile,
                                                name: userName
                                                },
                                                theme: {color: '#F37254'}
                                            }
                                                RazorpayCheckout.open(options).then((data) => {
                                                // handle success
                                                Alert.alert("Success",`Your Due paid successfully: ${data.razorpay_payment_id}`);

                                            }).catch((error) => {
                                                // handle failure
                                                alert(""+error.description);
                                            });
                                        }}

                                        >
                                            <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Click Here</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                ):(<View/>)}

                                <Text style={{color:'black',fontWeight:'bold',fontSize:16,marginTop:10}}>Order Items</Text>
                                {user != null ?(
                                    <View>
                                        {user.role === "2" ? (
                                            <FlatList
                                                data={orderData.item}
                                                renderItem={_renderItem}
                                                keyExtractor={item => item.id}
                                            />
                                        ):(
                                        <FlatList
                                            data={orderData.item}
                                            renderItem={_B2BRenderItem}
                                            keyExtractor={item => item.id}
                                        />
                                        )}
                                    </View>

                                ):(<View/>)}

                                </View>

                                <Modal
                                        animationType="slide"
                                        transparent={false}
                                        visible={modalVisible}
                                        // onRequestClose={() => {
                                        //   setModalVisible(!modalVisible);
                                        // }}
                                        >
                                            <View style={stylesmodal.container}>
                                                    <View style={stylesmodal.mainContainer}>
                                                        <View style={stylesmodal.headerView}>
                                                            <View style={stylesmodal.titleView}>
                                                                <Text style={stylesmodal.title}>Goods Return</Text>
                                                            </View>

                                                            <View style={stylesmodal.iconView}>
                                                                <TouchableOpacity style={stylesmodal.iconStyle} onPress={() => setModalVisible(!modalVisible)}>
                                                                <Image source={Images.icons.close} style={stylesmodal.iconStyle} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={{height:1,backgroundColor:'#ededed'}}/>
                                                        {/* <Content> */}
                                                        <View style={stylesmodal.mainContainer1}>
                                                            <View style={{flexDirection:'row',marginTop:10,marginEnd:10}}>
                                                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>
                                                                    Note: 
                                                                </Text>
                                                                <Text style={{fontSize:16,marginEnd:20,textAlign:'justify',marginStart:8,fontWeight:'normal',color:'black'}}>
                                                                No Refund will be provided for goods return. You can exchange or replace the goods. For any queries, please contact support.
                                                                </Text>

                                                            </View>

                                                            <Text style={{color: "black", fontSize: 16,marginTop:10,justifyContent:'center', fontWeight: "bold"}}>
                                                                Reason of Return
                                                            </Text>

                                                            <View style={{height:50,backgroundColor:'#eeeeee',marginTop:10,borderRadius:5}}>

                                                                <RNPickerSelect
                                                                        placeholder={departmentPlaceholder}
                                                                        //items={data}
                                                                        items={[
                                                                            { label: 'Exchange', value: 'Exchange' },
                                                                            { label: 'Replace', value: 'Replace' },
                                                                        ]}
                                                                        onValueChange={value => {
                                                                            setDepartment(value)
                                                                            // var selected = data.filter(function (item) {
                                                                            //     if (item.value === value) {
                                                                            //         return item
                                                                            //     }
                                                                            // })
                                                                            // console.log(selected, "selectedselectedselectedselected")
                                                                            //getUserType(selected[0])
                                                                        }}
                                                                        style={{
                                                                            ...pickerSelectStyles,
                                                                            placeholder: {
                                                                                color: 'grey',
                                                                            },
                                                                        }}
                                                                        //value={userType}
                                                                        useNativeAndroidPickerStyle={false}

                                                                    />
                                                            </View>

                                                            {/* <View style={{height:50,backgroundColor:'#eeeeee',marginTop:10,borderRadius:5}}>
                                                                <TextInput
                                                                    style={{height: 50,
                                                                        margin: 1,
                                                                        flex:1,
                                                                        fontSize:16,
                                                                        color:'black',
                                                                        borderColor:'#ededed',
                                                                        borderRadius:5,
                                                                        paddingStart:8,
                                                                        borderWidth: 1,}}
                                                                    placeholder="Reason"
                                                                    editable = {false}
                                                                    value = {reasonOfReturn}
                                                                    onChangeText={(return_reason) => setReasonOfReturn(return_reason)}
                                                                    keyboardType='default'
                                                                />
                                                            </View> */}

                                                            <Text style={{color: "black", fontSize: 16,marginTop:10,justifyContent:'center', fontWeight: "bold"}}>
                                                                Return Note
                                                            </Text>

                                                            <View style={{height:50,backgroundColor:'#eeeeee',marginTop:10,borderRadius:5}}>
                                                                <TextInput
                                                                    style={{height: 50,
                                                                        margin: 1,
                                                                        flex:1,
                                                                        fontSize:16,
                                                                        color:'black',
                                                                        borderColor:'#ededed',
                                                                        borderRadius:5,
                                                                        paddingStart:8,
                                                                        borderWidth: 1,}}
                                                                    placeholder="Note"
                                                                    value = {returnNote}
                                                                    onChangeText={(return_note) => setReturnNote(return_note)}
                                                                    keyboardType='default'
                                                                />
                                                            </View>

                                                            <Text style={{color: "black", fontSize: 16,marginTop:10,justifyContent:'center', fontWeight: "bold"}}>
                                                            Return Attachment
                                                            </Text>

                                                            <View style={{height:50,backgroundColor:'#eeeeee',flexDirection:'row',marginTop:10,borderRadius:5}}>
                                                            
                                                            <View style={{flex:0.3,justifyContent:'center'}}>

                                                                <TouchableOpacity style={{padding:10,backgroundColor:'white',justifyContent:'center',alignItems:'center',marginStart:6,marginEnd:6,borderRadius:8}}
                                                                onPress={() => onSelectPicker()}
                                                                >
                                                                    <Text style={{fontSize:14,fontWeight:'bold',color:'black'}}>Choose</Text>
                                                                </TouchableOpacity>

                                                            </View>

                                                            <View style={{flex:0.7,padding:10,justifyContent:'center'}}>
                                                            <Text style={{fontSize:14,fontWeight:'normal',color:'black'}}>{fileChosenText}</Text>
                                                            </View>

                                                            </View>

                                                            <View style={{marginTop:15}}>
                                                                <LinearGradientButton title="Submit" onPress={() => {
                                                                    if(department !== null){
                                                                        if(profilePicBase64 !== '' && profilePicBase64 !== null && profilePicBase64 !== undefined){
                                                                                        const frmdetails = {
                                                                                            'user_id': userId,
                                                                                            'order_id': orderData.order_id,
                                                                                            'reason_of_return': department,
                                                                                            'return_note': returnNote,
                                                                                            'return_attachment': profilePicBase64
                                                                                        }
                                                                                        console.log(frmdetails);
                                                                                        Services(Constants.API_BASE_URL + "/goods_return", frmdetails,"POST").then((response) => {
                                                                                            console.log("Updateeeee",response);
                                                                                            if(response.status === 1){
                                                                                                Alert.alert("Success",response.msg)
                                                                                                getProductDetails()
                                                                                                setModalVisible(false)
                                                                                            }else{
                                                                                                Alert.alert("Failed",response.msg)
                                                                                            }
                                                                                        })
                                                                        }else{
                                                                            Alert.alert("ALERT","Please upload Image/ Video for better understanding.")
                                                                        }
                                                                    }else{
                                                                        Alert.alert("ALERT","Please Select Reason for Return.")
                                                                    }
                                                                }}/>
                                                            </View>
                                                        </View>
                                                            
                                                        {/* </Content> */}
                                                    </View>
                                                </View>
                                            </Modal>
                    </ScrollView>
                    </SafeAreaView>
            )}
            
        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        color: 'black',
        fontFamily:'Montserrat-Medium'
    },
    inputAndroid: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: 'black',
        fontFamily:'Montserrat-Medium'
    },
});
