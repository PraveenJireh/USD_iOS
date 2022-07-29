import React, { useState } from 'react'
import { View, Image, Text, Modal, ToastAndroid, SafeAreaView, Alert, Linking, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { Formik, } from 'formik';
import * as Yup from 'yup';
import { Colors, Images } from '@themes';
import styles from './styles';
import stylesmodal from './stylesmodal';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradientButton, Picker, RadioButtons } from "@common";
import { HeaderAuth, OtpModal } from '@components';
import Services from "@Services";
import Constants from '../../../themes/Constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Content } from "native-base";
import CheckBox from '@react-native-community/checkbox';
import { UserContext } from '@context/user-context';
import PasswordInputText from 'react-native-hide-show-password-input';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const options = [
    {
        key: 'consumer',
        text: 'Consumer',
    },
    {
        key: 'wolesaler',
        text: 'B2B',
    }
];
const CELL_COUNT = 4;

export default function SignUp() {
    const [userType, setUserType] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [consumerShow, setConsumerShow] = useState(false);
    const [wolesalerShow, setWoleSalerShow] = useState(false);
    const { user, setUser } = React.useContext(UserContext);
    const [selectedOption, setSelectedOption] = React.useState(null);

    const [refreshing, setRefreshing] = React.useState(false);
    const [isSelected, setSelection] = useState(false);

    const [isMobileVerified, setMobileVerified] = useState(false);
    const [isGSTVerified, setGSTVerified] = useState(false);

    const [requestOtpValue, setRequestOtpValue] = useState("Send OTP");
    const [requestGstValue, setRequestGstValue] = useState("Verify GST");

    const [isMobileVerified1, setMobileVerified1] = useState(true);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const onSelect = (item) => {
        if (selectedOption && selectedOption.key === item.key) {
            setSelectedOption(null);
        } else {

            setMobileVerified(false)
            setMobileVerified1(true)
            setRequestOtpValue("Send OTP")

            setSelectedOption(item);

            if (item.key === 'consumer') {
                setConsumerShow(true)
                setWoleSalerShow(false)
                //alert(item.key)
            } else if (item.key === 'wolesaler') {
                setConsumerShow(false)
                setWoleSalerShow(true)
            }
        }
    };

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.logincontainer}>

                <Text style={styles.welcmeTxt}>Register</Text>

                <Text style={{ marginVertical: 5, fontSize: 18, fontWeight: "bold" }}>Register in Seconds!</Text>

                <Text style={{ marginVertical: 5, fontSize: 16, fontWeight: "normal" }}>Signup using your Email address</Text>

                <View style={{ marginTop: 10 }}>
                    <RadioButtons
                        selectedOption={selectedOption}
                        onSelect={onSelect}
                        options={options}
                    />
                </View>

                {consumerShow ? (
                    <Formik
                        initialValues={{
                            first_name: '',
                            last_name: '',
                            email: '',
                            password: '',
                            confirm_password: '',
                            phone_no: '',
                            agent_id: '',
                            user_type: '2'
                        }}
                        onSubmit={values => console.log(values)}
                    >

                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>

                                    <Text style={styles.inputtitle}>Firstname</Text>

                                    <View style={styles.textInputView}>
                                        <TextInput
                                            placeholder="Firstname"
                                            style={styles.input}
                                            value={values.first_name}
                                            onChangeText={handleChange("first_name")}
                                            placeholderTextColor="grey"
                                            keyboardType="default" />
                                    </View>

                                    <Text style={styles.inputtitle}>Lastname</Text>

                                    <View style={styles.textInputView}>
                                        <TextInput
                                            placeholder="Lastname"
                                            style={styles.input}
                                            value={values.last_name}
                                            onChangeText={handleChange("last_name")}
                                            placeholderTextColor="grey"
                                            keyboardType="default" />
                                    </View>

                                    <Text style={styles.inputtitle}>Email ID</Text>

                                    <View style={styles.textInputView}>
                                        <TextInput
                                            placeholder="Email ID"
                                            style={styles.input}
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            placeholderTextColor="grey"
                                            keyboardType="email-address" />
                                    </View>

                                    <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}>Create Password</Text>
                                    <View style={styles.passwordInputView}>
                                        <PasswordInputText
                                            label={null}
                                            placeholder="Create Password"
                                            style={styles.input}
                                            value={values.password}
                                            onChangeText={handleChange("password")}
                                            secureTextEntry={true}
                                            placeholderTextColor="grey" />
                                    </View>

                                    <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}>Confirm Password</Text>
                                    <View style={styles.passwordInputView}>
                                        <PasswordInputText
                                            label={null}
                                            placeholder="Confirm Password"
                                            style={styles.input}
                                            value={values.confirm_password}
                                            onChangeText={handleChange("confirm_password")}
                                            secureTextEntry={true}
                                            placeholderTextColor="grey" />
                                    </View>

                                    <Text style={styles.inputtitle}>Phone No</Text>

                                    <View style={styles.textInputFlexView}>
                                        <TextInput
                                            placeholder="Phone No"
                                            style={{
                                                flex: 1,
                                                direction: 'ltr',
                                                alignItems: "flex-start",
                                                alignContent: "flex-start",
                                                fontSize: 16,
                                                margin: 0,
                                                padding: 0
                                            }}
                                            value={values.phone_no}
                                            onChangeText={handleChange("phone_no")}
                                            maxLength={10}
                                            editable={isMobileVerified1}
                                            selectTextOnFocus={isMobileVerified1}
                                            placeholderTextColor="grey"
                                            keyboardType="phone-pad" />
                                        <TouchableOpacity onPress={() => {
                                            if (isMobileVerified == false) {
                                                if (values.phone_no.trim() != "") {
                                                    Services(Constants.API_BASE_URL + "send_otp", { "phone_no": values.phone_no }, "POST").then((response) => {
                                                        //console.log("Send OTPPPP",response);
                                                        if (response.status === 1) {
                                                            setModalVisible(true)
                                                        } else {
                                                            alert(response.msg)
                                                        }
                                                    })
                                                } else {
                                                    if (Platform.OS === 'android') {
                                                        ToastAndroid.showWithGravity("Please Enter Phone Number", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                    } else {
                                                        AlertIOS.alert("Please Enter Phone Number");
                                                    }
                                                }
                                            }
                                        }
                                        }>

                                            <Text
                                                style={{
                                                    alignItems: "flex-end",
                                                    textAlign: "right",
                                                    alignSelf: "flex-end",
                                                    alignContent: "flex-end",
                                                    justifyContent: "flex-end",
                                                    fontSize: 16,
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "red",
                                                }}
                                            >{requestOtpValue}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.inputtitle}>Referral Code</Text>

                                    <View style={styles.textInputView}>
                                        <TextInput
                                            placeholder="Referral Code"
                                            style={styles.input}
                                            value={values.agent_id}
                                            onChangeText={handleChange("agent_id")}
                                            placeholderTextColor="grey"
                                            keyboardType="default" />
                                    </View>

                                    {/* <Text style={styles.inputtitle}>Representative Code</Text>

                        <View style={styles.textInputView}>
                            <TextInput
                                placeholder="Representative Code"
                                style={styles.input}
                                value = {values.representative_code}
                                onChangeText={handleChange("representative_code")}
                                placeholderTextColor="grey"
                                keyboardType = "default" />
                        </View> */}

                                    <View style={{ marginTop: 10 }}>

                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>General Terms & Conditions:</Text>

                                        <View style={{ padding: 10 }}>
                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Goods once sold are not exchanged. Exchange only in case of Size difference, manufacturing defect.
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Time Frame for exchange : within 15 days on Receipt of Goods.
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} (Proof - Consignment opening should be in the form of video Clipping until end – Ensure the consignment acceptance only when intact condition).
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Please do not accept any consignment pack in damaged condition, if accepted, company is not responsible and the entire risk lies on the buyer, even if goods are not as per the requirement.
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Payment Terms: Cash On Delivery to our Delivery channel partner only.
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Company is not responsible if cash is paid to the any agent or representative.
                                            </Text>

                                            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                {'\u2B24'} Any disputes - subject to Bangalore Jurisdiction only.
                                            </Text>
                                        </View>

                                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                            <CheckBox
                                                value={isSelected}
                                                onValueChange={setSelection}
                                            />
                                            <Text style={{ fontSize: 16, fontWeight: 'normal', color: 'black', marginTop: 0 }}>I Agree</Text>

                                        </View>

                                    </View>

                                    <View style={styles.button}>
                                        <LinearGradientButton title="SIGNUP" onPress={() => {
                                            if (selectedOption != null) {
                                                if (values.first_name.trim() != "") {
                                                    if (values.last_name.trim() != "") {
                                                        if (values.email.trim() != "") {
                                                            if (values.password.trim() != "") {
                                                                if (values.confirm_password.trim() != "") {
                                                                    if (values.password.trim() == values.confirm_password.trim()) {
                                                                        if (values.phone_no.trim() != "") {
                                                                            if (isSelected === true) {
                                                                                if (isMobileVerified === true) {
                                                                                    Services(Constants.API_BASE_URL + "/register", values, "POST").then((response) => {
                                                                                        console.log("Registerrrr", values);
                                                                                        if (response.status === 1) {
                                                                                            AsyncStorage.setItem("@USER_ID", `${response.user_id}`);

                                                                                            var body = {
                                                                                                "user_id": `${response.user_id}`
                                                                                            }
                                                                                            Services(Constants.API_BASE_URL + "/get_user_details", body, "POST").then((response) => {
                                                                                                if (response.status === 1) {
                                                                                                    setUser(response.data);
                                                                                                    navigation.push("Home")
                                                                                                    //navigation.pop();
                                                                                                } else {
                                                                                                    alert(response.msg)
                                                                                                    console.log("1" + response.msg)
                                                                                                }
                                                                                            })

                                                                                            if (Platform.OS === 'android') {
                                                                                                ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                            } else {
                                                                                                AlertIOS.alert(response.msg);
                                                                                            }
                                                                                        } else {
                                                                                            alert(response.msg)
                                                                                            console.log("2" + response.msg)
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    if (Platform.OS === 'android') {
                                                                                        ToastAndroid.showWithGravity("Please Verify Your Mobile Number.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                    } else {
                                                                                        AlertIOS.alert("Please Verify Your Mobile Number.");
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if (Platform.OS === 'android') {
                                                                                    ToastAndroid.showWithGravity("Accept Terms & Conditions.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                } else {
                                                                                    AlertIOS.alert("Accept Terms & Conditions.");
                                                                                }
                                                                            }
                                                                            //navigation.push("Home")
                                                                        } else {
                                                                            if (Platform.OS === 'android') {
                                                                                ToastAndroid.showWithGravity("Please Enter Phone Number", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                            } else {
                                                                                AlertIOS.alert("Please Enter Phone Number");
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (Platform.OS === 'android') {
                                                                            ToastAndroid.showWithGravity("Both Password should be same.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                        } else {
                                                                            AlertIOS.alert("Both Password should be same.");
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (Platform.OS === 'android') {
                                                                        ToastAndroid.showWithGravity("Please Enter Confirm Password", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                    } else {
                                                                        AlertIOS.alert("Please Enter Confirm Password");
                                                                    }
                                                                }
                                                            } else {
                                                                if (Platform.OS === 'android') {
                                                                    ToastAndroid.showWithGravity("Please Enter Password", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                } else {
                                                                    AlertIOS.alert("Please Enter Password");
                                                                }
                                                            }
                                                        } else {
                                                            if (Platform.OS === 'android') {
                                                                ToastAndroid.showWithGravity("Please Enter Email", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                            } else {
                                                                AlertIOS.alert("Please Enter Email");
                                                            }
                                                        }
                                                    } else {
                                                        if (Platform.OS === 'android') {
                                                            ToastAndroid.showWithGravity("Please Enter Last Name", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                        } else {
                                                            AlertIOS.alert("Please Enter Last Name");
                                                        }
                                                    }
                                                } else {
                                                    if (Platform.OS === 'android') {
                                                        ToastAndroid.showWithGravity("Please Enter First Name", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                    } else {
                                                        AlertIOS.alert("Please Enter First Name");
                                                    }
                                                }
                                            } else {
                                                if (Platform.OS === 'android') {
                                                    ToastAndroid.showWithGravity("Please Select User Type", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                } else {
                                                    AlertIOS.alert("Please Select User Type");
                                                }
                                            }
                                        }
                                        } />
                                    </View>

                                    {/* <View style={styles.borderView} /> */}

                                    <View style={styles.bottomView}>
                                        <Text style={styles.txt}>Already have an account? </Text>

                                        <TouchableOpacity onPress={() => navigation.pop()}>
                                            <Text style={styles.registerTxt}>Sign In</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modalVisible}
                                    // onRequestClose={() => {
                                    //   setModalVisible(!modalVisible);
                                    // }}
                                    >
                                        <SafeAreaView style={stylesmodal.container}>
                                            <View style={stylesmodal.mainContainer}>
                                                <View style={stylesmodal.headerView}>
                                                    <View style={stylesmodal.iconView}>
                                                        <TouchableOpacity style={stylesmodal.iconStyle} onPress={() => setModalVisible(!modalVisible)}>
                                                            <Image source={Images.icons.back} style={stylesmodal.iconStyle} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={stylesmodal.titleView}>
                                                        <Text style={stylesmodal.title}>Enter Verification Code</Text>
                                                    </View>
                                                </View>
                                                <Content>

                                                    <View style={stylesmodal.empty} />
                                                    <View style={{}}>
                                                        <Text style={stylesmodal.text1}>Enter OTP Code</Text>
                                                        <Text style={stylesmodal.text2}>We have sent OTP on your number</Text>
                                                        <View style={stylesmodal.otpView}>
                                                            <CodeField
                                                                ref={ref}
                                                                {...props}
                                                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                                                value={value}
                                                                onChangeText={setValue}
                                                                cellCount={CELL_COUNT}
                                                                rootStyle={stylesmodal.codeFieldRoot}
                                                                keyboardType="number-pad"
                                                                textContentType="oneTimeCode"
                                                                renderCell={({ index, symbol, isFocused }) => (
                                                                    <View
                                                                        // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                                                        onLayout={getCellOnLayoutHandler(index)}
                                                                        key={index}
                                                                        style={[stylesmodal.cellRoot, isFocused && stylesmodal.focusCell]}>
                                                                        <Text style={stylesmodal.cellText}>
                                                                            {symbol || (isFocused ? <Cursor /> : null)}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            />
                                                            <Text style={stylesmodal.text3}>Didn't you received any code?</Text>
                                                            <TouchableOpacity style={stylesmodal.text4}
                                                                onPress={() => {
                                                                    Services(Constants.API_BASE_URL + "send_otp", { "phone_no": values.phone_no }, "POST").then((response) => {
                                                                        //console.log("Send OTPPPP",response);
                                                                        if (response.status === 1) {
                                                                            setModalVisible(true)
                                                                        } else {
                                                                            alert(response.msg)
                                                                        }
                                                                    })
                                                                }}>
                                                                <Text style={stylesmodal.text4}>Resend a new code.</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={stylesmodal.button}>
                                                            <LinearGradientButton title="VERIFY"
                                                                onPress={() =>
                                                                    Services(Constants.API_BASE_URL + "verify_otp", { "phone_no": values.phone_no, "otp_num": value }, "POST").then((response) => {
                                                                        console.log("Verify OTPPPP", response);
                                                                        if (response.status === 1) {
                                                                            alert(response.msg)
                                                                            setValue('')
                                                                            setMobileVerified(true)
                                                                            setMobileVerified1(false)
                                                                            setRequestOtpValue("Verified")
                                                                            setModalVisible(!modalVisible)
                                                                        } else {
                                                                            alert(response.msg)
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </View>
                                                    </View>

                                                </Content>
                                            </View>
                                        </SafeAreaView>
                                    </Modal>
                                </View>
                            </ScrollView>
                        )}

                    </Formik>
                ) : null}

                {wolesalerShow ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ScrollView>
                            <Formik
                                initialValues={{
                                    first_name: '',
                                    last_name: '',
                                    email: '',
                                    password: '',
                                    confirm_password: '',
                                    phone_no: '',
                                    company_name: '',
                                    gst_no: '',
                                    agent_id: '',
                                    user_type: '3',
                                    representative_code: ''
                                }}
                                onSubmit={values => console.log(values)}
                            >

                                {({ handleChange, handleBlur, handleSubmit, values }) => (

                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View>

                                            <Text style={styles.inputtitle}>Firstname</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Firstname"
                                                    style={styles.input}
                                                    value={values.first_name}
                                                    onChangeText={handleChange("first_name")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="default" />
                                            </View>

                                            <Text style={styles.inputtitle}>Lastname</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Lastname"
                                                    style={styles.input}
                                                    value={values.last_name}
                                                    onChangeText={handleChange("last_name")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="default" />
                                            </View>

                                            <Text style={styles.inputtitle}>Company Name</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Company Name"
                                                    style={styles.input}
                                                    value={values.company_name}
                                                    onChangeText={handleChange("company_name")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="default" />
                                            </View>

                                            <Text style={styles.inputtitle}>Referral Code</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Referral Code"
                                                    style={styles.input}
                                                    value={values.agent_id}
                                                    onChangeText={handleChange("agent_id")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="default" />
                                            </View>

                                            <Text style={styles.inputtitle}>Representative Code</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Representative Code"
                                                    style={styles.input}
                                                    value={values.representative_code}
                                                    onChangeText={handleChange("representative_code")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="default" />
                                            </View>

                                            <Text style={styles.inputtitle}>GST No</Text>

                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                <View style={{
                                                    shadowOpacity: 0,
                                                    shadowOffset: { width: 0, height: 0 },
                                                    shadowColor: "grey",
                                                    elevation: 0,
                                                    marginTop: 0,
                                                    flex: 1,
                                                    borderRadius: 0,
                                                    flexDirection: "row",
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#e2e2e2",
                                                    paddingHorizontal: 10,
                                                    paddingLeft: 0,
                                                    paddingBottom: 10
                                                }}>
                                                    <TextInput
                                                        placeholder="GST No"
                                                        style={{
                                                            flex: 1,
                                                            direction: 'ltr',
                                                            alignItems: "flex-start",
                                                            alignContent: "flex-start",
                                                            fontSize: 16,
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={values.gst_no}
                                                        onChangeText={handleChange("gst_no")}
                                                        //   maxLength = {15}
                                                        placeholderTextColor="grey"
                                                        keyboardType="default" />
                                                    <TouchableOpacity onPress={() => {
                                                        if (values.gst_no.trim() != "") {
                                                            Services(Constants.API_BASE_URL + "/verify_gst", { "gst_no": values.gst_no }, "POST").then((response) => {
                                                                //console.log("GST Verificationnn",response);
                                                                if (response.status === 1) {
                                                                    alert(response.msg)
                                                                    setGSTVerified(true)
                                                                    setRequestGstValue("Verified")
                                                                    //setModalVisible(true)
                                                                } else {
                                                                    alert(response.msg)
                                                                }
                                                            })
                                                        } else {
                                                            if (Platform.OS === 'android') {
                                                                ToastAndroid.showWithGravity("Please Enter GST Number", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                            } else {
                                                                AlertIOS.alert("Please Enter GST Number");
                                                            }
                                                        }
                                                    }}>

                                                        <Text
                                                            style={{
                                                                alignItems: "flex-end",
                                                                textAlign: "right",
                                                                alignSelf: "flex-end",
                                                                alignContent: "flex-end",
                                                                justifyContent: "flex-end",
                                                                fontSize: 16,
                                                                margin: 0,
                                                                padding: 0,
                                                                color: "red",
                                                            }}
                                                        >{requestGstValue}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                <TouchableOpacity style={{ marginStart: 10, width: 30, height: 30 }}

                                                    onPress={() => {
                                                        Alert.alert(
                                                            "Usdfab Help Line!",
                                                            "Please contact our Helpline number 6364159599 , If you do not have GST no.",
                                                            [
                                                                {
                                                                    text: "CALL", onPress: () => {
                                                                        Linking.openURL(`tel:${6364159599}`);
                                                                    }
                                                                }
                                                            ],
                                                            { cancelable: true }
                                                        );
                                                    }}

                                                >
                                                    <Image style={{ height: 20, width: 20, tintColor: "red" }} source={Images.icons.ex} />
                                                </TouchableOpacity>

                                            </View>

                                            <Text style={styles.inputtitle}>Email ID</Text>

                                            <View style={styles.textInputView}>
                                                <TextInput
                                                    placeholder="Email ID"
                                                    style={styles.input}
                                                    value={values.email}
                                                    onChangeText={handleChange("email")}
                                                    placeholderTextColor="grey"
                                                    keyboardType="email-address" />
                                            </View>

                                            <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}>Create Password</Text>
                                            <View style={styles.passwordInputView}>
                                                <PasswordInputText
                                                    label={null}
                                                    placeholder="Create Password"
                                                    style={styles.input}
                                                    value={values.password}
                                                    onChangeText={handleChange("password")}
                                                    secureTextEntry={true}
                                                    placeholderTextColor="grey" />
                                            </View>

                                            <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}>Confirm Password</Text>
                                            <View style={styles.passwordInputView}>
                                                <PasswordInputText
                                                    label={null}
                                                    placeholder="Confirm Password"
                                                    style={styles.input}
                                                    value={values.confirm_password}
                                                    onChangeText={handleChange("confirm_password")}
                                                    secureTextEntry={true}
                                                    placeholderTextColor="grey" />
                                            </View>

                                            <Text style={styles.inputtitle}>Phone No</Text>

                                            <View style={styles.textInputFlexView}>
                                                <TextInput
                                                    placeholder="Phone No"
                                                    style={{
                                                        flex: 1,
                                                        direction: 'ltr',
                                                        alignItems: "flex-start",
                                                        alignContent: "flex-start",
                                                        fontSize: 16,
                                                        margin: 0,
                                                        padding: 0
                                                    }}
                                                    value={values.phone_no}
                                                    onChangeText={handleChange("phone_no")}
                                                    maxLength={10}
                                                    placeholderTextColor="grey"
                                                    editable={isMobileVerified1}
                                                    selectTextOnFocus={isMobileVerified1}
                                                    keyboardType="phone-pad" />
                                                <TouchableOpacity onPress={() => {
                                                    if (isMobileVerified == false) {
                                                        if (values.phone_no.trim() != "") {
                                                            Services(Constants.API_BASE_URL + "/send_otp", { "phone_no": values.phone_no }, "POST").then((response) => {
                                                                //console.log("Send OTPPPP",response);
                                                                if (response.status === 1) {
                                                                    setModalVisible(true);
                                                                } else {
                                                                    alert(response.msg)
                                                                }
                                                            })
                                                        } else {
                                                            if (Platform.OS === 'android') {
                                                                ToastAndroid.showWithGravity("Please Enter Phone Number", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                            } else {
                                                                AlertIOS.alert("Please Enter Phone Number");
                                                            }
                                                        }
                                                    }

                                                }}>

                                                    <Text
                                                        style={{
                                                            alignItems: "flex-end",
                                                            textAlign: "right",
                                                            alignSelf: "flex-end",
                                                            alignContent: "flex-end",
                                                            justifyContent: "flex-end",
                                                            fontSize: 16,
                                                            margin: 0,
                                                            padding: 0,
                                                            color: "red",
                                                        }}
                                                    >{requestOtpValue}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ marginTop: 10 }}>

                                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>General Terms & Conditions:</Text>

                                                <View style={{ padding: 10 }}>
                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Goods once sold are not exchanged. Exchange only in case of Size difference, manufacturing defect.
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Time Frame for exchange : within 15 days on Receipt of Goods.
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} (Proof - Consignment opening should be in the form of video Clipping until end – Ensure the consignment acceptance only when intact condition).
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Please do not accept any consignment pack in damaged condition, if accepted, company is not responsible and the entire risk lies on the buyer, even if goods are not as per the requirement.
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Payment Terms: Cash On Delivery to our Delivery channel partner only.
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Company is not responsible if cash is paid to the any agent or representative.
                                                    </Text>

                                                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: 'normal', color: 'black', textAlign: 'justify' }}>
                                                        {'\u2B24'} Any disputes - subject to Bangalore Jurisdiction only.
                                                    </Text>
                                                </View>

                                                <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                                    <CheckBox
                                                        value={isSelected}
                                                        onValueChange={setSelection}
                                                    />
                                                    <Text style={{ fontSize: 16, fontWeight: 'normal', color: 'black', marginTop: 0 }}>I Agree</Text>

                                                </View>

                                            </View>

                                            <View style={styles.button}>
                                                <LinearGradientButton title="SIGNUP" onPress={() => {
                                                    if (selectedOption != null) {
                                                        if (values.first_name.trim() != "") {
                                                            if (values.last_name.trim() != "") {
                                                                if (values.email.trim() != "") {
                                                                    if (values.password.trim() != "") {
                                                                        if (values.confirm_password.trim() != "") {
                                                                            if (values.password.trim() == values.confirm_password.trim()) {
                                                                                if (values.phone_no.trim() != "") {
                                                                                    if (isSelected === true) {
                                                                                        if (isGSTVerified === true) {
                                                                                            if (isMobileVerified === true) {
                                                                                                //navigation.push("Home")
                                                                                                Services(Constants.API_BASE_URL + "/register", values, "POST").then((response) => {
                                                                                                    //console.log("Registerrrr",response);
                                                                                                    if (response.status === 1) {
                                                                                                        AsyncStorage.setItem("@USER_ID", `${response.user_id}`);
                                                                                                        var body = {
                                                                                                            "user_id": `${response.user_id}`
                                                                                                        }
                                                                                                        Services(Constants.API_BASE_URL + "/get_user_details", body, "POST").then((response) => {
                                                                                                            if (response.status === 1) {
                                                                                                                setUser(response.data)
                                                                                                                navigation.push("Home")
                                                                                                                //navigation.pop();
                                                                                                            } else {
                                                                                                                alert(response.msg)
                                                                                                                console.log("3" + response.msg)
                                                                                                            }
                                                                                                        })

                                                                                                        if (Platform.OS === 'android') {
                                                                                                            ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                                        } else {
                                                                                                            AlertIOS.alert(response.msg);
                                                                                                        }

                                                                                                    } else {
                                                                                                        alert(response.msg)
                                                                                                        console.log("4" + response.msg)
                                                                                                    }
                                                                                                })
                                                                                            } else {
                                                                                                if (Platform.OS === 'android') {
                                                                                                    ToastAndroid.showWithGravity("Please Verify Your Mobile Number.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                                } else {
                                                                                                    AlertIOS.alert("Please Verify Your Mobile Number.");
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            if (Platform.OS === 'android') {
                                                                                                ToastAndroid.showWithGravity("Please Verify Your GST Number.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                            } else {
                                                                                                AlertIOS.alert("Please Verify Your GST Number.");
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        if (Platform.OS === 'android') {
                                                                                            ToastAndroid.showWithGravity("Accept Terms & Conditions.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                        } else {
                                                                                            AlertIOS.alert("Accept Terms & Conditions.");
                                                                                        }
                                                                                    }

                                                                                } else {
                                                                                    if (Platform.OS === 'android') {
                                                                                        ToastAndroid.showWithGravity("Please Enter Phone Number", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                    } else {
                                                                                        AlertIOS.alert("Please Enter Phone Number");
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if (Platform.OS === 'android') {
                                                                                    ToastAndroid.showWithGravity("Both Password should be same.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                                } else {
                                                                                    AlertIOS.alert("Both Password should be same.");
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (Platform.OS === 'android') {
                                                                                ToastAndroid.showWithGravity("Please Enter Confirm Password", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                            } else {
                                                                                AlertIOS.alert("Please Enter Confirm Password");
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (Platform.OS === 'android') {
                                                                            ToastAndroid.showWithGravity("Please Enter Password", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                        } else {
                                                                            AlertIOS.alert("Please Enter Password");
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (Platform.OS === 'android') {
                                                                        ToastAndroid.showWithGravity("Please Enter Email", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                    } else {
                                                                        AlertIOS.alert("Please Enter Email");
                                                                    }
                                                                }
                                                            } else {
                                                                if (Platform.OS === 'android') {
                                                                    ToastAndroid.showWithGravity("Please Enter Last Name", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                                } else {
                                                                    AlertIOS.alert("Please Enter Last Name");
                                                                }
                                                            }
                                                        } else {
                                                            if (Platform.OS === 'android') {
                                                                ToastAndroid.showWithGravity("Please Enter First Name", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                            } else {
                                                                AlertIOS.alert("Please Enter First Name");
                                                            }
                                                        }
                                                    } else {
                                                        if (Platform.OS === 'android') {
                                                            ToastAndroid.showWithGravity("Please Select User Type", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                        } else {
                                                            AlertIOS.alert("Please Select User Type");
                                                        }
                                                    }
                                                }} />
                                            </View>

                                            {/* <View style={styles.borderView} /> */}

                                            <View style={styles.bottomView}>
                                                <Text style={styles.txt}>Already have an account? </Text>

                                                <TouchableOpacity onPress={() => navigation.push("SignIn")}>
                                                    <Text style={styles.registerTxt}>Sign In</Text>
                                                </TouchableOpacity>

                                            </View>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={modalVisible}
                                            // onRequestClose={() => {
                                            //   setModalVisible(!modalVisible);
                                            // }}
                                            >
                                                <SafeAreaView style={stylesmodal.container}>
                                                    <View style={stylesmodal.mainContainer}>
                                                        <View style={stylesmodal.headerView}>
                                                            <View style={stylesmodal.iconView}>
                                                                <TouchableOpacity style={stylesmodal.iconStyle} onPress={() => setModalVisible(!modalVisible)}>
                                                                    <Image source={Images.icons.back} style={stylesmodal.iconStyle} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={stylesmodal.titleView}>
                                                                <Text style={stylesmodal.title}>Enter Verification Code</Text>
                                                            </View>
                                                        </View>
                                                        <Content>

                                                            <View style={stylesmodal.empty} />
                                                            <View style={{}}>
                                                                <Text style={stylesmodal.text1}>Enter OTP Code</Text>
                                                                <Text style={stylesmodal.text2}>We have send OTP on your number</Text>
                                                                <View style={stylesmodal.otpView}>
                                                                    <CodeField
                                                                        ref={ref}
                                                                        {...props}
                                                                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                                                        value={value}
                                                                        onChangeText={setValue}
                                                                        cellCount={CELL_COUNT}
                                                                        rootStyle={stylesmodal.codeFieldRoot}
                                                                        keyboardType="number-pad"
                                                                        textContentType="oneTimeCode"
                                                                        renderCell={({ index, symbol, isFocused }) => (
                                                                            <View
                                                                                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                                                                onLayout={getCellOnLayoutHandler(index)}
                                                                                key={index}
                                                                                style={[stylesmodal.cellRoot, isFocused && stylesmodal.focusCell]}>
                                                                                <Text style={stylesmodal.cellText}>
                                                                                    {symbol || (isFocused ? <Cursor /> : null)}
                                                                                </Text>
                                                                            </View>
                                                                        )}
                                                                    />
                                                                    <Text style={stylesmodal.text3}>Didn't you received any code?</Text>
                                                                    <TouchableOpacity style={stylesmodal.text4}
                                                                        onPress={() => {
                                                                            Services(Constants.API_BASE_URL + "send_otp", { "phone_no": values.phone_no }, "POST").then((response) => {
                                                                                //console.log("Send OTPPPP",response);
                                                                                if (response.status === 1) {
                                                                                    setModalVisible(true)
                                                                                } else {
                                                                                    alert(response.msg)
                                                                                }
                                                                            })
                                                                        }}>
                                                                        <Text style={stylesmodal.text4}>Resend a new code.</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={stylesmodal.button}>
                                                                    <LinearGradientButton title="VERIFY"
                                                                        onPress={() =>
                                                                            Services(Constants.API_BASE_URL + "verify_otp", { "phone_no": values.phone_no, "otp_num": value }, "POST").then((response) => {
                                                                                console.log("Verify OTPPPP", response);
                                                                                if (response.status === 1) {
                                                                                    alert(response.msg)
                                                                                    setValue('')
                                                                                    setMobileVerified(true)
                                                                                    setMobileVerified1(false)
                                                                                    setRequestOtpValue("Verified")
                                                                                    setModalVisible(!modalVisible)
                                                                                } else {
                                                                                    alert(response.msg)
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </View>
                                                            </View>

                                                        </Content>
                                                    </View>
                                                </SafeAreaView>
                                            </Modal>
                                        </View>

                                    </ScrollView>

                                )}

                            </Formik>
                        </ScrollView>
                    </View>


                ) : null}

            </View>
        </SafeAreaView>

    )
}
