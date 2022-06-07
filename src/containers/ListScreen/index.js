import React,{useState,useEffect} from 'react'
import { View, Text, ScrollView,FlatList,BackHandler, Image, TouchableOpacity, TextInput,ToastAndroid } from 'react-native'
import { HeaderProductList, ListProduct } from "@components";
import { Search } from "@common";
import { Colors, Images,Constants } from "@themes";
import styles from './styles';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import Services from "@Services";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
export default function ListScreen({ route }) {
    const navigation = useNavigation();
    const { categoryId } = route.params;
    var category_id = categoryId;
    //alert(category_id)

    const [data, setData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [isSearch, isSetSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');

    const isFocused = useIsFocused();

    const [cartDataItem, setCartDataItem] = useState([]);
    const [cartData, setCartData] = useState({});

    const [fcmTokenValue,setFcmToken] = useState('');

    const [scrollEndMessage,setScrollEndMessage] = useState('*****');

    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
          setFcmToken(fcmToken)
        //console.log(fcmToken);
      } 
      }

    
    useEffect(() => {

        getData(),
        getScrollEndMessage()
        // const backAction = () => {
        //     // Alert.alert("Urban Stop Design", "Are you sure you want to Exit USD App?", [
        //     //   {
        //     //     text: "Cancel",
        //     //     onPress: () => null,
        //     //     style: "cancel"
        //     //   },
        //     //   { text: "YES", onPress: () => BackHandler.exitApp() }
        //     // ]);
        //     navigation.pop()
        //     return true;
        //   };
      
        //   const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     backAction
        //   );
      
        //   return () => backHandler.remove();
      }, [isFocused])

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
              getCartData(user_id)
            }else{
                setCartData(null)
            }
          } catch(e) {
            // error reading value
          }
        
        Services(Constants.API_BASE_URL + "/product_list_by_category",{"category_id":category_id},"POST")
            .then((response) => {
                //console.log(response.data);
                if(response.status === 1){
                    setData(response.data)
                }else{
                    alert(response.msg)
                }
            })
      }

      function getCartData(user_id) {
        Services(Constants.API_BASE_URL + "view_cart/"+user_id,"GET")
            .then((response) => {
                console.log(Constants.API_BASE_URL + "view_cart/"+user_id)
                if(response.status === 1){
                    setCartData(response.data)
                    if(response.data != null){
                        setCartDataItem(response.data.item)
                    }
                    
                }else{
                    console.log(response.msg)
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

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          isSetSearch(true)
          setSearch(text);
          Services(Constants.API_BASE_URL + "/get_product_search",{"search_name":text},"POST")
            .then((response) => {
                //console.log(response.data);
                if(response.status === 1){
                    setSearchData(response.data)
                }else{
                    alert(response.msg)
                }
            })
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setSearch(text);
          isSetSearch(false)
        }
      };

      const numColumns = 2;

      function formatData(data, numColumns){
          const totalRows = Math.floor(data.length / numColumns)
  
          let totalLastRow = data.length - (totalRows * numColumns)
  
  
          while(totalLastRow !== 0 && totalLastRow !== numColumns){
            data.push({key:'blank', empty : true})
              totalLastRow++
          }
  
          return data
      }

      const numColumns1 = 2;

      function formatSearchData(searchData, numColumns1){
          const totalRows = Math.floor(searchData.length / numColumns1)
  
          let totalLastRow = searchData.length - (totalRows * numColumns1)
  
  
          while(totalLastRow !== 0 && totalLastRow !== numColumns1){
            searchData.push({key:'blank', empty : true})
              totalLastRow++
          }
  
          return searchData
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
            <View style={{flexDirection: "row", backgroundColor: '#eef1fc',height:50,paddingHorizontal:15}}>
                    <View style={styles.leftIconView}>
                        <TouchableOpacity onPress={() => navigation.pop()}>
                            <Image style={styles.menuIcon} source={Images.icons.back} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.middleView}>
                        
                    </View>

                    <View style={styles.rightIconView}>
                        <TouchableOpacity onPress={() => 
                        {
                            if(userId === ''){
                            navigation.navigate("SignIn")
                            if (Platform.OS === 'android') {
                                ToastAndroid.showWithGravity("Please Login your account", ToastAndroid.SHORT,ToastAndroid.CENTER)
                            } else {
                                AlertIOS.alert("Please Login your account");
                            }
                            
                            }else{
                            navigation.navigate("MyCart")
                            }}
                        }>

                        { cartData !== null && cartData !== undefined ?  (
                            <View style={{width:18,height:18,borderRadius:9,backgroundColor:'red',alignSelf:'flex-end',
                            position: 'relative',top: 0,right: 0,marginStart:15,marginBottom: 0,left: 0,opacity: 1}}>

                                    <Text style={{fontSize:12,color:'white',alignSelf:'center',marginStart:0}}>
                                    {cartDataItem.length}
                                    </Text>

                            </View>
                          ):(
                            <View style={{width:18,height:18,borderRadius:9,backgroundColor:'#eef1fc',alignSelf:'flex-end',
                            position: 'relative',top: 0,right: 0,marginStart:15,bottom: 0,left: 0,opacity: 1}}/>
                          )}

                            <Image style={styles.cartIcon} source={Images.icons.cart} />
                        </TouchableOpacity>
                    </View>
                {/* <HeaderProductList /> */}
            </View>
            <View style={styles.search}>

            <View style={{flexDirection: 'row',
        backgroundColor: "white", borderRadius: 5,
        alignItems: 'center', paddingLeft: 10,backgroundColor:'#f7f8fc',height:50}}>
                <Image source={Images.icons.search} style={{height: 18, width: 18, tintColor: "orange"}} />
                <TextInput
                        placeholder="Search here..."
                        // onChangeText={onChangeSearch}
                        onChangeText={(text) => searchFilterFunction(text)}
                        // value={searchQuery}
                        value={search}
                        placeholderTextColor={'orange'}
                        style={{flex:1,marginLeft: 10, margin: 0, padding: 0}}
                        />
            </View>
            
                {/* <Search /> */}
            </View>

            {isSearch !== true ? (
                <View style={{flex:1}}>
                        <View style={styles.category}>
                            <View style={{flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                                <Image source={Images.icons.category} style={styles.gridIcon} />
                                <Text style={styles.text}>Categories</Text>
                            </View>
                            <TouchableOpacity style={{flex:1}} onPress={() => navigation.push("Filter")}>
                            <View style={{flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                            <Image source={Images.icons.filter} style={styles.gridIcon} />
                                <Text style={styles.text}>Filter</Text>              
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 0,backgroundColor:'white',paddingBottom:10,flex:1 }}>

                        {data.length != 0 ? (
                            <ScrollView showsVerticalScrollIndicator={null}>
                            <View  style={{flex: 1}}>
                                <FlatList
                                    data={formatData(data,numColumns)}
                                    renderItem={_renderItem}
                                    keyExtractor={item => item.id}
                                    numColumns={numColumns}
                                    columnWrapperStyle={{justifyContent:'space-between', }}
                                    showsHorizontalScrollIndicator={false}
                                    style={{marginBottom:5,padding:2}}
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
            ) : (
                <View style={{flex: 1}}>
                {searchData.length != 0 ? (
                    <ScrollView showsVerticalScrollIndicator={null}>
                    <View  style={{flex: 1}}>
                        <FlatList
                            data={formatSearchData(searchData,numColumns1)}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                            numColumns={numColumns1}
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
                        <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>No Products Found.</Text>
                        </View>
                    )}
                </View>
            )}
                

        </View>
    )
}
