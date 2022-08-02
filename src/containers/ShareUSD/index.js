import React, { useState,useEffect,useRef } from 'react'
import { View, Text, Image, TouchableOpacity,BackHandler,ScrollView,SafeAreaView,LogBox, FlatList,ToastAndroid, TextInput, Alert } from 'react-native';
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
import imageToBase64 from 'image-to-base64/browser';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UserContext } from '@context/user-context';

export default function Profile() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const {user , setUser} = React.useContext(UserContext);
    const [data, setData] = useState(null);
    //const [userId, setUserId] = userId;
    const [userId, setUserId] = useState('');

    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingAddress1, setShippingAddress1] = useState('');
    const [shippingAddress2, setShippingAddress2] = useState('');
    const [shippingCity, setShippingCity] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [shippingZipCode, setShippingZipCode] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [profilePicBase64, setProfilePicBase64] = useState('');

    const ref = useRef();

    //LogBox.ignoreWarnings(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    //console.log(data);
    useEffect(() => {
        getData()

        const backAction = () => {
            // Alert.alert("Urban Stop Design", "Are you sure you want to Exit USD App?", [
            //   {
            //     text: "Cancel",
            //     onPress: () => null,
            //     style: "cancel"
            //   },
            //   { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            navigation.push("Home")
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [])

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

                    setProfilePic(response.data.profile_img)

                    setEmail(response.data.email)
                    setPhone(response.data.phone_no)
                    
                    setUser(response.data)
                    
                    if(response.data.role === "2"){

                    }else if("3"){

                    }
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

    return (
    
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Refer Friend" />
            </View>
            <SafeAreaView style={{flex:1}}>
            <ScrollView
            showsVerticalScrollIndicator={false}>
            
                </ScrollView>
                </SafeAreaView>
        </View>
        
    )
}
