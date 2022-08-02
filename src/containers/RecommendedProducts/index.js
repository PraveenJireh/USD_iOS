import React,{useState,useEffect} from 'react'
import { View, Text, FlatList,Image,BackHandler,ImageBackground,TouchableOpacity, ScrollView } from 'react-native'
import { Header } from "@components";
import { Constants,Images } from "@themes";
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';

export default function RecommendedProducts() {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(0);
  const [userRole, setUserRole] = useState(0);
  const [newCollectionData, setNewCollectionData] = useState([]);
  const [fcmTokenValue,setFcmToken] = useState('');
  const [scrollEndMessage,setScrollEndMessage] = useState('*****');
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        setFcmToken(fcmToken)
      //console.log(fcmToken);
    } 
    }

  //console.log(data);
  useEffect(() => {
      getData(),
      getNewCollectionProducts(),
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

  const getData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('@USER_ID')
        if(user_id !== null) {
          setUserId(user_id)
          getUserData(user_id);
        }
      } catch(e) {
        // error reading value
      }
    }
    
    function getUserData(user_id) {
      if(user_id !== null) {
        Services(Constants.API_BASE_URL + "get_user_details", {'user_id':user_id},"POST")
        .then((response) => {
            //console.log("Get User Detailsssss",response.data);
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

  const getNewCollectionProducts = async () => {
    Services(Constants.API_BASE_URL + "/recommended_products","GET")
        .then((response) => {
            //console.log(response.data);
            if(response.status === 1){
              setNewCollectionData(response.data)
            }else{
                alert(response.msg)
            }
        })
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

  const numColumns = 2;

      function formatData(newCollectionData, numColumns){
          const totalRows = Math.floor(newCollectionData.length / numColumns)

          let totalLastRow = newCollectionData.length - (totalRows * numColumns)


          while(totalLastRow !== 0 && totalLastRow !== numColumns){
            newCollectionData.push({key:'blank', empty : true})
              totalLastRow++
          }

          return newCollectionData
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
              <Text numberOfLines={2} style={styles.title}>{item.product_name}</Text>
              
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
              <Header title="Recommended Products" />
          </View>

          <View style={{ marginBottom: 10,marginTop:10,flex:1 }}>

              {newCollectionData.length != 0 ? (

                <ScrollView showsVerticalScrollIndicator={null}>
                  <View  style={{flex: 1}}>
                        <FlatList
                            data={formatData(newCollectionData,numColumns)}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                            numColumns={numColumns}
                            columnWrapperStyle={{justifyContent:'space-between', }}
                            showsHorizontalScrollIndicator={false}
                            style={{marginTop:0,padding:0}}
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
              <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>No Products Under this Category.</Text>
              </View>
            )}
              </View>
      </View>
  )
}
