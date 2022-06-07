import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, BackHandler, ActivityIndicator, Image, FlatList, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'
import { HeaderProductList, ListProduct, CarouselProductImages } from "@components";
import { Search } from "@common";
import { Colors, Images, Constants } from "@themes";
import styles from './styles';
import { LinearGradientButton, Picker } from "@common";
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import Services from "@Services";
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { el, tr } from 'date-fns/locale';
import RNFetchBlob from "rn-fetch-blob";
import Share from 'react-native-share';
import { UserContext } from '@context/user-context';

export default function ProductDetails({ route }) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { user, setUser } = React.useContext(UserContext);

    const { productId } = route.params;
    const { productURL } = route.params;
    const { orderRating } = route.params;

    const { fcmTokenValue } = route.params;

    var product_id = productId;
    console.log(productURL, "productURLproductURL")
    var product_url = productURL;
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    const [data, setData] = useState(null);
    const [productData, setProductData] = useState([0]);
    const [userId, setUserId] = useState('');
    const [currentUr, setCurrentur] = useState('#gallery');

    const [cartDataItem, setCartDataItem] = useState([]);
    const [imagesList, setImagesList] = useState([]);
    const [cartData, setCartData] = useState(null);

    const [currentUrl, setCurrentUrl] = useState('');
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const MINUTE_MS = 2000;
    const routeName = useRoute();
    const [loading, setLoading] = useState(false);
    const webViewReff = useRef();
    let componentMounted1 = true;

    async function getNavigationStatus() {
        if (user == null) {
            try {
                const navigationStatus = await AsyncStorage.getItem("@NAVIGATION_STATUS");
                console.log("Navigation Status:::" + navigationStatus)
                if (navigationStatus == "FALSE") {
                    webViewReff.current.reload();
                    removeNavigationStatus()
                }
            }
            catch (exception) {
                return false;
            }
        }

    }

    async function removeNavigationStatus() {
        try {
            await AsyncStorage.removeItem("@NAVIGATION_STATUS");
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    useEffect(() => {
        let componentMounted = true;
        console.log("Can Go back::" + componentMounted1);

        if (componentMounted) {
            getNavigationStatus()

            getData();
            getProductDetails();

            // if(user == null){
            //     webViewReff.current.reload();
            // }

            // if(user == null){
            //     if (!navigation.isFocused()) {
            //         console.log("IS Focussed Validation::"+"  Refreshed")
            //         //webViewReff.current.reload();
            //     }else{
            //         if(canGoBack === false){
            //             //webViewReff.current.reload();
            //         }
            //         console.log("IS Focussed Validation::"+"  Not Refreshed")
            //     }
            // }

        }

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => {
            backHandler.remove();
            componentMounted = false;
        }
        //return () => backHandler.remove();

    }, [isFocused, canGoBack])

    const backAction = () => {
        //console.log(canGoBack)
        if (canGoBack === true) {
            webViewReff.current.goBack();
        } else {

            if (!navigation.isFocused()) {
                return false;
            }

            navigation.pop();
        }

        return true;
    };

    const backButtonHandler = () => {

        if (canGoBack === true) {
            webViewReff.current.goBack();
        } else {
            navigation.pop();
        }
    };

    const getData = async () => {
        let componentMounted = true;

        try {
            const user_id = await AsyncStorage.getItem('@USER_ID')
            if (user_id !== null) {
                //componentMounted1 = false;
                if (componentMounted) {
                    getUserData(user_id);
                    setUserId(user_id)
                    //getCartData(user_id)

                    const interval = setInterval(() => {
                        //console.log('Logs every 2 Sec');
                        getCartData(user_id)
                    }, MINUTE_MS);

                    return () => {
                        clearInterval(interval);
                        componentMounted = false;
                    }
                    //return () => clearInterval(interval);
                }
            } else {

                if (componentMounted1) {
                    const interval = setInterval(() => {
                        //console.log('Logs every 2 Sec');
                        Services(Constants.API_BASE_URL + "/get_cart_by_fcm", { 'user_id': fcmTokenValue }, "POST")
                            .then((response) => {
                                //console.log("Get Product Detailsssss",response.data);
                                if (response.status === 1) {
                                    componentMounted1 = false;
                                    clearInterval(interval);
                                    AsyncStorage.setItem("@NAVIGATION_STATUS", "TRUE");
                                    navigation.navigate("SignIn")
                                } else {
                                    componentMounted1 = false;
                                    //alert(response.msg)
                                }
                            })
                    }, MINUTE_MS);

                    return () => {
                        clearInterval(interval);
                        componentMounted1 = false;
                    }
                    //return () => clearInterval(interval);


                }

                setCartData(null)
            }
        } catch (e) {
            // error reading value
        }

    }

    function getProductDetails() {
        if (product_id !== null) {
            Services(Constants.API_BASE_URL + "/product_details", { 'id': productId }, "POST")
                .then((response) => {
                    //console.log("Get Product Detailsssss",response.data);
                    if (response.status === 1) {
                        setProductData(response.data)
                        setImagesList(response.data[0].images)
                    } else {
                        //alert(response.msg)
                    }
                })
        }
    }

    function getCartData(user_id) {
        Services(Constants.API_BASE_URL + "view_cart/" + user_id, "GET")
            .then((response) => {
                //console.log(Constants.API_BASE_URL + "view_cart/"+user_id)
                if (response.status === 1) {
                    setCartData(response.data)
                    if (response.data != null) {
                        setCartDataItem(response.data.item)
                    }

                } else {
                    setCartData(null)
                    //console.log(response.msg)
                }
            })
    }

    function getUserData(user_id) {
        if (user_id !== null) {
            Services(Constants.API_BASE_URL + "/get_user_details", { 'user_id': user_id }, "POST")
                .then((response) => {
                    //console.log("Get User Detailsssss",response.data);
                    if (response.status === 1) {
                        setData(response.data)
                    } else {
                        //alert(response.msg)
                    }
                })
        }
    }

    function handleOnPress() {

    }
    const dataArray = new Array();
    function testcount(x) {
        if (x == imagesList.length) {
            return 0
        }

        //console.log(imagesList[i])
        RNFetchBlob.config({
            fileCache: true
        })
            .fetch("GET", imagesList[x].image_name)
            // the image is now dowloaded to device's storage
            .then(resp => {
                // the image path you can use it directly with Image component
                imagePath = resp.path();
                //setLoading(false)
                return resp.readFile("base64");
            })
            .then(base64Data => {
                dataArray.push("data:image/png;base64," + base64Data);

                if (imagesList.length - 1 === x) {
                    Share.open({
                        urls: dataArray,
                        message: productData[0].product_name + '\n' + 'https://usdfab.com/usd/productdetails/' + productURL
                        //message: productData[0].product_name+'\n'+'https://play.google.com/store/apps/details?id=com.usd'
                    }, {
                        // Android only:
                        dialogTitle: 'Share BAM goodness',
                        // iOS only:
                        excludedActivityTypes: [
                            'com.apple.UIKit.activity.PostToTwitter'
                        ]
                    }).then((res) => {
                        setLoading(false);
                        console.log(res);
                    })
                        .catch((err) => {
                            setLoading(false);
                            err && console.log(err);
                        });

                }
                return fs.unlink(imagePath);
            });
        //x = x + 1;
        console.log(x)

        return testcount(x + 1)
    }

    const onShare = async () => {
        setLoading(true)
        testcount(0);
    };

    function _renderItem({ item, index }) {
        return (
            <TouchableOpacity style={{ flex: 1, marginEnd: 5, marginStart: 5 }} onPress={handleOnPress}>

                <View style={{ width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', padding: 5, borderWidth: 0.5, borderColor: 'lightgrey' }}>
                    <View style={{ width: 58, height: 58, borderRadius: 29 }}>
                        <Image source={{ uri: item.image_name }} style={{ width: 58, height: 58, borderRadius: 29 }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    function _sizerenderItem({ item, index }) {
        return (
            <TouchableOpacity style={{ flex: 1, marginEnd: 5, marginStart: 5 }}>

                <View style={{ width: 40, height: 40, borderRadius: 20, marginStart: 0, justifyContent: 'center', alignItems: 'center', padding: 5, borderWidth: 1, borderColor: '#9abec6' }}>
                    <Text style={{ fontSize: 16, color: '#9abec6', fontWeight: 'bold' }}>
                        {item.size}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", backgroundColor: '#eef1fc', height: 50, paddingHorizontal: 15 }}>
                <View style={styles.leftIconView}>
                    <TouchableOpacity

                        onPress={() => {
                            //navigation.pop();
                            backButtonHandler();
                        }}
                    >
                        <Image style={styles.menuIcon} source={Images.icons.back} />
                    </TouchableOpacity>
                </View>
                <View style={styles.middleView}>

                </View>

                <View style={styles.rightIconView}>

                    <TouchableOpacity style={{ width: 25, height: 25, marginTop: 0, marginEnd: 10 }} onPress={onShare}>
                        <Image style={{ width: 25, height: 25 }} source={Images.icons.share} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        if (userId === '') {
                            navigation.navigate("SignIn")
                            if (Platform.OS === 'android') {
                                ToastAndroid.showWithGravity("Please Login your account", ToastAndroid.SHORT, ToastAndroid.CENTER)
                            } else {
                                AlertIOS.alert("Please Login your account");
                            }

                        } else {
                            navigation.push("MyCart")
                        }
                    }
                    }>

                        {cartData !== null && cartData !== undefined ? (
                            <View style={{
                                width: 18, height: 18, borderRadius: 9, backgroundColor: 'red', alignSelf: 'flex-end',
                                position: 'relative', top: 0, right: 0, marginStart: 15, marginBottom: 0, left: 0, opacity: 1
                            }}>

                                <Text style={{ fontSize: 12, color: 'white', alignSelf: 'center', marginStart: 0 }}>
                                    {cartData.item_count}
                                </Text>

                            </View>
                        ) : (
                            <View style={{
                                width: 18, height: 18, borderRadius: 9, backgroundColor: '#eef1fc', alignSelf: 'flex-end',
                                position: 'relative', top: 0, right: 0, marginStart: 15, bottom: 0, left: 0, opacity: 1
                            }} />
                        )}

                        <Image style={styles.cartIcon} source={Images.icons.cart} />
                    </TouchableOpacity>
                </View>
                {/* <HeaderProductList /> */}
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
                <View style={{ flex: 1 }}>
                    {userId !== '' ? (
                        <View style={{ flex: 1 }}>

                            <WebView
                                ref={(ref) => webViewReff.current = ref}
                                onNavigationStateChange={navState => {
                                    setCanGoBack(navState.canGoBack);
                                    setCanGoForward(navState.canGoForward);
                                    setCurrentUrl(navState.url);
                                }}
                                startInLoadingState={true}
                                renderLoading={() => (
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
                                )}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                injectedJavaScript={`(function() {
                                        const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
                                    })();`}
                                source={{ uri: 'https://usdfab.com/product-details-mobile/' + productURL + '/' + userId + orderRating }} />
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>

                            <View style={{ flex: 1 }}>
                                <WebView
                                    ref={(ref) => webViewReff.current = ref}
                                    onNavigationStateChange={navState => {
                                        setCanGoBack(navState.canGoBack);
                                        setCanGoForward(navState.canGoForward);
                                        setCurrentUrl(navState.url);
                                    }}
                                    startInLoadingState={true}
                                    renderLoading={() => (
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
                                    )}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    injectedJavaScript={`(function() {
                                        const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
                                    })();`}
                                    source={{ uri: 'https://usdfab.com/product-details-mobile-befor-login/' + productURL + '/' + fcmTokenValue }} />
                            </View>

                            <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity style={{ marginTop: 8 }} onPress={() => {
                                    navigation.navigate("SignIn")
                                }}>
                                    <Text style={{ fontSize: 16, color: '#6495ED', paddingStart: 25, paddingEnd: 25, fontWeight: 'normal' }}>For B2B Login Here</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    )}
                </View>
            )}

        </View>
    )
}
