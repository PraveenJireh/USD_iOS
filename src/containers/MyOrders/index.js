import React,{useState,useEffect,useContext} from 'react'
import { View, Text, FlatList,BackHandler, TouchableOpacity, Image,ActivityIndicator } from 'react-native'
import { Header } from "@components";
import { Constants, Images, Colors } from "@themes";
import styles from './styles';
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { NotificationContext } from '@context/notification-context';
import base64 from 'react-native-base64';

export default function MyOrders() {

    const navigation = useNavigation();
    const [myOrdersData, setMyOrdersData] = useState({});
    const [data, setData] = useState(null);
    const [userId, setUserId] = useState(0);
    const [userRole, setUserRole] = useState(0);
    const [loading, setLoading] = useState(false);
    const { notification, setNotification } = useContext(NotificationContext);
    const isFocused = useIsFocused();
    //console.log(data);
    useEffect(() => {
        getData()

        const backAction = () => {

            if (!navigation.isFocused()) {
                return false;
              }
              
            navigation.navigate("Home")
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [isFocused])

    const getData = async () => {
        try {
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            setUserId(user_id)
            getUserData(user_id);
            getCartDetails(user_id)
          }
        } catch(e) {
          // error reading value
        }
      }
      
      function getUserData(user_id) {
        if(user_id !== null) {
          Services(Constants.API_BASE_URL + "get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              //console.log("Get My Order Detailsssss",response.data);
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
        setLoading(true);
        Services(Constants.API_BASE_URL + "my_order/"+user_id,"GET")
        .then((response) => {
            //console.log("Get My Order Detailsssss",response.data);
            if(response.status === 1){
                setMyOrdersData(response.data)

                Services(Constants.API_BASE_URL + "/get_all_unread_notification",{"user_id":user_id},"POST")
                .then((notificationresponse) => {
                    console.log(notificationresponse.data);
                    if(notificationresponse.status === 1){
                        setNotification(notificationresponse.notificationDetails);
                        setLoading(false);
                    }else{
                        setNotification(null);
                        setLoading(false);
                        //alert(response.msg)
                    }
                })
                setLoading(false);
            }else{
                alert(response.msg);
                setLoading(false);
            }
        })
    }

    const orderNavigation = async (item) => {
        navigation.navigate("OrderDetails", {
            orderId: item.order_id
        });
      }

    function _renderItem({ item, index }) {
        return (
        <TouchableOpacity onPress={orderNavigation.bind(this, item)}>
            <View style={styles.row}>
                <View style={{ flex: 0.3, }}>
                    <Image source={{ uri: item.product_img }}
                        style={{ height: 80, width: 80 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.7 }}>
                    <Text style={styles.title}>{item.product_name}</Text>
                    <Text style={styles.price}>₹ {item.payment_total}</Text>
                    <View style={{flex:1,flexDirection:"row"}}>
                    <Text style={styles.qty}>Size : {item.size}</Text>
                    <Text style={styles.qty}>Items : {item.item_count}</Text>
                    </View>
                    
                    {item.order_status === "Delivered" ? (
                        <View style={{marginTop:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'black',fontWeight:'bold',fontSize:14}}>Status : </Text>
                            <Text style={{color:'green',fontWeight:'bold',fontSize:14}}>{item.order_status}</Text>
                        </View>
                        ) : (
                            <View style={{marginTop:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Status : </Text>
                            <Text style={{color:'orange',fontWeight:'bold',fontSize:14}}>{item.order_status}</Text>
                        </View> 
                        )}

                    <View style={{flex:1,flexDirection:"row"}}>
                    <Text style={{  color: "black", 
                                    fontSize: 14, 
                                    marginTop: 5,
                                    fontWeight:'bold'  }}>Date : </Text>
                    <Text style={{color:"#cccccc",marginTop: 5,fontWeight:'bold'}}>{item.order_date}</Text>
                    </View>

                    {item.order_status === "Delivered" ? (
                        <View>
                            {item.item_count === 1 ? (
                                <TouchableOpacity 
                                    onPress={()=> {
                                        navigation.navigate("ProductDetails", {
                                            productId: item.product_id,
                                            productURL:item.base_url,
                                            orderRating:"?order_id="+base64.encode(item.order_id)+"#product-review"
                                        });
                                    }}
                                    style={{marginTop:10,alignSelf:'flex-end'}}>
                                    <View style={{padding:10}}>
                                        <Text style={{fontSize:15,color:'#337ab7',fontWeight:'400'}}>Write a Review</Text>
                                    </View>
                                </TouchableOpacity>
                            ):(
                                <View/>
                            )}
                        </View>
                        ) : (
                        <View/> 
                    )}
                
                </View>
            </View>
            </TouchableOpacity>

        )
    }
    return (
        <View style={styles.container}>
            
                <View style={{flex:1}}>

                        <View style={styles.header}>
                            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center',}}>
                                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                                    <Image style={{height: 35, width: 35, tintColor: Colors.black }} source={Images.icons.back} />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', color: "black", fontSize: 16}}>My Orders</Text>
                            </View>

                            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center',}}>

                            </View>
                        {/* <Header title="Products" /> */}
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
                    <View style={styles.content}>
                        {/* {userId !== '' ? ( */}
                            {myOrdersData.length != 0 ? (
                                <FlatList
                                    data={myOrdersData}
                                    renderItem={_renderItem}
                                    keyExtractor={item => item.id}
                                />
                                ) : (
                                    <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                                    <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>We are waiting for your First Order.</Text>
                                    </View>
                                )}

                            {/* ):(
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    
                                </View>
                            )} */}
                        </View>
                    )}
                    

                </View>
            
        </View>
    )
}
