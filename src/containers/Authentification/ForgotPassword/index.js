import React,{useState,useEffect} from 'react'
import { View, Text, Keyboard, Button, ScrollView,ToastAndroid, Image, ImageBackground, TouchableOpacity, TextInput } from 'react-native'
import { Container, Content, Tab, Tabs, } from 'native-base';
import { Formik, } from 'formik';
import * as Yup from 'yup';
import { Images } from '@themes';
import styles from './styles';
import { HeaderAuth, OtpModal } from '@components';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradientButton, } from "@common";
import Services from "@Services";
import { BackHandler } from 'react-native';
import Constants from '../../../themes/Constants';

export default function ForgotPassword() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const isFocused = useIsFocused();

    useEffect(() => {
   
        const backAction = () => {
            navigation.pop()
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
        

      }, [isFocused])

    const onSubmit = () => {

    };
    return (
        <ImageBackground source={Images.bg} style={styles.bg}>
            <View style={styles.container}>
                <Content showsVerticalScrollIndicator={false} contentContainerStyle={{}}>

                    <HeaderAuth />
                    <View style={{ marginHorizontal: 35, marginTop: 35,flex:1,justifyContent:"center" }}>
                        <Text style={styles.headerTxt}>Forgot Password?</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="Email ID"
                                style={styles.input}
                                placeholderTextColor="grey"
                                onChangeText={(email) => setEmail(email)}
                                keyboardType="email-address" />
                        </View>
                        <View style={styles.button}>
                            <LinearGradientButton title="SUBMIT" onPress={() => {
                                if(email !== ""){
                                    Services(Constants.API_BASE_URL + "/forgot_password",{"email":email} ,"POST").then((response) => {
                                        console.log("Updateeeee",response);
                                        if(response.status === 1){
                                            alert(response.msg)
                                            //getData();
                                        }else{
                                            alert(response.msg)
                                        }
                                    })
                                }else{
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.showWithGravity("Please Enter Registered Mail", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                    } else {
                                        AlertIOS.alert("Please Enter Registered Mail");
                                    }
                                }
                                
                            }} />
                        </View>
                    </View>
                </Content>

            </View>
        </ ImageBackground>
    )
}
