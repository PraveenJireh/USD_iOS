import React,{useState,useEffect,useRef} from 'react'
import { View,BackHandler,ActivityIndicator,TouchableOpacity,Image,Text } from 'react-native'
import { Header } from "@components";
import { Search } from "@common";
import { Constants,Images } from "@themes";
import styles from './styles';
import { useNavigation, useIsFocused} from '@react-navigation/native';
import Services from "@Services";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalesTeamLogin() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [orderData, setOrderData] = useState([0]);
    const [userId, setUserId] = useState(0)
    const webviewRef = useRef(null);
    const [currentUrl, setCurrentUrl] = useState('');
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    //console.log(data);
    useEffect(() => {
        getData()


        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, [isFocused,canGoBack])

      
      const backAction = () => {
        if (canGoBack === true) {
            webviewRef.current.goBack();
        }else{

            if (!navigation.isFocused()) {
                return false;
              }

            navigation.pop();
        } 

        return true;
      };

      const backButtonHandler = () => {

        if (canGoBack === true) {
          webviewRef.current.goBack();
            //alert(canGoBack)
        }else{
            //alert(canGoBack)
            navigation.pop();
        }
      };


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
            <View style={{flexDirection: "row", backgroundColor: '#eef1fc',height:50,paddingHorizontal:15}}>
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
                         <Text style={{fontWeight: 'bold',alignSelf:'center', color: "black", fontSize: 16}}>Sales Team Login</Text>
                    </View>

            </View>

            <WebView 
            injectedJavaScript={`(function() {
                const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
              })();`}
            source={{ uri: 'https://usdfab.com/webview-agent-login/'}} 
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
              ref={webviewRef}
              onNavigationStateChange={navState => {
                setCanGoBack(navState.canGoBack);
                setCanGoForward(navState.canGoForward);
                setCurrentUrl(navState.url);
            }}
            />
            
        </View>
    )
}
