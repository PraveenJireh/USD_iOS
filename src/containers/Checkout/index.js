import React,{useState,useEffect,useContext} from 'react'
import { View, Text, StyleSheet,Image,TouchableOpacity,Alert,TextInput,BackHandler,ScrollView,ActivityIndicator,ToastAndroid } from 'react-native'
import { Header } from "@components";
import { Constants,Images } from "@themes";
import styles from './styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import { RadioButton } from 'react-native-paper';
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import RazorpayCheckout from 'react-native-razorpay';
import { el, tr } from 'date-fns/locale';
import RNPickerSelect from 'react-native-picker-select';
import { UserContext } from '@context/user-context';

export default function Checkout() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [value, setValue] = React.useState('');

    const { user, setUser } = useContext(UserContext);

    const [cartData, setCartData] = useState({});
    const [cartCount, setCartCountData] = useState({});
    const [cartDataItem, setCartDataItem] = useState([]);
    const [data, setData] = useState(null);
    const [userId, setUserId] = useState(0);

    const [userName, setUserName] = useState('');
    const [userMobile, setUserMobile] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userImage, setUserImage] = useState('');
    const [message, setMessage] = useState('');
    const [userRole, setUserRole] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pickupPersonName, setPickupPersonName] = useState('');
    const [pickupContactNumber, setPickupContactNumber] = useState('');
    const [rewardPoint, setRewardpoint] = useState('');
    const [rewardPointValue, setRewardpointValue] = useState('');
    const [walletPoint, setWalletPoint] = useState('');
    const [walletPointValue, setWalletPointValue] = useState('');
    const [discountValue, setDiscountValue] = useState('0');
    const [totalValue, setTotalValue] = useState('');
    const [disabled,setDisabled] = useState(false);
    const [disabledCredit,setDisabledCredit] = useState(false);
    const [visible,setVisible] = useState(false);

    const [visibleWallet,setVisibleWallet] = useState(false);
    const [walletDiscountValue, setWalletDiscountValue] = useState('0');
    const [disabledWallet,setDisabledWallet] = useState(false);

    const [visibleCredit,setVisibleCredit] = useState(false);

    const [isSelected, setSelection] = useState(false);
    const [isSelectedDiffAddress, setSelectionDiffAddress] = useState(false);

    const [creditAmount, setCreditAmount] = useState('');
    const [creditAmountValue, setCreditAmountValue] = useState('');
    const [creditAmountStatus, setCreditAmountStatus] = useState('');
    const [creditDate, setCreditDate] = useState('dd/mm/yyyy');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('India');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [shippingCountry, setShippingCountry] = useState('India');
    const [shippingAddress1, setShippingAddress1] = useState('');
    const [shippingAddress2, setShippingAddress2] = useState('');
    const [shippingCity, setShippingCity] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [shippingZipCode, setShippingZipCode] = useState('');

    const [region, setRegion] = useState(null);
    const [address, setAddress] = useState(null);

    const [pinCodeCount,setPinCodeCount] = useState('');
    const [rewardAvalilableValue,setRewardAvalilableValue] = useState('');

    const [stateData, setStateData] = useState([]);
    const [stateData1, setStateData1] = useState([]);
    const [pinCodeCount1,setPinCodeCount1] = useState('');

    const [serviceable, setServiceable] = useState(false);

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", format(date, 'dd/MM/yyyy'));
    setCreditDate(format(date, 'dd/MM/yyyy'));
    hideDatePicker();
  };

  const isInitialMount = React.useRef(true);

    //console.log(data);
    useEffect(() => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            getData();
            getStateData();
            getStateData1();
            if(isSelectedDiffAddress === true){
                getPinCodeServicable(shippingZipCode,user.id);
            }else{
                getPinCodeServicable(zipCode,user.id);
            }
         } else {
             // Your useEffect code here to be run on update
             //updateServiceable();
             if(isSelectedDiffAddress === true){
                getPinCodeServicable(shippingZipCode,user.id);
            }else{
                getPinCodeServicable(zipCode,user.id);
            }
         }

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
      }, [isFocused,isSelectedDiffAddress])

    const getData = async () => {
        try {
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            setUserId(user_id)
            getUserData(user_id);
            getCartDetails(user_id);
            getCartCountDetails(user_id);
            //getPinCodeServicable(user.zipcode,user_id);
          }
        } catch(e) {
          // error reading value
        }
      }

      const updateServiceable = () => {
        if(user != null){
            if(isSelectedDiffAddress === true){
                getPinCodeServicable(user.zipcode,user.id);
            }else{
                getPinCodeServicable(user.shipping_zipcode,user.id);
            }
        }
      }

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

      const searchFilterFunction1 = (text) => {
        // Check if searched text is not blank
        setShippingZipCode(text)
        setPinCodeCount1(text.length)
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
         // console.log(text.length)
          Services(Constants.API_BASE_URL + "/get_city_state/"+text+"/"+user.id,"GET")
            .then((response) => {
                //console.log(response.data);
                if(text.length == 6){
                    setShippingCity(response.city)
                    setShippingState(response.state)
                    //setShippingZipCode(text)
                    if(response.shipping_cost == ""){
                        setServiceable(false);
                        Alert.alert("USDFAB Alert","Delivery pincode not serviceable.")
                    }else{
                        setServiceable(true);
                        getCartDetails(user.id);
                    }
                    
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
               // console.log(Constants.API_BASE_URL + "/get_city_state/"+text+"/"+user.id);
                if(text.length == 6){
                    setCity(response.city)
                    setState(response.state)
                    //setZipCode(text)
                    if(response.shipping_cost == ""){
                        setServiceable(false);
                        Alert.alert("USDFAB Alert","Delivery pincode not serviceable.")
                    }else{
                        setServiceable(true);
                        getCartDetails(user.id);
                    }
                    setLoading(false);
                }
            })
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
        }
      };

      function getCartCountDetails(user_id){
        Services(Constants.API_BASE_URL + "view_cart/"+user_id,"GET")
        .then((response) => {
            if(response.status === 1){
                if(response.data !== null && response.data !== undefined){
                    setCartCountData(response.data)
                }
            }else{
                alert(response.msg)
            }
        })
    }

    function getPinCodeServicable(zipCode,user_id){
        Services(Constants.API_BASE_URL + "/get_city_state/"+zipCode+"/"+user_id,"GET")
            .then((response) => {
                //console.log(response.data);
                if(zipCode.length == 6){
                    setShippingCity(response.city)
                    setShippingState(response.state)
                    //setShippingZipCode(text)
                    if(response.shipping_cost == ""){
                        setServiceable(false);
                        getCartDetails(user.id);
                    }else{
                        getCartDetails(user.id);
                        setServiceable(true);
                    }
                    
                    setLoading(false);
                }
            })
    }
      
      function getUserData(user_id) {
        if(user_id !== null) {
            setLoading(true)
          Services(Constants.API_BASE_URL + "get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              //console.log("Get User Detailsssss",response.data);
              if(response.status === 1){
                  setLoading(false)
                  setData(response.data)
                  setUserRole(response.data.role)
                  setRewardpointValue(response.data.reward_points)
                  setWalletPoint(response.data.wallet_amount)
                  setCreditAmountValue(response.data.credit_limit)
                  setCreditAmountStatus(response.data.credit_status)

                  setUserName(response.data.first_name+" "+response.data.last_name)
                  setUserMobile(response.data.phone_no)
                  setUserEmail(response.data.email)
                  setUserImage(response.data.profile_img)

                  setfName(response.data.first_name)
                  setlName(response.data.last_name)
                  setAddress1(response.data.address1)
                  setCompanyName(response.data.company_name)
                  setPhone(response.data.phone_no)
                  setEmail(response.data.email)

                  setCountry(response.data.country)
                  setAddress2(response.data.address2)
                  setCity(response.data.city)
                  setState(response.data.state)
                  setZipCode(response.data.zipcode)
                  setShippingCountry(response.data.shipping_country)
                  setShippingAddress1(response.data.shipping_address1)
                  setShippingAddress2(response.data.shipping_address2)
                  setShippingCity(response.data.shipping_city)
                  setShippingState(response.data.shipping_state)
                  setShippingZipCode(response.data.shipping_zipcode)

                  setUserRole(response.data.role)
                  //alert(response.data[0].role)
              }else{
                setLoading(false)
                  //alert(response.msg)
              }
          })
        }
    }

    function getCartDetails(user_id){
        Services(Constants.API_BASE_URL + "checkout_details/"+user_id,"GET")
        .then((response) => {
            if(response.status === 1){

                setCartData(response.data)
                setCartDataItem(response.data.item)
                setTotalValue(response.data.total)
                setRewardAvalilableValue(response.data.reward_point_can_use)

                //console.log("Cart Itemssss:::"+array.total)
            }else{
                alert(response.msg)
            }
        })
    }

    const addressUpdateNavigation = async (data) => {
        navigation.navigate("Profile", {
            navigationType: data
        });
      }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Checkout" />
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
                <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}>
                    <Text style={{fontSize:18,fontWeight:'bold',color:'black'}}>Billing Details</Text>
                    </View>
                </View>


                <View>  
                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:1}}>
                            <Text style={{marginVertical: 0, fontSize: 16, fontWeight: "bold",marginTop:10}}>First Name</Text>
                    
                            <View style={styles.textInputView}>
                                <TextInput
                                    placeholder=""
                                    style={styles.input}
                                    value = {fName}
                                    onChangeText={(first_name) => setfName(first_name)}
                                    placeholderTextColor="grey"
                                    keyboardType = "default" />
                            </View>
                        </View>

                        <View style={{flex:1,marginStart:10}}>
                            <Text style={styles.inputtitle}>Last Name</Text>
                    
                            <View style={styles.textInputView}>
                                <TextInput
                                    placeholder=""
                                    style={styles.input}
                                    value = {lName}
                                    onChangeText={(last_name) => setlName(last_name)}
                                    placeholderTextColor="grey"
                                    keyboardType = "default" />
                            </View>
                        </View>
                    </View>

                        {userRole === "3" ? (
                            <View>
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

                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:1}}>
                            <Text style={styles.inputtitle}>Email</Text>
                    
                            <View style={styles.textInputView}>
                                <TextInput
                                    placeholder=""
                                    value = {email}
                                    style = {{
                                        flex: 1,
                                        direction:'ltr',
                                        alignItems:"flex-start",
                                        alignContent:"flex-start",
                                        fontSize: 16,
                                        margin: 0,
                                        padding: 0
                                        }}
                                    //onChangeText={handleChange("email")}
                                    onChangeText={(email) => setEmail(email)}
                                    placeholderTextColor="grey"
                                    editable = {false}
                                    keyboardType = "email-address" />
                            </View>
                        </View>

                        <View style={{flex:1,marginStart:10}}>
                            <Text style={styles.inputtitle}>Mobile</Text>
                    
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
                                        onChangeText={(phone_no) => setPhone(phone_no)}
                                        maxLength = {10}
                                        placeholderTextColor="grey"
                                        keyboardType = "phone-pad" />
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:1}}>
                            <Text style={styles.inputtitle}>Postcode / ZIP</Text>
                    
                            <View style={styles.textInputView}>
                                <TextInput
                                    placeholder=""
                                    style={styles.input}
                                    value = {zipCode}
                                    onChangeText={(ZipCode) => searchFilterFunction(ZipCode)}
                                    //onChangeText={(ZipCode) => setZipCode(ZipCode)}
                                    maxLength = {6}
                                    placeholderTextColor="grey"
                                    keyboardType = "number-pad" />
                            </View>
                        </View>

                        <View style={{flex:1,marginStart:10}}>
                            <Text style={styles.inputtitle}>Country</Text>
                    
                            <View style={styles.textInputView}>
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
                                    useNativeAndroidPickerStyle={false}
                                />
                                {/* <TextInput
                                    placeholder=""
                                    style={styles.input}
                                    value = {country}
                                    onChangeText={(coun) => setCountry(coun)}
                                    placeholderTextColor="grey"
                                    keyboardType = "default" /> */}
                            </View>
                        </View>
                    </View>

                    <Text style={styles.inputtitle}>Address</Text>
                
                    <View style={styles.textInputView}>
                        <TextInput
                            placeholder=""
                            style={styles.input}
                            value = {address1}
                            onKeyPress={({ nativeEvent }) => {
                                if(nativeEvent.key === 'Backspace'){
                                   //It was a backspace
                                }
                             }}
                            onChangeText={(addr1) => setAddress1(addr1)}
                            placeholderTextColor="grey"
                            keyboardType = 'default' />
                    </View>

                    <View style={styles.textInputView1}>
                        <TextInput
                            placeholder=""
                            style={styles.input}
                            value = {address2}
                            onKeyPress={({ nativeEvent }) => {
                                if(nativeEvent.key === 'Backspace'){
                                   //It was a backspace
                                }
                             }}
                            onChangeText={(addr2) => setAddress2(addr2)}
                            placeholderTextColor="grey"
                            keyboardType = "default" />
                    </View>

                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:1}}>
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
                        </View>

                        <View style={{flex:1,marginStart:10}}>
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
                        </View>
                    </View>

                        <View style={{flex:1,marginTop:10,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Ship to a Different Address?</Text>
                            <CheckBox
                                value={isSelectedDiffAddress}
                                onValueChange={setSelectionDiffAddress}
                                //onChange={getPinCodeServicable(user.shipping_zipcode,user.id)}
                            />
                        </View>

                        {isSelectedDiffAddress == true ? (
                            <View>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Shipping Details</Text>
                                <View style={{flexDirection:'row',flex:1}}>
                            <View style={{flex:1}}>
                                <Text style={{marginVertical: 0, fontSize: 16, fontWeight: "bold",marginTop:10}}>Full Name</Text>
                        
                                <View style={styles.textInputView}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input}
                                        onChangeText={(first_name) => setPickupPersonName(first_name)}
                                        placeholderTextColor="grey"
                                        keyboardType = "default" />
                                </View>
                            </View>
    
                            <View style={{flex:1,marginStart:10}}>
                                <Text style={styles.inputtitle}>Mobile No</Text>
                            
                                <View style={styles.textInputFlexView}>
                                        <TextInput
                                            placeholder=""
                                            style = {{
                                            flex: 1,
                                            direction:'ltr',
                                            alignItems:"flex-start",
                                            alignContent:"flex-start",
                                            fontSize: 16,
                                            color:'black', 
                                            margin: 0,
                                            padding: 0
                                            }}
                                            onChangeText={(phone_no) => setPickupContactNumber(phone_no)}
                                            maxLength = {10}
                                            placeholderTextColor="grey"
                                            keyboardType = "phone-pad" />
                                </View>
                            </View>
                        </View>
    
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={{flex:1}}>
                                <Text style={styles.inputtitle}>Postcode / ZIP</Text>
                        
                                <View style={styles.textInputView}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input}
                                        value = {shippingZipCode}
                                        onChangeText={(ZipCode) => searchFilterFunction1(ZipCode)}
                                        //onChangeText={(ZipCode) => setZipCode(ZipCode)}
                                        placeholderTextColor="grey"
                                        maxLength = {6}
                                        keyboardType = "number-pad" />
                                </View>
                            </View>

                            <View style={{flex:1,marginStart:10}}>
                                <Text style={styles.inputtitle}>Country</Text>
                        
                                <View style={styles.textInputView}>
                                    <RNPickerSelect
                                        placeholder={{ }}
                                        items={[
                                            { label: 'India', value: 'India' },
                                        ]}
                                        onValueChange={value => {setShippingCountry(value)}}
                                        style={{
                                            ...pickerSelectStyles,
                                            placeholder: {
                                                color: 'black',
                                            },
                                        }}
                                        useNativeAndroidPickerStyle={false}

                                    />
                                    {/* <TextInput
                                        placeholder=""
                                        style={styles.input}
                                        value = {shippingCountry}
                                        onChangeText={(coun) => setShippingCountry(coun)}
                                        placeholderTextColor="grey"
                                        keyboardType = "default" /> */}
                                </View>
                                </View>
                        </View>
    
                        <Text style={styles.inputtitle}>Address</Text>
                    
                        <View style={styles.textInputView}>
                            <TextInput
                                placeholder=""
                                style={styles.input}
                                value = {shippingAddress1}
                                onChangeText={(addr1) => setShippingAddress1(addr1)}
                                placeholderTextColor="grey"
                                keyboardType = 'default' />
                        </View>
    
                        <View style={styles.textInputView1}>
                            <TextInput
                                placeholder=""
                                style={styles.input}
                                value = {shippingAddress2}
                                onChangeText={(addr2) => setShippingAddress2(addr2)}
                                placeholderTextColor="grey"
                                keyboardType = "default" />
                        </View>
    
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={{flex:1}}>
                                <Text style={styles.inputtitle}>Town / City</Text>
                        
                                <View style={styles.textInputView}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input}
                                        value = {shippingCity}
                                        onChangeText={(City) => setShippingCity(City)}
                                        placeholderTextColor="grey"
                                        keyboardType = 'default' />
                                </View>
                            </View>
    
                            <View style={{flex:1,marginStart:10}}>
                                <Text style={styles.inputtitle}>State</Text>
                        
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
                                        placeholder="State"
                                        style={styles.input}
                                        value = {shippingState}
                                        onChangeText={(State) => setShippingState(State)}
                                        placeholderTextColor="grey"
                                        keyboardType = 'default' /> */}
                                </View>
                            </View>
                        </View>
                            </View>
                        ):(
                            <View/>
                        )}

                    </View>

            <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>

            <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Order Information</Text>

             {/* <View style={{flexDirection:'row',marginTop:10}}>
                 <View style={{flex:1}}>
                 <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>Products</Text>
                 </View>

                 <View style={{flex:1,alignItems:'flex-end'}}>
                 <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>{cartData.item_count} Items ({cartCount.item_nos} Nos)</Text>
                 </View>
             </View>   */}

             <View style={{flexDirection:'row',marginTop:10}}>
                 <View style={{flex:1}}>
                 <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>Subtotal ({cartCount.item_nos} Nos)</Text>
                 </View>

                 <View style={{flex:1,alignItems:'flex-end'}}>
                 <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{cartData.sub_total}</Text>
                 </View>
             </View>

                        {cartData.incl_tax == "0" ? (
                            <View/>
                        ):(
                            <View style={{flexDirection:'row',marginTop:10}}>
                                <View style={{flex:1}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>{cartData.tax_text}</Text>
                                </View>
            
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{cartData.incl_tax}</Text>
                                </View>
                            </View>
                        )}

                        {cartData.incl_tax2 == "0" ? (
                            <View/>
                        ):(
                            <View style={{flexDirection:'row',marginTop:10}}>
                                <View style={{flex:1}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>{cartData.tax_text2}</Text>
                                </View>
            
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{cartData.incl_tax2}</Text>
                                </View>
                            </View>
                        )}

             <View style={{flexDirection:'row',marginTop:10}}>
                 <View style={{flex:1}}>
                 <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>Delivery Fee</Text>
                 </View>
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

             {visible === true ?(
                    <View>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            <View style={{flex:1.1}}>
                            <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>Reward points discount (-)</Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                            <Text style={{fontSize:14,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{discountValue}</Text>
                            </View>
                        </View>
                    </View>
                    ):(
                        <View/>
                    )}

                {visibleWallet === true ?(
                    <View>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            <View style={{flex:1.1}}>
                            <Text style={{fontSize:16,fontWeight:'bold',color:'#cccccc',marginTop:0}}>Wallet discount (-)</Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                            <Text style={{fontSize:14,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{walletDiscountValue}</Text>
                            </View>
                        </View>
                    </View>
                    ):(
                        <View/>
                    )}

            <View style={{flexDirection:'row',padding:0,marginTop:15}}>
                    <View style={{flex:1}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Total</Text>
                    </View>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}> : </Text>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                    <Text style={{alignItems:'flex-end',fontSize:16,fontWeight:'bold',color:'black'}}>{'\u20B9'} {totalValue}</Text>
                    </View>
            </View>

             <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>
             
             {rewardPointValue !== undefined && rewardPointValue !== "0" && rewardPointValue !== null ? (
                <View>
                
                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Reward Points</Text>
                    
                    <View style={{marginTop:0}}>
                        <Text style={{color:'black',fontSize:14,fontWeight:'bold',marginTop:6}}>
                            Note:
                        </Text>

                        <Text style={{color:'black',fontSize:14}}>
                            1. REWARD POINTS can be used only upto 10% of the total billing value. 
                        </Text>

                        <Text style={{color:'black',fontSize:14}}>
                        2. Your Rewards Points Credit Balance is {'\u20B9'} {rewardPointValue} and You can use maximum {'\u20B9'} {rewardAvalilableValue} only. 
                        </Text>

                
                    </View>
                    
                    <View style={{flexDirection:'row',marginTop:10,}}>
                        <TextInput
                            style={{height: 40,
                                margin: 1,
                                flex:1,
                                borderColor:'#ededed',
                                borderRadius:5,
                                paddingStart:8,
                                marginEnd:10,
                                borderWidth: 1,}}
                            placeholder="Enter your amount"
                            value = {rewardPoint}
                            onChangeText={(reward_point) => setRewardpoint(reward_point)}
                            keyboardType='number-pad'
                        />

                        <TouchableOpacity 
                            disabled={disabled}
                            style={{height:40,backgroundColor:'#fe5c45',borderRadius:20,justifyContent:'center'}}
                                onPress={() => {
                                    //alert(rewardPoint +"="+ rewardPointValue)
                                    if(rewardPoint !== '' && rewardPoint !== "0"){
                                        if(parseInt(rewardAvalilableValue) >= parseInt(rewardPoint)){

                                            setDiscountValue(rewardPoint)
                                            setTotalValue(totalValue - rewardPoint)
                                            setDisabled(true)
                                            setVisible(true)
                                            //alert(rewardPointValue +">="+ rewardPoint)

                                        }else{
                                            if (Platform.OS === 'android') {
                                                ToastAndroid.showWithGravity("Please enter a less than of your balance.", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                        } else {
                                                AlertIOS.alert("Please enter a less than of your balance.");
                                        }
                                        }
                                    }else{
                                        if (Platform.OS === 'android') {
                                                ToastAndroid.showWithGravity("Amount should not be empty/ zero", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                        } else {
                                                AlertIOS.alert("Amount should not be empty/ zero");
                                        }
                                    }
                                }}>
                            <Text style={{color:'white',fontWeight:'bold'}}>
                                {"   Apply Reward Points    "}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/> */}
            </View>
            ) : (<View/>)}

           {walletPoint !== undefined && walletPoint !== "0" && walletPoint !== null ? (
                <View>

                <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>
                
                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Wallet Amount</Text>
                    
                    <View style={{marginTop:6,flexDirection:'row'}}>
                        <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>
                            Note:
                        </Text>

                        <Text style={{color:'black',fontSize:14,marginStart:6}}>
                            Your Wallet Amount is {'\u20B9'} {walletPoint}. 
                        </Text>

                
                    </View>
                    
                    <View style={{flexDirection:'row',marginTop:10,}}>
                        <TextInput
                            style={{height: 40,
                                margin: 1,
                                flex:1,
                                borderColor:'#ededed',
                                borderRadius:5,
                                paddingStart:8,
                                marginEnd:10,
                                borderWidth: 1,}}
                            placeholder="Enter your amount"
                            value = {walletPointValue}
                            onChangeText={(wallet_point) => setWalletPointValue(wallet_point)}
                            keyboardType='number-pad'
                        />

                        <TouchableOpacity 
                            disabled={disabledWallet}
                            style={{height:40,backgroundColor:'#fe5c45',borderRadius:20,justifyContent:'center'}}
                                onPress={() => {
                                    //alert(rewardPoint +"="+ rewardPointValue)
                                    if(walletPointValue !== '' && walletPointValue !== "0"){
                                        if(parseInt(walletPoint) >= parseInt(walletPointValue)){

                                            setWalletDiscountValue(walletPointValue)
                                            setTotalValue(totalValue - walletPointValue)
                                            setDisabledWallet(true)
                                            setVisibleWallet(true)
                                            //alert(rewardPointValue +">="+ rewardPoint)

                                        }else{
                                            if (Platform.OS === 'android') {
                                                ToastAndroid.showWithGravity("Please enter a less than of your wallet balance.", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                        } else {
                                                AlertIOS.alert("Please enter a less than of your wallet balance.");
                                        }
                                        }
                                    }else{
                                        if (Platform.OS === 'android') {
                                                ToastAndroid.showWithGravity("Wallet Amount should not be empty/ zero", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                        } else {
                                                AlertIOS.alert("Wallet Amount should not be empty/ zero");
                                        }
                                    }
                                }}>
                            <Text style={{color:'white',fontWeight:'bold'}}>
                                {"   Apply Wallet Amount    "}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/> */}
            </View>
            ) : (<View/>)}  

            {creditAmountStatus === 1 ? (
                <View style={{marginTop:10}}>

                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Credit</Text>
                        
                        <View style={{marginTop:0,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>
                                Note:
                            </Text>
    
                            <Text style={{color:'black',fontSize:14}}>
                                Your Credit Balance is  {'\u20B9'} 
                            </Text>
    
                            <TextInput
                                style={{fontWeight:'bold'}}
                                value = {creditAmountValue}
                                onChangeText={(credit_point_value) => setCreditAmountValue(credit_point_value)}
                                keyboardType='number-pad'
                            />
                        </View>
    
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
    
                        <View style={{flex:1,marginEnd:10}}>
                            <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>Credit Amount</Text>
    
                            <TextInput
                                style={{height: 40,
                                    margin: 1,
                                    flex:1,
                                    borderColor:'#ededed',
                                    borderRadius:5,
                                    paddingStart:8,
                                    marginTop:10,
                                    borderWidth: 1,}}
                                placeholder="Enter Amount"
                                value = {creditAmount}
                                onChangeText={(credit_amount) => setCreditAmount(credit_amount)}
                                keyboardType='phone-pad'
                            />
                        </View>
    
                        <View style={{flex:1}}>
    
                        <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:0}}>Due Date</Text>
    
                            <View style={{height: 40,
                                    borderColor:'#ededed',
                                    borderRadius:5,
                                    paddingStart:8,
                                    marginTop:10,
                                    justifyContent:'center',
                                    borderWidth: 1,}}>
    
                                <TouchableOpacity onPress={showDatePicker}>
                                    <Text style={{fontSize:16}}>{creditDate}</Text>
                                </TouchableOpacity>        
                            </View>
                        </View>
    
                    </View>
                    <TouchableOpacity 
                                disabled={disabledCredit}
                                style={{height:40,alignSelf:'center',width:150,justifyContent:'center',alignItems:'center',marginTop:15,backgroundColor:'#fe5c45',borderRadius:20,justifyContent:'center'}}
                                    onPress={() => {
    
                                        if(creditAmount !== '0' && creditAmount !== ''){
                                            if(creditDate !== 'dd/mm/yyyy'){
                                            if(parseInt(creditAmountValue) >= parseInt(creditAmount)){
    
                                                setDiscountValue(rewardPoint)
                                                setTotalValue(totalValue - creditAmount)
                                                setDisabledCredit(true)
                                                setVisibleCredit(true)
                                                //alert(rewardPointValue +">="+ rewardPoint)
    
                                            }else{
                                                if (Platform.OS === 'android') {
                                                    ToastAndroid.showWithGravity("Entered Amount should not greater than Your Credit Balance", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                            } else {
                                                    AlertIOS.alert("Entered Amount should not greater than Your Credit Balance");
                                            }
                                            }
                                        }else {
                                            if (Platform.OS === 'android') {
                                                ToastAndroid.showWithGravity("Select Due Date", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                            } else {
                                                    AlertIOS.alert("Select Due Date");
                                            }
                                        }
                                    }else {
                                        if (Platform.OS === 'android') {
                                            ToastAndroid.showWithGravity("Credit Amount should not be empty/ zero", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                        } else {
                                                AlertIOS.alert("Credit Amount should not be empty/ zero");
                                        }
                                    }
                                        
                                    }}>
                                <Text style={{color:'white',fontWeight:'bold'}}>
                                    {"Apply Credit"}
                                </Text>
                            </TouchableOpacity>
    
                            {visibleCredit === true ?(
                                    <View>
                                        <View style={{flexDirection:'row',marginTop:10}}>
                                            <View style={{flex:1}}>
                                            <Text style={{fontSize:14,fontWeight:'bold',color:'black',marginTop:0}}>Credit</Text>
                                            </View>
    
                                            <View style={{flex:1,alignItems:'flex-end'}}>
                                            <Text style={{fontSize:14,fontWeight:'bold',color:'black',marginTop:0}}>{'\u20B9'}{" "}{creditAmount}</Text>
                                            </View>
                                        </View>
    
                                        <View style={{flexDirection:'row',padding:0,marginTop:15}}>
                                                <View style={{flex:1}}>
                                                <Text style={{fontSize:14,fontWeight:'bold',color:'black'}}>Due Date</Text>
                                                </View>
                                                <Text style={{fontSize:14,fontWeight:'bold',color:'black'}}> : </Text>
                                                <View style={{flex:1,alignItems:'flex-end'}}>
                                                <Text style={{alignItems:'flex-end',fontSize:14,fontWeight:'bold',color:'black'}}>{creditDate}</Text>
                                                </View>
                                        </View>  
                                    </View>
                        ):(
                            <View/>
                        )}
    
                            <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>
                </View>
            ):(
                <View/>
            )}
                <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Order Notes</Text>
                    <TextInput
                        style={{height: 150,
                            margin: 1,
                            flex:1,
                            borderColor:'#cccccc',
                            borderRadius:5,
                            padding:8,
                            marginTop:10,
                            fontSize:16,
                            textAlignVertical : "top",
                            borderWidth: 1,}}
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        multiline={true}
                        value = {message}
                        onChangeText={(message) => setMessage(message)}
                        keyboardType='default'
                    />
                <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:10}}>Payment Information</Text>

                    <View style={{marginTop:10}}>
                    <RadioButton.Group 
                    onValueChange={newValue => setValue(newValue)} value={value}>
                        <RadioButton.Item label="Pay Online" value="Pay Online" style={{height:35}}/>
                        <RadioButton.Item label="Cash On Delivery" value="Cash on Delivery" style={{height:35,marginTop:8}}/>
                    </RadioButton.Group>
                    </View>
                    <View style={{height:0.5,backgroundColor:'#cccccc',marginTop:10}}/>

                <View style={{marginTop:10}}>

                <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>General Terms & Conditions:</Text>

                <View style={{padding:10}}>
                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Goods once sold are not exchanged. Exchange only in case of Size difference, manufacturing defect.
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Time Frame for exchange : within 15 days on Receipt of Goods
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} (Proof - Consignment opening should be in the form of video Clipping until end – Ensure the consignment acceptance only when intact condition).
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Please do not accept any consignment pack in damaged condition, if accepted, company is not responsible and the entire risk lies on the buyer, even if goods are not as per the requirement.
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Payment Terms: Cash On Delivery to our Delivery channel partner only.
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Company is not responsible if cash is paid to the any agent or representative.
                </Text>

                <Text style={{fontSize:14,marginTop:5,fontWeight:'normal',color:'black',textAlign:'justify'}}>
                    {"=> "} Any disputes - subject to Bangalore Jurisdiction only.
                </Text>
                </View>

                <View style={{marginTop:5,flexDirection:'row',alignItems:'center'}}>
                <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    />
                    <Text style={{fontSize:16,fontWeight:'normal',color:'black',marginTop:0}}>I Agree</Text>

                </View>

                </View>

                <View style={styles.button}>
                            <LinearGradientButton title="PLACE ORDER" onPress={() => {
                                if(fName !== ""){
                                    if(lName !== ""){
                                        //if(country !== ""){
                                            if(address1.trim() !== ""){
                                                if(zipCode !== ""){
                                                    if(zipCode.length >= 6){
                                                        if(serviceable == true){
                                                        if(city !== ""){
                                                            if(state !== ""){
                                                                if(isSelectedDiffAddress == true){
                                                                    //if(shippingCountry !== ""){
                                                                        if(pickupPersonName !== ""){
                                                                            if(pickupContactNumber !== ""){
                                                                                if(pickupContactNumber.length >= 10){
                                                                                    if(shippingZipCode !== ""){
                                                                                        if(shippingZipCode.length >= 6){
                                                                                            if(serviceable == true){
                                                                                            if(shippingAddress1.trim() !== ""){
                                                                                        if(shippingCity !== ""){
                                                                                            if(shippingState !== ""){
                                                                                                    if(value !== '' && value !== undefined){
                                                                                                        if(isSelected === true){
                                                                                                            if(value === "Cash on Delivery"){
                                                                                                                if(parseInt(totalValue) > 20000){
                                                                                                                    Alert.alert(
                                                                                                                        "USDFAB Alert",
                                                                                                                        "Cash on Delivery can be used as payment method only for orders less than Rs. 20,000."+"\n\n"+"Please Click OK to make payment through Online.",
                                                                                                                        [
                                                                                                                            {
                                                                                                                                text:"OK", onPress: () => {
                
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
                                                                                                                                        'company_name': companyName
                                                                                                                                    }
                                                                                                                                    console.log(frmdetails);
                                                                                                                                    Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                                                                        console.log("Updateeeee1",response);
                                                                                                                                        if(response.status === 1){
                                                                                                                                            var options = {
                                                                                                                                                description: '',
                                                                                                                                                image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                                                currency: 'INR',
                                                                                                                                                key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                                                amount: parseInt(totalValue) * 100,
                                                                                                                                                name: "USDFab",
                                                                                                                                                prefill: {
                                                                                                                                                email: userEmail,
                                                                                                                                                contact: userMobile,
                                                                                                                                                name: "USDFab"
                                                                                                                                                },
                                                                                                                                                theme: {color: '#F37254'}
                                                                                                                                            }
                                                                                                                                                RazorpayCheckout.open(options).then((data) => {
                                                                                                                                                // handle success
                                                                                                        
                                                                                                                                                const paymentDetails = {
                                                                                                                                                    'user_id': userId,
                                                                                                                                                    'payment_credit': creditAmount,
                                                                                                                                                    'discount': rewardPoint,
                                                                                                                                                    'wallet_amount':walletDiscountValue,
                                                                                                                                                    'payment_total':totalValue,
                                                                                                                                                    'payment_gross':totalValue,
                                                                                                                                                    'payment_type':value,
                                                                                                                                                    'credit_repay_date': creditDate,
                                                                                                                                                    'order_notes':message,
                                                                                                                                                    'store_pickup':'',
                                                                                                                                                    'pickup_person_name':pickupPersonName,
                                                                                                                                                    'pickup_person_phone':pickupContactNumber,
                                                                                                                                                    'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                                                    'razorpay_order_id': "",
                                                                                                                                                    'razorpay_signature': "",
                                                                                                                                                    'shipping_country': shippingCountry,
                                                                                                                                                    'shipping_address1': shippingAddress1,
                                                                                                                                                    'shipping_address2': shippingAddress2,
                                                                                                                                                    'shipping_city': shippingCity,
                                                                                                                                                    'shipping_state': shippingState,
                                                                                                                                                    'shipping_zipcode': shippingZipCode,
                                                                                                                                                }
                                                                                                                                                console.log(paymentDetails);
                                                                                                            
                                                                                                                                                Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                                                    console.log("Updateeeee2",response);
                                                                                                                                                    if(response.status === 1){
                                                                                                                                                        Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                                        //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                                        navigation.navigate("MyOrders")
                                                                                                                                                    }else{
                                                                                                                                                        Alert.alert("Failed",response.msg)
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                        
                                                                                                                                            }).catch((error) => {
                                                                                                                                                // handle failure
                                                                                                                                                Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                                                            });
                                                                                                                                        }else{
                                                                                                                                            var options = {
                                                                                                                                                description: '',
                                                                                                                                                image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                                                currency: 'INR',
                                                                                                                                                key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                                                amount: parseInt(totalValue) * 100,
                                                                                                                                                name: "USDFab",
                                                                                                                                                prefill: {
                                                                                                                                                email: userEmail,
                                                                                                                                                contact: userMobile,
                                                                                                                                                name: "USDFab"
                                                                                                                                                },
                                                                                                                                                theme: {color: '#F37254'}
                                                                                                                                            }
                                                                                                                                                RazorpayCheckout.open(options).then((data) => {
                                                                                                                                                // handle success
                                                                                                        
                                                                                                                                                const paymentDetails = {
                                                                                                                                                    'user_id': userId,
                                                                                                                                                    'payment_credit': creditAmount,
                                                                                                                                                    'discount': rewardPoint,
                                                                                                                                                    'wallet_amount':walletDiscountValue,
                                                                                                                                                    'payment_total':totalValue,
                                                                                                                                                    'payment_gross':totalValue,
                                                                                                                                                    'payment_type':value,
                                                                                                                                                    'credit_repay_date': creditDate,
                                                                                                                                                    'order_notes':message,
                                                                                                                                                    'store_pickup':'',
                                                                                                                                                    'pickup_person_name':pickupPersonName,
                                                                                                                                                    'pickup_person_phone':pickupContactNumber,
                                                                                                                                                    'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                                                    'razorpay_order_id': "",
                                                                                                                                                    'razorpay_signature': "",
                                                                                                                                                    'shipping_country': shippingCountry,
                                                                                                                                                    'shipping_address1': shippingAddress1,
                                                                                                                                                    'shipping_address2': shippingAddress2,
                                                                                                                                                    'shipping_city': shippingCity,
                                                                                                                                                    'shipping_state': shippingState,
                                                                                                                                                    'shipping_zipcode': shippingZipCode,
                                                                                                                                                }
                                                                                                                                                console.log(paymentDetails);
                                                                                                            
                                                                                                                                                Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                                                    console.log("Updateeeee3",response);
                                                                                                                                                    if(response.status === 1){
                                                                                                                                                        Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                                        //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                                        navigation.navigate("MyOrders")
                                                                                                                                                    }else{
                                                                                                                                                        Alert.alert("Failed",response.msg)
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                        
                                                                                                                                            }).catch((error) => {
                                                                                                                                                // handle failure
                                                                                                                                                Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                }
                                                                                                                            },
                                                                                                                            {
                                                                                                                                text:"Cancel",
                                                                                                                                onPress: () => console.log("Cancel Pressed")
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    )
                                                                                                                }else {
                                                                                                                    setLoading(true)
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
                                                                                                                        'company_name': companyName
                                                                                                                    }
                                                                                                                    Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                                                        console.log("Updateeeee4",response);
                                                                                                                        if(response.status === 1){
                                                                                                                            const frmdetails = {
                                                                                                                                'user_id': userId,
                                                                                                                                'payment_credit': creditAmount,
                                                                                                                                'discount': rewardPoint,
                                                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                                                'payment_total':totalValue,
                                                                                                                                'payment_gross':totalValue,
                                                                                                                                'payment_type':value,
                                                                                                                                'credit_repay_date': creditDate,
                                                                                                                                'order_notes':message,
                                                                                                                                'store_pickup':'',
                                                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                                                'razorpay_payment_id':'',
                                                                                                                                'razorpay_order_id':'',
                                                                                                                                'razorpay_signature':'',
                                                                                                                                'shipping_country': shippingCountry,
                                                                                                                                'shipping_address1': shippingAddress1,
                                                                                                                                'shipping_address2': shippingAddress2,
                                                                                                                                'shipping_city': shippingCity,
                                                                                                                                'shipping_state': shippingState,
                                                                                                                                'shipping_zipcode': shippingZipCode,
                                                                                                                            }
                                                                                                                            console.log(frmdetails);
                                                                                                        
                                                                                                                            Services(Constants.API_BASE_URL + "/save_order", frmdetails,"POST").then((response) => {
                                                                                                                                console.log("Updateeeee5",response);
                                                                                                                                if(response.status === 1){
                                                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                    setLoading(false)
                                                                                                                                    navigation.navigate("MyOrders")
                                                                                                                                }else{
                                                                                                                                    setLoading(false)
                                                                                                                                    Alert.alert("Failed",response.msg)
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }else{
                                                                                                                            setLoading(true)
                                                                                                                            const frmdetails = {
                                                                                                                                'user_id': userId,
                                                                                                                                'payment_credit': creditAmount,
                                                                                                                                'discount': rewardPoint,
                                                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                                                'payment_total':totalValue,
                                                                                                                                'payment_gross':totalValue,
                                                                                                                                'payment_type':value,
                                                                                                                                'credit_repay_date': creditDate,
                                                                                                                                'order_notes':message,
                                                                                                                                'store_pickup':'',
                                                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                                                'razorpay_payment_id':'',
                                                                                                                                'razorpay_order_id':'',
                                                                                                                                'razorpay_signature':'',
                                                                                                                                'shipping_country': shippingCountry,
                                                                                                                                'shipping_address1': shippingAddress1,
                                                                                                                                'shipping_address2': shippingAddress2,
                                                                                                                                'shipping_city': shippingCity,
                                                                                                                                'shipping_state': shippingState,
                                                                                                                                'shipping_zipcode': shippingZipCode,
                                                                                                                            }
                                                                                                                            console.log(frmdetails);
                                                                                                        
                                                                                                                            Services(Constants.API_BASE_URL + "/save_order", frmdetails,"POST").then((response) => {
                                                                                                                                console.log("Updateeeee6",response);
                                                                                                                                if(response.status === 1){
                                                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                    setLoading(false)
                                                                                                                                    navigation.navigate("MyOrders")
                                                                                                                                }else{
                                                                                                                                    setLoading(false)
                                                                                                                                    Alert.alert("Failed",response.msg)
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                    })  
                                                                                                                }
                                                                                                            }else{
                
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
                                                                                                                    'company_name': companyName
                                                                                                                }
                                                                                                                Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                                                    console.log("Updateeeee7",response);
                                                                                                                    if(response.status === 1){
                                                                                                                        var options = {
                                                                                                                            description: '',
                                                                                                                            image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                            currency: 'INR',
                                                                                                                            key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                            amount: parseInt(totalValue) * 100,
                                                                                                                            name: "USDFab",
                                                                                                                            prefill: {
                                                                                                                            email: userEmail,
                                                                                                                            contact: userMobile,
                                                                                                                            name: "USDFab"
                                                                                                                            },
                                                                                                                            theme: {color: '#F37254'}
                                                                                                                        }
                                                                                                                            RazorpayCheckout.open(options).then((data) => {
                                                                                                                            // handle success
                                                                                                        
                                                                                                                            const paymentDetails = {
                                                                                                                                'user_id': userId,
                                                                                                                                'payment_credit': creditAmount,
                                                                                                                                'discount': rewardPoint,
                                                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                                                'payment_total':totalValue,
                                                                                                                                'payment_gross':totalValue,
                                                                                                                                'payment_type':value,
                                                                                                                                'credit_repay_date': creditDate,
                                                                                                                                'order_notes':message,
                                                                                                                                'store_pickup':'',
                                                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                                                'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                                'razorpay_order_id': "",
                                                                                                                                'razorpay_signature': "",
                                                                                                                                'shipping_country': shippingCountry,
                                                                                                                                'shipping_address1': shippingAddress1,
                                                                                                                                'shipping_address2': shippingAddress2,
                                                                                                                                'shipping_city': shippingCity,
                                                                                                                                'shipping_state': shippingState,
                                                                                                                                'shipping_zipcode': shippingZipCode,
                                                                                                                            }
                                                                                                                            console.log(paymentDetails);
                                                                                                        
                                                                                                                            Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                                console.log("Updateeeee8",response);
                                                                                                                                if(response.status === 1){
                                                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                    navigation.navigate("MyOrders");
                                                                                                                                }else{
                                                                                                                                    Alert.alert("Failed",response.msg);
                                                                                                                                }
                                                                                                                            })
                                                                                                        
                                                                                                                        }).catch((error) => {
                                                                                                                            // handle failure
                                                                                                                            Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                                        });
                                                                                                        
                                                                                                                    }else{
                                                                                                                        var options = {
                                                                                                                            description: '',
                                                                                                                            image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                            currency: 'INR',
                                                                                                                            key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                            amount: parseInt(totalValue) * 100,
                                                                                                                            name: "USDFab",
                                                                                                                            prefill: {
                                                                                                                            email: userEmail,
                                                                                                                            contact: userMobile,
                                                                                                                            name: "USDFab"
                                                                                                                            },
                                                                                                                            theme: {color: '#F37254'}
                                                                                                                        }
                                                                                                                            RazorpayCheckout.open(options).then((data) => {
                                                                                                                            // handle success
                                                                                                        
                                                                                                                            const paymentDetails = {
                                                                                                                                'user_id': userId,
                                                                                                                                'payment_credit': creditAmount,
                                                                                                                                'discount': rewardPoint,
                                                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                                                'payment_total':totalValue,
                                                                                                                                'payment_gross':totalValue,
                                                                                                                                'payment_type':value,
                                                                                                                                'credit_repay_date': creditDate,
                                                                                                                                'order_notes':message,
                                                                                                                                'store_pickup':'',
                                                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                                                'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                                'razorpay_order_id': "",
                                                                                                                                'razorpay_signature': "",
                                                                                                                                'shipping_country': shippingCountry,
                                                                                                                                'shipping_address1': shippingAddress1,
                                                                                                                                'shipping_address2': shippingAddress2,
                                                                                                                                'shipping_city': shippingCity,
                                                                                                                                'shipping_state': shippingState,
                                                                                                                                'shipping_zipcode': shippingZipCode,
                                                                                                                            }
                                                                                                                            console.log(paymentDetails);
                                                                                                        
                                                                                                                            Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                                console.log("Updateeeee9",response);
                                                                                                                                if(response.status === 1){
                                                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                                    navigation.navigate("MyOrders");
                                                                                                                                }else{
                                                                                                                                    Alert.alert("Failed",response.msg);
                                                                                                                                }
                                                                                                                            })
                                                                                                        
                                                                                                                        }).catch((error) => {
                                                                                                                            // handle failure
                                                                                                                            Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                                        });
                                                                                                        
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }else{
                                                                                                            if (Platform.OS === 'android') {
                                                                                                                ToastAndroid.showWithGravity("Accept Terms & Conditions.", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                        } else {
                                                                                                                AlertIOS.alert("Accept Terms & Conditions.");
                                                                                                            } 
                                                                                                        }
                                                                                                    }else{
                                                                                                        if (Platform.OS === 'android') {
                                                                                                                ToastAndroid.showWithGravity("Select Payment Type", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                        } else {
                                                                                                                AlertIOS.alert("Select Payment Type");
                                                                                                            }
                                                                                                    }
                                                                                            }else{
                                                                                                alert("Select Your Shipping State.")
                                                                                            }
                                                                                        }else{
                                                                                            alert("Enter Your Shipping City.")
                                                                                        }
                                                                                    }else{
                                                                                        alert("Enter Your Shipping Address.")   
                                                                                        }
                                                                                    }else{
                                                                                        alert("Delivery pincode not serviceable.")
                                                                                    }
                                                                                    }else{
                                                                                        alert("Enter Valid Shipping PinCode.")
                                                                                    }
                                                                                    }else{
                                                                                        alert("Enter Your Shipping PinCode.")
                                                                                    }
                                                                            
                                                                            
                                                                                }else{
                                                                                alert("Enter Valid Mobile(Ship to Different Address).")
                                                                            }
                                                                        }else{
                                                                            alert("Enter Mobile(Ship to Different Address).")
                                                                        }
                                                                        }else{
                                                                            alert("Enter Full Name(Ship to Different Address).")
                                                                        }
                                                                        
                                                                    // }else{
                                                                    //     alert("Enter Your Shipping Country.")
                                                                    // }
                                                                }else{
                                                                    if(value !== '' && value !== undefined){
                                                                        if(isSelected === true){
                                                                            if(value === "Cash on Delivery"){
                                                                                if(parseInt(totalValue) > 20000){
                                                                                    Alert.alert(
                                                                                        "USDFAB Alert",
                                                                                        "Cash on Delivery can be used as payment method only for orders less than Rs. 20,000."+"\n\n"+"Please Click OK to make payment through Online.",
                                                                                        [
                                                                                            {
                                                                                                text:"OK", onPress: () => {

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
                                                                                                        'company_name': companyName
                                                                                                    }
                                                                                                    Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                                        console.log("Updateeeee10",response);
                                                                                                        if(response.status === 1){
                                                                                                            var options = {
                                                                                                                description: '',
                                                                                                                image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                currency: 'INR',
                                                                                                                key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                amount: parseInt(totalValue) * 100,
                                                                                                                name: "USDFab",
                                                                                                                prefill: {
                                                                                                                email: userEmail,
                                                                                                                contact: userMobile,
                                                                                                                name: "USDFab"
                                                                                                                },
                                                                                                                theme: {color: '#F37254'}
                                                                                                            }
                                                                                                                RazorpayCheckout.open(options).then((data) => {
                                                                                                                // handle success
                                                                        
                                                                                                                const paymentDetails = {
                                                                                                                    'user_id': userId,
                                                                                                                    'payment_credit': creditAmount,
                                                                                                                    'discount': rewardPoint,
                                                                                                                    'wallet_amount':walletDiscountValue,
                                                                                                                    'payment_total':totalValue,
                                                                                                                    'payment_gross':totalValue,
                                                                                                                    'payment_type':value,
                                                                                                                    'credit_repay_date': creditDate,
                                                                                                                    'order_notes':message,
                                                                                                                    'store_pickup':'',
                                                                                                                    'pickup_person_name':pickupPersonName,
                                                                                                                    'pickup_person_phone':pickupContactNumber,
                                                                                                                    'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                    'razorpay_order_id': "",
                                                                                                                    'razorpay_signature': ""
                                                                                                                }
                                                                                                                console.log(paymentDetails);
                                                                            
                                                                                                                Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                    console.log("Updateeeee11",response);
                                                                                                                    if(response.status === 1){
                                                                                                                        Alert.alert("Success","Order Placed Successfully.");
                                                                                                                        //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                        navigation.navigate("MyOrders")
                                                                                                                    }else{
                                                                                                                        Alert.alert("Failed",response.msg)
                                                                                                                    }
                                                                                                                })
                                                                        
                                                                                                            }).catch((error) => {
                                                                                                                // handle failure
                                                                                                                Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                            });
                                                                                                        }else{
                                                                                                            var options = {
                                                                                                                description: '',
                                                                                                                image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                                                currency: 'INR',
                                                                                                                key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                                                amount: parseInt(totalValue) * 100,
                                                                                                                name: "USDFab",
                                                                                                                prefill: {
                                                                                                                email: userEmail,
                                                                                                                contact: userMobile,
                                                                                                                name: "USDFab"
                                                                                                                },
                                                                                                                theme: {color: '#F37254'}
                                                                                                            }
                                                                                                                RazorpayCheckout.open(options).then((data) => {
                                                                                                                // handle success
                                                                        
                                                                                                                const paymentDetails = {
                                                                                                                    'user_id': userId,
                                                                                                                    'payment_credit': creditAmount,
                                                                                                                    'discount': rewardPoint,
                                                                                                                    'wallet_amount':walletDiscountValue,
                                                                                                                    'payment_total':totalValue,
                                                                                                                    'payment_gross':totalValue,
                                                                                                                    'payment_type':value,
                                                                                                                    'credit_repay_date': creditDate,
                                                                                                                    'order_notes':message,
                                                                                                                    'store_pickup':'',
                                                                                                                    'pickup_person_name':pickupPersonName,
                                                                                                                    'pickup_person_phone':pickupContactNumber,
                                                                                                                    'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                                    'razorpay_order_id': "",
                                                                                                                    'razorpay_signature': ""
                                                                                                                }
                                                                                                                console.log(paymentDetails);
                                                                            
                                                                                                                Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                                    console.log("Updateeeee12",response);
                                                                                                                    if(response.status === 1){
                                                                                                                        Alert.alert("Success","Order Placed Successfully.");
                                                                                                                        //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                                        navigation.navigate("MyOrders")
                                                                                                                    }else{
                                                                                                                        Alert.alert("Failed",response.msg)
                                                                                                                    }
                                                                                                                })
                                                                        
                                                                                                            }).catch((error) => {
                                                                                                                // handle failure
                                                                                                                Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                                            });
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                text:"Cancel",
                                                                                                onPress: () => console.log("Cancel Pressed")
                                                                                            }
                                                                                        ]
                                                                                    )
                                                                                }else {
                                                                                    setLoading(true)
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
                                                                                        'company_name': companyName
                                                                                    }
                                                                                    Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                        console.log("Updateeeee13",response);
                                                                                        if(response.status === 1){
                                                                                            const frmdetails = {
                                                                                                'user_id': userId,
                                                                                                'payment_credit': creditAmount,
                                                                                                'discount': rewardPoint,
                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                'payment_total':totalValue,
                                                                                                'payment_gross':totalValue,
                                                                                                'payment_type':value,
                                                                                                'credit_repay_date': creditDate,
                                                                                                'order_notes':message,
                                                                                                'store_pickup':'',
                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                'razorpay_payment_id':'',
                                                                                                'razorpay_order_id':'',
                                                                                                'razorpay_signature':''
                                                                                            }
                                                                                            console.log(frmdetails);
                                                                        
                                                                                            Services(Constants.API_BASE_URL + "/save_order", frmdetails,"POST").then((response) => {
                                                                                                console.log("Updateeeee14",response);
                                                                                                if(response.status === 1){
                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                    setLoading(false)
                                                                                                    navigation.navigate("MyOrders")
                                                                                                }else{
                                                                                                    setLoading(false)
                                                                                                    Alert.alert("Failed",response.msg)
                                                                                                }
                                                                                            })
                                                                                        }else{
                                                                                            setLoading(true)
                                                                                            const frmdetails = {
                                                                                                'user_id': userId,
                                                                                                'payment_credit': creditAmount,
                                                                                                'discount': rewardPoint,
                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                'payment_total':totalValue,
                                                                                                'payment_gross':totalValue,
                                                                                                'payment_type':value,
                                                                                                'credit_repay_date': creditDate,
                                                                                                'order_notes':message,
                                                                                                'store_pickup':'',
                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                'razorpay_payment_id':'',
                                                                                                'razorpay_order_id':'',
                                                                                                'razorpay_signature':''
                                                                                            }
                                                                                            console.log(frmdetails);
                                                                        
                                                                                            Services(Constants.API_BASE_URL + "/save_order", frmdetails,"POST").then((response) => {
                                                                                                console.log("Updateeeee15",response);
                                                                                                if(response.status === 1){
                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                    setLoading(false)
                                                                                                    navigation.navigate("MyOrders")
                                                                                                }else{
                                                                                                    setLoading(false)
                                                                                                    Alert.alert("Failed",response.msg)
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    })  
                                                                                }
                                                                            }else{

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
                                                                                    'company_name': companyName
                                                                                }
                                                                                Services(Constants.API_BASE_URL + "/update_profile", frmdetails,"POST").then((response) => {
                                                                                    console.log("Updateeeee16",response);
                                                                                    if(response.status === 1){
                                                                                        var options = {
                                                                                            description: '',
                                                                                            image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                            currency: 'INR',
                                                                                            key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                            amount: parseInt(totalValue) * 100,
                                                                                            name: "USDFab",
                                                                                            prefill: {
                                                                                            email: userEmail,
                                                                                            contact: userMobile,
                                                                                            name: "USDFab"
                                                                                            },
                                                                                            theme: {color: '#F37254'}
                                                                                        }
                                                                                            RazorpayCheckout.open(options).then((data) => {
                                                                                            // handle success
                                                                        
                                                                                            const paymentDetails = {
                                                                                                'user_id': userId,
                                                                                                'payment_credit': creditAmount,
                                                                                                'discount': rewardPoint,
                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                'payment_total':totalValue,
                                                                                                'payment_gross':totalValue,
                                                                                                'payment_type':value,
                                                                                                'credit_repay_date': creditDate,
                                                                                                'order_notes':message,
                                                                                                'store_pickup':'',
                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                'razorpay_order_id': "",
                                                                                                'razorpay_signature': ""
                                                                                            }
                                                                                            console.log(paymentDetails);
                                                                        
                                                                                            Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                console.log("Updateeeee17",response);
                                                                                                if(response.status === 1){
                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                    navigation.navigate("MyOrders");
                                                                                                }else{
                                                                                                    Alert.alert("Failed",response.msg);
                                                                                                }
                                                                                            })
                                                                        
                                                                                        }).catch((error) => {
                                                                                            // handle failure
                                                                                            Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                        });
                                                                        
                                                                                    }else{
                                                                                        var options = {
                                                                                            description: '',
                                                                                            image: "https://usdfab.b-cdn.net/assets/img/logo.png",
                                                                                            currency: 'INR',
                                                                                            key: 'rzp_live_5L6aXiDVB1aqeP',
                                                                                            amount: parseInt(totalValue) * 100,
                                                                                            name: "USDFab",
                                                                                            prefill: {
                                                                                            email: userEmail,
                                                                                            contact: userMobile,
                                                                                            name: "USDFab"
                                                                                            },
                                                                                            theme: {color: '#F37254'}
                                                                                        }
                                                                                            RazorpayCheckout.open(options).then((data) => {
                                                                                            // handle success
                                                                        
                                                                                            const paymentDetails = {
                                                                                                'user_id': userId,
                                                                                                'payment_credit': creditAmount,
                                                                                                'discount': rewardPoint,
                                                                                                'wallet_amount':walletDiscountValue,
                                                                                                'payment_total':totalValue,
                                                                                                'payment_gross':totalValue,
                                                                                                'payment_type':value,
                                                                                                'credit_repay_date': creditDate,
                                                                                                'order_notes':message,
                                                                                                'store_pickup':'',
                                                                                                'pickup_person_name':pickupPersonName,
                                                                                                'pickup_person_phone':pickupContactNumber,
                                                                                                'razorpay_payment_id': data.razorpay_payment_id,
                                                                                                'razorpay_order_id': "",
                                                                                                'razorpay_signature': ""
                                                                                            }
                                                                                            console.log(paymentDetails);
                                                                        
                                                                                            Services(Constants.API_BASE_URL + "/save_order", paymentDetails,"POST").then((response) => {
                                                                                                console.log("Updateeeee`8",response);
                                                                                                if(response.status === 1){
                                                                                                    Alert.alert("Success","Order Placed Successfully.");
                                                                                                    //ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                                                    navigation.navigate("MyOrders");
                                                                                                }else{
                                                                                                    Alert.alert("Failed",response.msg);
                                                                                                }
                                                                                            })
                                                                        
                                                                                        }).catch((error) => {
                                                                                            // handle failure
                                                                                            Alert.alert("Failed","Transaction Cancelled/ Failed. Please try again.");
                                                                                        });
                                                                        
                                                                                    }
                                                                                })
                                                                            }
                                                                        }else{
                                                                            if (Platform.OS === 'android') {
                                                                                ToastAndroid.showWithGravity("Accept Terms & Conditions.", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                        } else {
                                                                                AlertIOS.alert("Accept Terms & Conditions.");
                                                                            } 
                                                                        }
                                                                    }else{
                                                                        if (Platform.OS === 'android') {
                                                                                ToastAndroid.showWithGravity("Select Payment Type", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                                                        } else {
                                                                                AlertIOS.alert("Select Payment Type");
                                                                            }
                                                                    }
                                                                }
                                                            }else{
                                                                alert("Select Your State.")
                                                            }
                                                            }else{
                                                                alert("Enter Your City.")
                                                            }
                                                        }else{
                                                            alert("Delivery pincode not serviceable.")
                                                        }
                                                    }else{
                                                        alert("Enter Valid PinCode.")
                                                    }
                                                }else{
                                                    alert("Enter Your PinCode.")
                                                }
                                            }else{
                                               alert("Enter Your Address.")   
                                            }
                                        // }else{
                                        //     alert("Enter Your Country.")
                                        // }
                                    }else{
                                        alert("Enter Last Name.")
                                    }
                                }else{
                                    alert("Enter First name.")
                                }
                                
                            }}/>
                </View>

            {/* </View> */}

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode = "date"
                minimumDate = {new Date()}
                onConfirm = {handleConfirm}
                onCancel = {hideDatePicker}
            />

            </View>
            </ScrollView>
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