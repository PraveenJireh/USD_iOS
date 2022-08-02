import React,{useState,useEffect} from 'react'
import { View,BackHandler } from 'react-native'
import { Header } from "@components";
import {Constants } from "@themes";
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from 'react-native-webview';

export default function LegalPolicy() {
    const navigation = useNavigation();

    const [data, setData] = useState(null);
    const [orderData, setOrderData] = useState([0]);
    const [userId, setUserId] = useState(0)
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
            navigation.pop()
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
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            getUserData(user_id);
            setUserId(user_id)
          }
        } catch(e) {
          // error reading value
        }
      }
      
      function getUserData(user_id) {
        if(user_id !== null) {
          Services(Constants.API_BASE_URL + "/get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              //console.log("Get User Detailsssss",response.data);
              if(response.status === 1){
                  setData(response.data)
              }else{
                  alert(response.msg)
              }
          })
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Header title="Legal Policy and Terms of Use" />
            </View>

            <WebView 
            injectedJavaScript={`(function() {
                const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
              })();`}
            source={{ uri: 'https://usdfab.com/legal-policies-mobile'}} />
            
        </View>
    )
}
