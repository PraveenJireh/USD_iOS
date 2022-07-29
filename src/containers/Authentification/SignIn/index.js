import React, { useState, useEffect } from 'react'
import {
    View, Text, Keyboard, AppRegistry, Alert, TouchableOpacity, ToastAndroid,
    Platform, AlertIOS, StyleSheet, TextInput
} from 'react-native'
import { Formik, } from 'formik';
import * as Yup from 'yup';
import { Colors, Images } from '@themes';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { LinearGradientButton, Picker } from "@common";
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from '../../../themes/Constants';
import { set } from 'react-native-reanimated';
import { BackHandler } from 'react-native';
import { UserContext } from '@context/user-context';
import { NotificationContext } from '@context/notification-context';
import { CartContext } from '@context/cart-context';
import PasswordInputText from 'react-native-hide-show-password-input';
import messaging from '@react-native-firebase/messaging';

//class SignIn extends React.Component {
export default function SignIn() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = React.useContext(UserContext);
    const { cartCount, setCartCount } = React.useContext(CartContext);
    const isFocused = useIsFocused();
    var userId;
    const { notification, setNotification } = React.useContext(NotificationContext);
    const route = useRoute();
    const [fcmTokenValue, setFcmToken] = useState('');

    const checkToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            setFcmToken(fcmToken)
            //console.log(fcmToken);
        }
    }

    useEffect(() => {
        let componentMounted = true;

        if (componentMounted) {
            getData()
            checkToken();
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


    }, [isFocused])

    const backAction = () => {

        if (!navigation.isFocused()) {
            return false;
        }
        AsyncStorage.setItem("@NAVIGATION_STATUS", "FALSE");
        navigation.pop();
        return true;
    };

    const getData = async () => {
        try {
            userId = await AsyncStorage.getItem('@USER_ID')
            const user_id = await AsyncStorage.getItem('@USER_ID')
            if (user !== null) {
                navigation.navigate("Home")
            }
        } catch (e) {
            // error reading value
        }
    }

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                fcm_token: fcmTokenValue
            }}
            onSubmit={values => console.log(values)}
        >

            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={styles.logincontainer}>
                    <Text style={styles.welcmeTxt}>Login</Text>

                    <Text style={styles.inputtitle}>EMail ID or Phone No</Text>

                    <View style={styles.textInputView}>
                        <TextInput
                            placeholder="EMail ID or Phone No"
                            style={styles.input}
                            value={values.email}
                            placeholderTextColor="grey"
                            onChangeText={handleChange("email")}
                            keyboardType="email-address" />
                    </View>
                    <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}>Password</Text>
                    <View style={styles.passwordInputView}>
                        <PasswordInputText
                            label={null}
                            placeholder="Password"
                            style={styles.input}
                            secureTextEntry={true}
                            value={values.password}
                            onChangeText={handleChange("password")}
                            placeholderTextColor="grey" />
                    </View>

                    <TouchableOpacity onPress={() => navigation.push("ForgotPassword")}>
                        <Text style={styles.forgotTxt}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.button}>
                        <LinearGradientButton title="LOGIN"
                            onPress={() => {
                                values.fcm_token = fcmTokenValue;
                                console.log(values)

                                if (values.email.trim() != "") {
                                    if (values.password.trim() != "") {
                                        //navigation.push("Home")
                                        setLoading(true);
                                        Services(Constants.API_BASE_URL + "/login", values, "POST").then((response) => {
                                            console.log("Loginnnnn", response);
                                            setLoading(false);
                                            if (response.status === 1) {
                                                AsyncStorage.setItem("@USER_ID", `${response.user_id}`);

                                                var body = {
                                                    "user_id": `${response.user_id}`
                                                }
                                                Services(Constants.API_BASE_URL + "/get_user_details", body, "POST").then((response) => {
                                                    if (response.status === 1) {
                                                        setUser(response.data)
                                                        //navigation.navigate("Home")

                                                        Services(Constants.API_BASE_URL + "/get_all_unread_notification", { "user_id": `${response.user_id}` }, "POST")
                                                            .then((notificationresponse) => {
                                                                console.log(notificationresponse.data);
                                                                if (notificationresponse.status === 1) {
                                                                    setNotification(notificationresponse.notificationDetails);
                                                                    setLoading(false);
                                                                    //navigation.pop();
                                                                } else {
                                                                    setNotification(null);
                                                                    setLoading(false);
                                                                    //navigation.pop();
                                                                }
                                                            })
                                                        //navigation.goBack(null);
                                                    } else {
                                                        alert(response.msg)
                                                    }
                                                })

                                                Services(Constants.API_BASE_URL + "view_cart/" + `${response.user_id}`, "GET")
                                                    .then((response) => {
                                                        //console.log(Constants.API_BASE_URL + "view_cart/"+`${response.user_id}`)
                                                        if (response.status === 1) {
                                                            setCartCount(response.data)
                                                        } else {
                                                            setCartCount(null);
                                                        }
                                                    })

                                                if (Platform.OS === 'android') {
                                                    ToastAndroid.showWithGravity(response.msg, ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                } else {
                                                    AlertIOS.alert(response.msg);
                                                }
                                                console.log("Process Endddd")
                                                navigation.pop();
                                            } else {
                                                alert(response.msg)
                                            }
                                            //navigation.navigate("Home");

                                        })
                                    } else {
                                        if (Platform.OS === 'android') {
                                            ToastAndroid.showWithGravity("Please Enter Password", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                        } else {
                                            AlertIOS.alert("Please Enter Password");
                                        }
                                    }
                                } else {
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.showWithGravity("Please Enter Username", ToastAndroid.SHORT, ToastAndroid.CENTER)
                                    } else {
                                        AlertIOS.alert("Please Enter Username");
                                    }
                                }
                            }} />
                    </View>

                    {/* <View style={styles.borderView} /> */}

                    <View style={styles.bottomView}>
                        <Text style={styles.txt}>Don't have an account? </Text>

                        <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                            <Text style={styles.registerTxt}>Register</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}

        </Formik>
    );
}
