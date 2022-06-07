import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, TextInput, RefreshControl, Dimensions, ScrollView, BackHandler, Share, Alert, ToastAndroid, PermissionsAndroid, Linking } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { CarouselCmp, HotSale, Recommended, HeaderHome, BestSelling, NewCollection, FeaturedBrand, SideBar } from '@components'
import { Search } from "@common";
import styles from './styles';
import { Constants, Images, Colors } from '@themes'
const { width } = Dimensions.get("window")
import AsyncStorage from "@react-native-async-storage/async-storage";
import Services from "@Services";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { NotificationContext } from '@context/notification-context';
import { UserContext } from '@context/user-context';
import { CartContext } from '@context/cart-context';
import messaging from '@react-native-firebase/messaging';
import { checkForVersion } from 'react-native-app-version-force-update';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import { TokenContext } from '@context/token-context';
import firebase from '@react-native-firebase/messaging';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const shareOptions = {
  title: 'Title',
  message: 'Message to share', // Note that according to the documentation at least one of "message" or "url" fields is required
  url: 'www.example.com',
  subject: 'Subject'
};

export default function Home() {

  const { user, setUser } = useContext(UserContext);
  const { notification, setNotification } = React.useContext(NotificationContext);
  const { cartCount, setCartCount } = React.useContext(CartContext);
  const { fcmToken } = React.useContext(TokenContext);
  //console.log(user)
  const [offerSliderData, setOfferSliderData] = useState([]);
  const [newCollectionData, setNewCollectionData] = useState([]);
  const [unReadNotificationData, setUnReadNotificationData] = useState([]);
  const [bestSellerData, setBestSellerData] = useState([]);
  const [featuredProductsData, setFearturedProductsData] = useState([]);
  const [hotSaleData, setHotSaleData] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [isSearch, isSetSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [userId, setUserID] = useState('');
  const isFocused = useIsFocused();

  const [cartDataItem, setCartDataItem] = useState([]);
  const [cartData, setCartData] = useState(null);

  const [shouldShow, setShouldShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  let currentCount = 0;

  const [refreshing, setRefreshing] = React.useState(false);
  const [fcmTokenValue1, setFcmToken] = useState('');

  const [scrollEndMessage, setScrollEndMessage] = useState('*****');
  function permision() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      ).then((result) => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
          && result['android.permission.CAMERA']
          && result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.READ_EXTERNAL_STORAGE']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
          //this.setState({
          permissionsGranted: true;
          //});
        } else if (result['android.permission.ACCESS_COARSE_LOCATION']
          || result['android.permission.CAMERA']
          || result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.READ_EXTERNAL_STORAGE']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
          this.refs.toast.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
        }
      });
    }
    // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    //     PermissionsAndroid.PERMISSIONS.CAMERA)    
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() =>
      setRefreshing(false),

      getData(),
      offerSlider(),
      getNewCollectionProducts(),
      BestSellerProducts(),
      featuredProducts(),
      getHotSaleProducts(),
      getRecommendedProducts(),
      getScrollEndMessage()
    );
  }, 3000);

  const backAction = () => {

    if (!navigation.isFocused()) {
      return false;
    }

    if (shouldShow) {
      setShouldShow(!shouldShow);
      setSearch(null);
      isSetSearch(false);
    } else {

      if (currentCount < 1) {
        currentCount += 1;

        ToastAndroid.show("Press again to exit.", ToastAndroid.SHORT);

      } else {
        BackHandler.exitApp()
      }
      setTimeout(() => {
        currentCount = 0;
      }, 2000);

    }

    return true;
  };
  // const showNotification = notification => {
  // setNotificationAndroid(notification.data);
  //console.log(notification.data)
  // PushNotification.localNotification({
  //   title: notification.title,
  //   message: notification.body,
  //   foreground: true,
  //   largeIcon: "ic_launcher",
  //   bigLargeIcon: "ic_launcher",
  //   userInteraction: true,
  //   requestPermissions: true,
  //   channelId: notification.data.notificationType === "1" ? "my-channel" : "fcm_fallback_notification_channel"
  // });
  // };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(response => {
        // console.log('Message handled in the getInitialNotification!', response);
        if (response) showNotification(response, "background");
      });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      // console.log('Message handled in the quit state!', remoteMessage);
      showNotification(remoteMessage, "quit");
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // When app in foreground
      // console.log('Message handled in the foregroud!', remoteMessage);
      showNotification(remoteMessage);
    });



    return () => {
      return unsubscribe;
    };

  }, [])




  const showNotification = (remoteMessage, appState) => {
    console.log(remoteMessage.data, "------", appState, "setBackgroundMessageHandler---------")
    if (remoteMessage.data) {
      // console.log("1---------")

      if (remoteMessage.data.pageType && remoteMessage.data.pageType === "product") {
        if (appState) {
          goToDetails(remoteMessage)
        } else {
          Alert.alert(
            "Usdfab New Notification!",
            "New Product Available.",
            [
              {
                text: "Cancel",
              },
              {
                text: "Ok", onPress: () => goToDetails(remoteMessage)

              }
            ]
          );

        }
      }
    }

  }
  const goToDetails = (remoteMessage) => {
    navigation.navigate("ProductDetails", {
      productId: remoteMessage.data.productId,
      productURL: remoteMessage.data.productUrl,
      orderRating: "",
      fcmTokenValue: fcmToken
      // fcmTokenValue: "e1vnMuo3RsWEiQQn5Xvr8B:APA91bHREaNEx-kj5Ey2WtnkUrx253hfAwmbgvdiQPwvCJjfIBo-s8XjStjf9yZG9YFWap3y4Lb7AQk4fsm8w5lJCrtKH0JdZbHHQICWIlJ7gOTikw3Rrt2hLm2AXRgXCfZm5FZbiKVs"
    })
  }
  useEffect(() => {
    let componentMounted = true;
    if (componentMounted) {
      getData(),
        offerSlider(),
        getNewCollectionProducts(),
        BestSellerProducts(),
        featuredProducts(),
        getHotSaleProducts(),
        getRecommendedProducts(),
        permision(),
        checkAppVersion(),
        getScrollEndMessage()
    }

    //getUnReadNotificationCount()

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      componentMounted = false;
    }

    //return () => backHandler.remove();
  }, [isFocused, shouldShow]);

  function getScrollEndMessage() {
    Services(Constants.API_BASE_URL + "/settings", "GET")
      .then((response) => {
        if (response !== null) {
          setScrollEndMessage(response.quotes)
        }
      })
  }

  function checkAppVersion() {
    Services(Constants.API_BASE_URL + "/settings", "GET")
      .then((response) => {
        if (response.app_version !== null) {
          console.log("App In Version::: " + DeviceInfo.getVersion())
          if (DeviceInfo.getVersion() !== response.app_version) {
            // Alert.alert(
            //   "Usdfab New Update!",
            //   "New Update Available. Please Update and use new features.",
            //   [
            //     {
            //       text: "UPDATE", onPress: () => {
            //         Linking.openURL("https://play.google.com/store/apps/details?id=com.usd");
            //       }
            //     },
            //     {
            //       text: "NO THANKS"
            //     }
            //   ]
            // );
          }
        }
      })
  };

  const productNavigation = async (item) => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setFcmToken(fcmToken)
      navigation.navigate("ProductDetails", {
        productId: item.id,
        productURL: item.base_url,
        orderRating: "",
        fcmTokenValue: fcmToken
      });
    }
    // navigation.navigate("ProductDetails", {
    //   productId: item.id,
    //   productURL:item.base_url,
    //   fcmTokenValue:fcmTokenValue1
    // });
  }


  const getData = async () => {
    try {
      const user_id = await AsyncStorage.getItem('@USER_ID')
      //alert(user_id)
      if (user_id !== null) {
        // value previously stored
        setUserID(user_id),
          getUnReadNotificationCount(user_id),
          getCartData(user_id)
        //getUnReadNotificationCount(user_id)
        //alert(user_id)
      } else {
        setCartData(null)
      }
    } catch (e) {
      // error reading value
      setCartData(null)
    }
  }


  function getCartData(user_id) {
    // if(user !== null){
    Services(Constants.API_BASE_URL + "view_cart/" + user_id, "GET")
      .then((response) => {
        console.log("Cart");
        //console.log(Constants.API_BASE_URL + "view_cart/"+user_id)
        if (response.status === 1) {
          setCartData(response.data)
          setCartCount(response.data)
          if (response.data != null) {
            setCartDataItem(response.data.item)
          }
          //alert(response.msg)
        } else {
          setCartData(null);
          setCartCount(null);
          //alert(response.msg)
        }
      })
    // }else{
    //   setCartCount(null);
    // }
  }

  const offerSlider = async () => {
    Services(Constants.API_BASE_URL + "/offer_slider", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setOfferSliderData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }

  function getUnReadNotificationCount(user_id) {
    //if(user !== null){
    Services(Constants.API_BASE_URL + "/get_all_unread_notification", { "user_id": user_id }, "POST")
      .then((notificationresponse) => {
        console.log("Notification");
        //console.log(notificationresponse.data);
        if (notificationresponse.status === 1) {
          setNotification(notificationresponse.notificationDetails);
          //setLoading(false);
          //alert(response.msg)
        } else {
          setNotification(null);
          //setLoading(false);
          //alert(response.msg)
        }
      })
    // }else{
    //   setNotification(null);
    // }
  }

  const getNewCollectionProducts = async () => {
    Services(Constants.API_BASE_URL + "/new_collection_products", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setNewCollectionData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }

  const getHotSaleProducts = async () => {
    Services(Constants.API_BASE_URL + "/hot_sale_products", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setHotSaleData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }

  const getRecommendedProducts = async () => {
    Services(Constants.API_BASE_URL + "/recommended_products", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setRecommendedData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }

  const BestSellerProducts = async () => {
    Services(Constants.API_BASE_URL + "/best_selling_products", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setBestSellerData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }

  const featuredProducts = async () => {
    Services(Constants.API_BASE_URL + "/featured_products", "GET")
      .then((response) => {
        //console.log(response.data);
        if (response.status === 1) {
          setFearturedProductsData(response.data)
        } else {
          alert(response.msg)
        }
      })
  }


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      isSetSearch(true)
      setSearch(text);
      setLoading(true);
      Services(Constants.API_BASE_URL + "/get_product_search", { "search_name": text }, "POST")
        .then((response) => {
          //console.log(response.data);
          if (response.status === 1) {
            setSearchData(response.data);
            setLoading(false);
          } else {
            alert(response.msg);
            setLoading(false);
          }
        })
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setSearch(text);
      isSetSearch(false)
    }
  };

  const onShare = async () => {

    Share.share({
      message: 'BAM: we\'re helping your business with awesome React Native apps',
      url: 'http://bam.tech',
      title: 'Wow, did you see that?'
    }, {
      // Android only:
      dialogTitle: 'Share BAM goodness',
      // iOS only:
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    })
  };

  const numColumns = 2;

  function formatData(searchData, numColumns) {
    const totalRows = Math.floor(searchData.length / numColumns)

    let totalLastRow = searchData.length - (totalRows * numColumns)


    while (totalLastRow !== 0 && totalLastRow !== numColumns) {
      searchData.push({ key: 'blank', empty: true })
      totalLastRow++
    }

    return searchData
  }


  function _renderItem({ item, index }) {
    if (item.empty) {
      return <View style={styles.itemInvisible} />
    }
    return (
      <View style={{ flex: 1, padding: 0, borderColor: '#cccccc', borderWidth: 0.5 }}>
        <TouchableOpacity style={[styles.searchrow]} onPress={productNavigation.bind(this, item)}>

          <View style={{ flex: 1, height: 250, backgroundColor: '#f7f8fc', padding: 5 }}>
            <Image source={{ uri: item.thumbnail }} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} resizeMode="contain">

            </Image>
          </View>

          <View style={{ backgroundColor: 'white', padding: 5 }}>
            <Text
              numberOfLines={2}
              style={styles.title}>{item.product_name}</Text>

            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "orange" }}>
                Design No :
              </Text>

              <Text style={{ fontSize: 14, fontWeight: "bold", color: "black" }}>
                {item.sku}
              </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
              <Text style={{
                fontSize: 14, fontWeight: "bold", marginTop: 0,
                color: "red",
              }}>{'\u20B9'}{" "}{item.discount_price}</Text>

              <Text style={{
                fontSize: 14, marginStart: 15, fontWeight: "bold", marginTop: 0, textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                color: "grey", alignSelf: 'flex-end', alignContent: 'flex-end'
              }}>{'\u20B9'}{" "}{item.price}</Text>
              <View style={{ width: 1, height: 10, backgroundColor: 'lightgrey', marginStart: 15, marginEnd: 15 }} />

              <View style={{ flexDirection: 'row', alignSelf: 'center', borderRadius: 0, padding: 0 }}>
                <Text style={{ color: 'orange', fontSize: 12 }}>{item.rating}</Text>
                <Image style={{ width: 12, height: 12, marginLeft: 8, tintColor: 'orange', alignSelf: 'center' }} source={Images.icons.star} />

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
        {/* <HeaderHome /> */}

        <View style={{ flex: 1, flexDirection: "row", backgroundColor: '#eef1fc', paddingHorizontal: 15 }}>

          {!shouldShow ? (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                navigation.openDrawer()
              }}>
                <Image style={{ height: 25, width: 25, tintColor: Colors.black }} source={Images.icons.menu} />
              </TouchableOpacity>

              <Image style={{ height: 25, width: 75, resizeMode: 'stretch', tintColor: Colors.black, marginStart: 10 }} source={Images.icons.usdHome} />
            </View>
          ) : null}
          {shouldShow ? (
            <View style={styles.search}>
              {/* <Search /> */}
              <View style={{
                flexDirection: 'row',
                backgroundColor: "white", borderRadius: 0,
                alignItems: 'center', borderWidth: 0.3, borderColor: 'lightgrey', paddingLeft: 10, height: 50, marginBottom: 0
              }}>
                <Image source={Images.icons.search} style={{ height: 20, width: 20, tintColor: "orange" }} />
                <TextInput
                  placeholder="Search here..."
                  placeholderTextColor='orange'
                  // onChangeText={onChangeSearch}
                  onChangeText={(text) => searchFilterFunction(text)}
                  // value={searchQuery}
                  value={search}
                  style={{ flex: 1, marginLeft: 10, margin: 0, fontSize: 16, color: 'black', padding: 0 }}
                />

                <TouchableOpacity onPress={() => {
                  setShouldShow(!shouldShow);
                  setSearch(null);
                  isSetSearch(false);
                }
                }>
                  <Image style={{ height: 30, marginStart: 8, width: 25, marginEnd: 15, tintColor: Colors.black }} source={Images.icons.multiply} />
                </TouchableOpacity>

              </View>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end" }}>
            {!shouldShow ? (
              <TouchableOpacity onPress={() => {
                setShouldShow(!shouldShow);
                setSearch(null);
                isSetSearch(false);
              }

              }>
                <Image style={{ height: 30, marginStart: 8, width: 25, marginEnd: 15, tintColor: Colors.black }} source={Images.icons.search} />
              </TouchableOpacity>
            ) : null}
            {!shouldShow ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity

                  onPress={() => {
                    if (user === null) {
                      navigation.navigate("SignIn")
                      if (Platform.OS === 'android') {
                        ToastAndroid.showWithGravity("Please Login your account", ToastAndroid.SHORT, ToastAndroid.CENTER)
                      } else {
                        AlertIOS.alert("Please Login your account");
                      }
                    } else {
                      navigation.navigate("Notifications")
                    }
                  }
                  }
                >
                  <View>
                    {notification !== null && notification !== undefined ? (
                      <View>
                        {notification.count !== 0 ? (
                          <View style={{
                            width: 18, height: 18, borderRadius: 9, backgroundColor: 'red', alignSelf: 'flex-end',
                            position: 'relative', top: 2, marginEnd: 6, right: 5, marginStart: 15, marginBottom: 0, left: 0, opacity: 1
                          }}>

                            <Text style={{ fontSize: 12, color: 'white', alignSelf: 'center', marginStart: 0, right: 0 }}>
                              {notification.count}
                            </Text>

                          </View>
                        ) : (
                          <View style={{
                            width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                            position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                          }}>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={{
                        width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                        position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                      }}>
                      </View>
                    )}
                    <Image style={{ height: 30, width: 25, marginEnd: 15, tintColor: Colors.black, bottom: 10 }} source={Images.icons.bell} />
                  </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  if (user === null) {
                    navigation.navigate("SignIn")
                    if (Platform.OS === 'android') {
                      ToastAndroid.showWithGravity("Please Login your account", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    } else {
                      AlertIOS.alert("Please Login your account");
                    }

                  } else {
                    navigation.navigate("MyCart")
                  }
                }
                }>

                  {cartCount === null && cartCount === undefined ? (
                    <View style={{
                      width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                      position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                    }} />
                  ) : (
                    <View>
                      {cartCount !== null && cartCount !== undefined ? (
                        <View>
                          {cartCount.item_count === '0' ? (
                            <View style={{
                              width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                              position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                            }} />
                          ) : (
                            <View style={{
                              width: 18, height: 18, borderRadius: 9, backgroundColor: 'red', alignSelf: 'flex-end',
                              position: 'relative', top: 0, right: 0, marginStart: 15, marginBottom: 0, left: 0, opacity: 1
                            }}>

                              <Text style={{ fontSize: 12, color: 'white', alignSelf: 'center', marginStart: 0 }}>
                                {cartCount.item_count}
                              </Text>

                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={{
                          width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                          position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                        }} />
                      )}
                    </View>

                  )}

                  <Image style={{ height: 25, width: 25, tintColor: Colors.black, bottom: 10, marginTop: 0 }} source={Images.icons.cart} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

      </View>

      {isSearch !== true ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
            <View style={styles.content}>
              <CarouselCmp data={offerSliderData} />
              <NewCollection data={newCollectionData} />
              <BestSelling data={bestSellerData} />
              <FeaturedBrand data={featuredProductsData} />
              <HotSale data={hotSaleData} />
              <Recommended data={recommendedData} />

              <View style={{ marginTop: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ width: 100, height: 1, backgroundColor: 'grey' }}></View>

                <Text style={{ color: 'black', fontStyle: 'italic', textAlign: 'center', fontSize: 14, marginTop: 15, marginBottom: 15 }}>
                  {scrollEndMessage}
                </Text>

              </View>
            </View>
          </ScrollView>
        </View>

      ) : (

        <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1 }}>
              {searchData.length != 0 ? (
                <FlatList
                  data={formatData(searchData, numColumns)}
                  renderItem={_renderItem}
                  keyExtractor={item => item.id}
                  numColumns={numColumns}
                  columnWrapperStyle={{ justifyContent: 'space-between', }}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 0, padding: 0 }}
                />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ justifyContent: 'center', fontWeight: 'bold', fontSize: 16, color: 'black', alignSelf: 'center', textAlign: "center" }}>No Products Found.</Text>
                </View>
              )}
            </View>
          )}
        </View>

      )}
    </View>
  )
}
