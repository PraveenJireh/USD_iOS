import React, { useState,useEffect,useRef } from 'react'
import { View, Text, Image, TouchableOpacity,BackHandler,StyleSheet,ScrollView,SafeAreaView,LogBox,ActivityIndicator, FlatList,ToastAndroid, TextInput, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Header } from "@components";
import { Constants, Images, Colors } from "@themes";
import styles from "./styles";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Services from "@Services";
import { Formik, } from 'formik';
import * as Yup from 'yup';
import imageToBase64 from 'image-to-base64/browser';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UserContext } from '@context/user-context';
import { CartContext } from '@context/cart-context';
import RNPickerSelect from 'react-native-picker-select';
import Share from 'react-native-share';

import Geolocation from 'react-native-geolocation-service';

const LONGITUDE_DELTA = 0.0121;
const LATITUDE_DELTA = 0.015;

export default function Profile({ route }) {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const {user , setUser} = React.useContext(UserContext);
    const {cartCount, setCartCount} = React.useContext(CartContext);
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    const [userId, setUserId] = useState('');

    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('India');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [gst, setGst] = useState('');
    const [userRole, setUserRole] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [shippingCountry, setShippingCountry] = useState('India');
    const [shippingAddress1, setShippingAddress1] = useState('');
    const [shippingAddress2, setShippingAddress2] = useState('');
    const [shippingCity, setShippingCity] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [shippingZipCode, setShippingZipCode] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [profilePicBase64, setProfilePicBase64] = useState('');
    const [userCode, setUserCode] = useState('');
    const [rewardPoints,setRewardPoints] = useState('');
    const [walletPoints,setWalletPoints] = useState('');
    const [loading, setLoading] = useState(false);

    const [region, setRegion] = useState(null);
    const [address, setAddress] = useState(null);

    const [pinCodeCount,setPinCodeCount] = useState('');
    const [pinCodeCount1,setPinCodeCount1] = useState('');

    const [stateData, setStateData] = useState([]);
    const [stateData1, setStateData1] = useState([]);

    const ref = useRef();

    if(route.params != undefined && route.params !== null){
        const { navigationType } = route.params;
        if(navigationType !== null && navigationType !== undefined){
            var navigation_type = navigationType;
        }else{
            var navigation_type = "Others";
        }
    }
    

    //LogBox.ignoreWarnings(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const statePlaceholder = {
        label: '--Select--',
        value: '',
        color: '#000000',
    };

    const statePlaceholder1 = {
        label: '--Select--',
        value: '',
        color: '#000000',
    };

    useEffect(() => {
        getData()
        getStateData()
        getStateData1()

        const backAction = () => {
            navigation.push("Home")
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [isFocused])

      const getStateData = () => {
        Services(Constants.API_BASE_URL + "/get_state","GET")
            .then((response) => {
                //console.log("Get Product Detailsssss",response.data);
                if(response.status === 1){
                    const fetchedCountries = response.data.map(item => {
                        return {
                          label: item.name,
                          value: item.name
                        };
                      });
                    setStateData(fetchedCountries);
                }else{
                    alert(response.msg);
                }
            })
      }

      const getStateData1 = () => {
        Services(Constants.API_BASE_URL + "/get_state","GET")
        .then((response) => {
            //console.log("Get Product Detailsssss",response.data);
            if(response.status === 1){
                const fetchedCountries = response.data.map(item => {
                    return {
                      label: item.name,
                      value: item.name
                    };
                  });
                setStateData1(fetchedCountries);
            }else{
                alert(response.msg);
            }
        })
    }

      const getLocationValues = () => {
        //setLoading(true)
        Geolocation.getCurrentPosition(info => {
            // console.log("AddressMap-----", info)
            setRegion({
                latitude: parseFloat(info.coords.latitude),
                longitude: parseFloat(info.coords.longitude),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })
            fetchLocation(info.coords)
        },
            error => {
                console.log('Error-------', JSON.stringify(error))
                setLoading(false)
            },
            {
                // enableHighAccuracy: false, 
                timeout: 20000,
                // maximumAge: 1000
            },
        )
    }
    function fetchLocation(location) {
        console.log("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&key=" + Constants.API_KEY)
        Services("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&key=" + Constants.API_KEY).then((response) => {
            //console.log("formatted_address........", response.results[0].formatted_address);

                    //setAddress(response.results[0].formatted_address)

                    
                    setShippingAddress1(response.results[1].address_components[1].long_name+","+
                    response.results[1].address_components[2].long_name)
                    //setAddressText(response.results[0].address_components.);
                    //setShippingAddress2(response.results[0].address_components[].)
                    setShippingCity(response.results[1].address_components[2].long_name)
                    setShippingState(response.results[1].address_components[3].long_name)
                    setShippingCountry(response.results[1].address_components[4].long_name)
                    setShippingZipCode(response.results[1].address_components[5].long_name)

            //console.log(response, "responseresponse")
            setLoading(false)
        });
    }

    const searchFilterFunction1 = (text) => {
        // Check if searched text is not blank
        setShippingZipCode(text)
        setPinCodeCount1(text.length)
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          console.log(text.length)
          Services(Constants.API_BASE_URL + "/get_city_state/"+text+"/"+user.id,"GET")
            .then((response) => {
                //console.log(response.data);
                if(text.length == 6){
                    setShippingCity(response.city)
                    setShippingState(response.state)
                    //setShippingZipCode(text)
                    setLoading(false);
                }
            })
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
        }
      };

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        setZipCode(text)
        setPinCodeCount(text.length)
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          Services(Constants.API_BASE_URL + "/get_city_state/"+text+"/"+user.id,"GET")
            .then((response) => {
                //console.log(response.data);
                if(text.length == 6){
                    setCity(response.city)
                    setState(response.state)
                    //setZipCode(text)
                    setLoading(false);
                }
            })
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
        }
      };

    
    const getLocationValuesBilling = () => {
        //setLoading(true)
        Geolocation.getCurrentPosition(info => {
            // console.log("AddressMap-----", info)
            setRegion({
                latitude: parseFloat(info.coords.latitude),
                longitude: parseFloat(info.coords.longitude),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })
            fetchLocationBilling(info.coords)
        },
            error => {
                console.log('Error-------', JSON.stringify(error))
                setLoading(false)
            },
            {
                // enableHighAccuracy: false, 
                timeout: 20000,
                // maximumAge: 1000
            },
        )
    }
    function fetchLocationBilling(location) {
        //console.log("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&key=" + Constants.API_KEY)
        Services("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&key=" + Constants.API_KEY).then((response) => {
            // console.log("formatted_address........", response.results[0].formatted_address);

                    //setAddress(response.results[0].formatted_address)

                   
                    setAddress1(response.results[1].address_components[1].long_name+","+
                    response.results[1].address_components[2].long_name)
                    //setAddressText(response.results[0].address_components.);
                    //setShippingAddress2(response.results[0].address_components[].)
                    setCity(response.results[1].address_components[2].long_name)
                    setState(response.results[1].address_components[3].long_name)
                    setCountry(response.results[1].address_components[4].long_name)
                    setZipCode(response.results[1].address_components[5].long_name)

            //console.log(response, "responseresponse")
            setLoading(false)
        });
    }

    const getData = async () => {
        try {
          //userId = await AsyncStorage.getItem('@USER_ID')
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            getUserData(user_id);
            setUserId(user_id)
          }
        } catch(e) {
          // error reading value
        }
      }

      const clearStorage = async () => {
        try {
            await AsyncStorage.clear()
            navigation.push("SignIn")
            ToastAndroid.showWithGravity("Logout Successfully.", ToastAndroid.SHORT,ToastAndroid.CENTER)
        } catch (e) {
          alert('Failed to clear the async storage.')
        }
      }

      function getUserData(user_id) {
          if(user_id !== null) {
              setLoading(true);
            Services(Constants.API_BASE_URL + "/get_user_details", {'user_id':user_id},"POST")
            .then((response) => {
                //console.log("Get User Detailsssss",response.data);
                if(response.status === 1){
                    setData(response.data)
                    setfName(response.data.first_name)
                    setlName(response.data.last_name)
                    setAddress1(response.data.address1)
                    setCompanyName(response.data.company_name)

                    setCountry(response.data.country)
                    setAddress2(response.data.address2)
                    setCity(response.data.city)
                    setState(response.data.state)
                    setZipCode(response.data.zipcode)
                    setShippingCountry(response.data.shipping_country)
                    setShippingAddress1(response.data.shipping_address1)
                    ref.current?.setAddressText(response.data.shipping_address1);
                    setShippingAddress2(response.data.shipping_address2)
                    setShippingCity(response.data.shipping_city)
                    setShippingState(response.data.shipping_state)
                    setShippingZipCode(response.data.shipping_zipcode)

                    setUserRole(response.data.role)

                    if(response.data.role === "3"){
                        setGst(response.data.gst_no);
                        setCompanyName(response.data.company_name);
                    }else{
                        setGst("");
                        setCompanyName("");
                    }

                    setProfilePic(response.data.profile_img)

                    setEmail(response.data.email)
                    setPhone(response.data.phone_no)

                    setUserCode(response.data.user_id)

                    setRewardPoints(response.data.reward_points)
                    setWalletPoints(response.data.wallet_amount)
                    setUser(response.data)
                    
                    if(response.data.role === "2"){

                    }else if("3"){

                    }

                    setLoading(false);
                }else{
                    alert(response.msg);
                    setLoading(false);
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
            setProfilePicBase64(image.data)
            //console.log(profilePicBase64)
        });
    }

    const onShare = async () => {
        var usdLogo = "data:image/png;base64,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";
                Share.open({
                    url:usdLogo,
                    message: fName+ " " +lName+" has invite to on USD, Kindly join and using the code : "+userCode+"\n"+"Download using "+"https://play.google.com/store/apps/details?id=com.usd"
                  }, {
                    // Android only:
                    dialogTitle: 'Share BAM goodness',
                    // iOS only:
                    excludedActivityTypes: [
                      'com.apple.UIKit.activity.PostToTwitter'
                    ]
                  })
        
      };

    return (
        <Formik
          initialValues={{ 
            first_name : '',
            last_name : '',
            user_id : userId,
            //company_name : '',
            country : 'India',
            address1 : '',
            address2 : '',
            city : '',
            state : '',
            zipcode : '',
            shipping_country : 'India',
            shipping_address1 : '',
            shipping_address2 : '',
            shipping_city : '',
            shipping_state : '',
            shipping_zipcode : ''
            }}
            onSubmit={values => console.log(values)}
            >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
            
        <View style={styles.container}>
            <View style={{flexDirection: "row", backgroundColor: '#eef1fc',height:50,paddingHorizontal:15}}>
                    <View style={styles.leftIconView}>
                        <TouchableOpacity 
                         onPress={() => {
                            navigation.pop()
                         }}
                        >
                            <Image style={styles.menuIcon} source={Images.icons.back} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.middleView}>
                    <Text style={{fontWeight: 'bold',alignSelf:'center', color: "black", fontSize: 16}}>Profile</Text>
                    </View>

                    <View style={styles.rightIconView}>
                    
                    </View>
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
        <SafeAreaView style={{flex:1}}>
            <ScrollView
            showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.profileView}>
                    {/* <TouchableOpacity> */}
                    <TouchableOpacity onPress={() => onSelectPicker()}>
                        {profilePic !== '' && profilePic !== null && profilePic !== undefined ?(
                            <Image source={{ uri: profilePic }} 
                            style={styles.profilePic}
                            defaultSource={Images.icons.profile} />
                        ):(
                            <Image source={Images.icons.profile} style={styles.profilePic} />
                        )}
                            
                    </TouchableOpacity>

                    <View 
                        style={{backgroundColor: 'red',position: 'absolute',
                        right: 0,bottom: 0,top:85,width:34,height:34,borderRadius:17,justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => onSelectPicker()}>
                            <Image
                                source={Images.icons.edit}
                                style={{height:25,width:25,tintColor:"white",alignSelf:'center'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

     {/* {rewardPoints !== "0" && rewardPoints !== "" ?( */}
        <Text style={{ fontSize: 16,color:'red', fontWeight: "normal",marginTop:25}}>
            Total Reward Points: {'\u20B9'}{" "}{rewardPoints}
        </Text>

        <Text style={{ fontSize: 16,color:'red', fontWeight: "normal",marginTop:5}}>
            Total Wallet Amount: {'\u20B9'}{" "}{walletPoints}
        </Text>
      {/* ):(<View/>)}  */}

        <Text style={{marginVertical: 15, fontSize: 16, fontWeight: "bold",marginTop:25}}>Firstname</Text>
        
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {fName}
                onChangeText={(first_name) => setfName(first_name)}
                placeholderTextColor="grey"
                keyboardType = "default" />
        </View>

        <Text style={styles.inputtitle}>Lastname</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {lName}
                onChangeText={(last_name) => setlName(last_name)}
                placeholderTextColor="grey"
                keyboardType = "default" />
        </View>

    <Text style={styles.inputtitle}>Email ID</Text>
    
    <View style={styles.textInputView}>
        <TextInput
            placeholder=""
            style={{margin: 0,
                padding: 0,
                fontSize: 16,
                // fontWeight: 'bold',
                marginHorizontal: 0,
                flex:1}}
            value = {email}
            onChangeText={handleChange("email")}
            placeholderTextColor="grey"
            editable = {false}
            keyboardType = "email-address" />
    </View>

    <Text style={styles.inputtitle}>Phone No</Text>
    
    <View style={styles.textInputFlexView}>
            <TextInput
                placeholder=""
                style = {{
                flex: 1,
                direction:'ltr',
                alignItems:"flex-start",
                alignContent:"flex-start",
                fontSize: 16,
                margin: 0,
                padding: 0
                }}
                editable = {false}
                value = {phone}
                onChangeText={handleChange("phone_no")}
                maxLength = {10}
                placeholderTextColor="grey"
                keyboardType = "phone-pad" />
    </View>

    {userRole === "3" ? (
        <View>
            <Text style={styles.inputtitle}>GST No</Text>
    
            <View style={styles.textInputView}>
                <TextInput
                    placeholder=""
                    style={{margin: 0,
                        padding: 0,
                        fontSize: 16,
                        // fontWeight: 'bold',
                        marginHorizontal: 0,
                        flex:1}}
                    value = {gst}
                    editable={false}
                    placeholderTextColor="grey"
                    keyboardType = "default" />
            </View>

            <Text style={styles.inputtitle}>Company Name</Text>
    
            <View style={styles.textInputView}>
                <TextInput
                    placeholder=""
                    style={styles.input}
                    value = {companyName}
                    onChangeText={(company_name) => setCompanyName(company_name)}
                    placeholderTextColor="grey"
                    keyboardType = "default" />
            </View>
        </View>    
    ):(<View/>)}

        {/* <TouchableOpacity 
            onPress={()=>{
                getLocationValuesBilling()
            }}
            style={{alignSelf:'flex-end',backgroundColor:'#ededed',marginTop:8,marginEnd:8,borderRadius:6}}>
            <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
                <Image style={{width:14,height:14, tintColor:'blue'}} source={Images.icons.currentLocation} />
                <Text style={{fontSize:14,color:'blue',marginStart:6}}>Current Location</Text>
            </View>
        </TouchableOpacity> */}

        <Text style={styles.inputtitle}>Postcode / ZIP</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {zipCode}
                onChangeText={(ZipCode) => searchFilterFunction(ZipCode)}
                //onChangeText={(ZipCode) => setZipCode(ZipCode)}
                placeholderTextColor="grey"
                maxLength = {6}
                keyboardType = "number-pad" />
        </View>

        <Text style={styles.inputtitle}>Country</Text>
    
        <View style={styles.textInputView}>
            {/* <TextInput
                placeholder=""
                style={styles.input}
                value = {country}
                onChangeText={(coun) => setCountry(coun)}
                placeholderTextColor="grey"
                keyboardType = "default" /> */}

            <RNPickerSelect
                placeholder={{ }}
                onValueChange={value => {setCountry(value)}}
                style={{
                    ...pickerSelectStyles,
                    placeholder: {
                        color: 'black',
                    },
                }}
                items={[
                    { label: 'India', value: 'India' },
                ]}
            />

        </View>

        <Text style={styles.inputtitle}>Address</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {address1}
                onChangeText={(addr1) => setAddress1(addr1)}
                placeholderTextColor="grey"
                keyboardType = 'default' />
        </View>

        <View style={styles.textInputView1}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {address2}
                onChangeText={(addr2) => setAddress2(addr2)}
                placeholderTextColor="grey"
                keyboardType = "default" />
        </View>

        <Text style={styles.inputtitle}>Town / City</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {city}
                onChangeText={(City) => setCity(City)}
                placeholderTextColor="grey"
                keyboardType = 'default' />
        </View>

        <Text style={styles.inputtitle}>State</Text>
    
        <View style={styles.textInputView}>
                                <RNPickerSelect
                                    placeholder={statePlaceholder}
                                    items={stateData}
                                    onValueChange={value => {setState(value)}}
                                    style={{
                                        ...pickerSelectStyles,
                                        placeholder: {
                                            color: 'black',
                                        },
                                    }}
                                    value={state}
                                    useNativeAndroidPickerStyle={false}

                                />
            {/* <TextInput
                placeholder="State"
                style={styles.input}
                value = {state}
                onChangeText={(State) => setState(State)}
                placeholderTextColor="grey"
                keyboardType = 'default' /> */}
        </View>

        <View style={{height:50,backgroundColor:'#e2e2e2',marginTop:8,justifyContent:'center',paddingStart:10}}>
        <Text style={{fontSize:16,fontWeight:'bold',color:'red'}}>Shipping Address</Text>
        </View>

        {/* <TouchableOpacity 
            onPress={()=>{
                getLocationValues()
            }}
            style={{alignSelf:'flex-end',backgroundColor:'#ededed',marginTop:8,marginEnd:8,borderRadius:6}}>
            <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
                <Image style={{width:14,height:14, tintColor:'blue'}} source={Images.icons.currentLocation} />
                <Text style={{fontSize:14,color:'blue',marginStart:6}}>Current Location</Text>
            </View>
        </TouchableOpacity> */}

        <Text style={styles.inputtitle}>Shipping  Postcode / ZIP</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {shippingZipCode}
                onChangeText={(SZipCode) => searchFilterFunction1(SZipCode)}
                //onChangeText={(SZipCode) => setShippingZipCode(SZipCode)}
                placeholderTextColor="grey"
                maxLength = {6}
                keyboardType = "number-pad" />
        </View>

        <Text style={styles.inputtitle}>Shipping Country</Text>
    
        <View style={styles.textInputView}>
            {/* <TextInput
                placeholder=""
                style={styles.input}
                value = {shippingCountry}
                onChangeText={(SCountry) => setShippingCountry(SCountry)}
                placeholderTextColor="grey"
                keyboardType = "default" /> */}

                <RNPickerSelect
                    placeholder={{ }}
                    onValueChange={value => {setShippingCountry(value)}}
                    style={{
                        ...pickerSelectStyles,
                        placeholder: {
                            color: 'black',
                        },
                    }}
                    items={[
                        { label: 'India', value: 'India' },
                    ]}
                />
        </View>

        <Text style={styles.inputtitle}>Address</Text>

        <View style={styles.textInputView}>

            <TextInput
                placeholder=""
                style={styles.input}
                value = {shippingAddress1}
                onChangeText={(SAddr1) => setShippingAddress1(SAddr1)}
                placeholderTextColor="grey"
                keyboardType = 'default' />
        </View>

        <View style={styles.textInputView1}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {shippingAddress2}
                onChangeText={(SAddr2) => setShippingAddress2(SAddr2)}
                placeholderTextColor="grey"
                keyboardType = "default" />
        </View>

        <Text style={styles.inputtitle}>Shipping Town / City</Text>
    
        <View style={styles.textInputView}>
            <TextInput
                placeholder=""
                style={styles.input}
                value = {shippingCity}
                onChangeText={(SCity) => setShippingCity(SCity)}
                placeholderTextColor="grey"
                keyboardType = 'default' />
        </View>

                    <Text style={styles.inputtitle}>Shipping State</Text>
                
                        <View style={styles.textInputView}>
                                            <RNPickerSelect
                                                placeholder={statePlaceholder1}
                                                items={stateData1}
                                                onValueChange={value => {setShippingState(value)}}
                                                style={{
                                                    ...pickerSelectStyles,
                                                    placeholder: {
                                                        color: 'black',
                                                    },
                                                }}
                                                value={shippingState}
                                                useNativeAndroidPickerStyle={false}

                                            />
                        {/* <TextInput
                            placeholder="Shipping State"
                            style={styles.input}
                            value = {shippingState}
                            onChangeText={(SState) => setShippingState(SState)}
                            placeholderTextColor="grey"
                            keyboardType = 'default' /> */}
                    </View>

                    <View style={styles.button}>
                        <LinearGradientButton title="UPDATE" onPress={() => {
                            if(zipCode != ""){
                                if(zipCode.length >= 6){
                                //if(pinCodeCount == "6"){
                                    //if(country != ""){
                                        if(address1 != ""){
                                            if(city != ""){
                                                if(state != ""){
                                                    if(shippingZipCode != ""){
                                                    if(shippingZipCode.length >= 6){
                                                        //if(pinCodeCount1 == "6"){
                                                            //if(shippingCountry != ""){
                                                                if(shippingAddress1 != ""){
                                                                    if(shippingCity != ""){
                                                                        if(shippingState != ""){
                                                                            const frmdetails = {
                                                                                'user_id': userId,
                                                                                'first_name': fName,
                                                                                'last_name': lName,
                                                                                'country': country,
                                                                                'address1': address1,
                                                                                'address2': address2,
                                                                                'city': city,
                                                                                'state': state,
                                                                                'zipcode': zipCode,
                                                                                'shipping_country': shippingCountry,
                                                                                'shipping_address1': shippingAddress1,
                                                                                'shipping_address2': shippingAddress2,
                                                                                'shipping_city': shippingCity,
                                                                                'shipping_state': shippingState,
                                                                                'shipping_zipcode': shippingZipCode,
                                                                                'profile_img': profilePicBase64,
                                                                                'company_name': companyName
                                                                            }
                                                                            console.log(frmdetails);
                                                                            Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                console.log("Updateeeee",response);
                                                                                if(response.status === 1){
                                                                            
                                                                                if(navigation_type === "CheckOut"){
                                                                                    navigation.pop()
                                                                                }else{
                                                                                    Alert.alert("Success",response.msg)
                                                                                    getData();
                                                                                }
                                                                                    
                                                                                }else{
                                                                                Alert.alert("Failed",response.msg)
                                                                                }
                                                                            })
                                                                        }else{
                                                                            alert("Enter Shipping State")
                                                                        }
                                                                    }else{
                                                                        alert("Enter Shipping City")
                                                                    }
                                                                }else{
                                                                    alert("Enter Shipping Address")
                                                                }
                                                            // }else{
                                                            //     alert("Enter Shipping Country")
                                                            // }
                                                        }else{
                                                                alert("Enter Valid Shipping PinCode")
                                                        }
                                                    }else{
                                                        alert("Enter Shipping PinCode")
                                                }
                                                    // }else{
                                                    //     alert("Enter Shipping PinCode")
                                                    // }
                                                }else{
                                                    alert("Enter Billing State")
                                                }
                                            }else{
                                                alert("Enter Billing City")
                                            }
                                        }else{
                                            alert("Enter Billing Address")
                                        }
                                    // }else{
                                    //     alert("Enter Billing Country")
                                    // }
                                // }else{
                                //     alert("Enter Valid Billing PinCode")
                                // }
                            }else{
                                alert("Enter Valid Billing PinCode")
                            }
                            }else{
                                alert("Enter Billing PinCode")
                            }
                        }}/>
                    </View>
                    </View>
                </ScrollView>
                </SafeAreaView>
            )}
            
        </View>
        )}
        </Formik>
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