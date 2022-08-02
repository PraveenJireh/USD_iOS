import React,{useState,useEffect} from 'react'
import { View,BackHandler,ScrollView,ActivityIndicator,Alert,Text,TextInput,TouchableOpacity,ToastAndroid } from 'react-native'
import { Header } from "@components";
import {Constants } from "@themes";
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from 'react-native-paper';
import { tr } from 'date-fns/locale';

export default function CustomerService() {
    const navigation = useNavigation();

    const [data, setData] = useState(null);
    const [orderData, setOrderData] = useState([0]);
    const [userId, setUserId] = useState(0);
    const [communicationValue, setCommunicationValue] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading,setLoading] = useState(true)

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
        setLoading(true)
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
            <Header title="Customer Service" />
            </View>

            {/* {loading && (

              <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FAFAFA'}}>

                <ActivityIndicator
                    style={{ 
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        flex:1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:'transparent',
                    }}
                    color="black"
                    size="large"
                  />
                  </View>
            
            )} */}
           <ScrollView showsVerticalScrollIndicator={null}>
             <View style={{padding:10}}>

               <Text style = {{fontSize:20,color:'black',fontWeight:'bold'}}>Contact Us</Text>

               <Text style = {{fontSize:16,color:'grey',marginTop:8}}>
               Feel like contacting us? Submit your queries here and we will get back to you as soon as possible.
               </Text>

               <Text style = {{fontSize:18,color:'black',fontWeight:'bold',marginTop:8}}>Send us a Message</Text>

                  <TextInput
                        style={{height: 45,
                            margin: 1,
                            flex:1,
                            borderColor:'#cccccc',
                            borderRadius:5,
                            paddingStart:8,
                            marginTop:10,
                            fontSize:16,
                            borderWidth: 1,}}
                        placeholder="Name"
                        value = {name}
                        onChangeText={(name) => setName(name)}
                        keyboardType='default'
                    />

                  <TextInput
                        style={{height: 45,
                            margin: 1,
                            flex:1,
                            borderColor:'#cccccc',
                            borderRadius:5,
                            paddingStart:8,
                            marginTop:10,
                            fontSize:16,
                            borderWidth: 1,}}
                        placeholder="Email"
                        value = {email}
                        onChangeText={(email) => setEmail(email)}
                        keyboardType='email-address'
                    />

                  {/* <TextInput
                        style={{height: 45,
                            margin: 1,
                            flex:1,
                            borderColor:'#cccccc',
                            borderRadius:5,
                            paddingStart:8,
                            marginTop:10,
                            fontSize:16,
                            borderWidth: 1,}}
                        placeholder="Phone"
                        onChangeText={(phone) => setPhone(phone)}
                        keyboardType='phone-pad'
                    />

              <Text style = {{fontSize:16,color:'black',fontWeight:'bold',marginTop:10}}>Preffered method of communication</Text>

                    <View style={{marginTop:10}}>
                      <RadioButton.Group 
                      onValueChange={newValue => setCommunicationValue(newValue)} value={communicationValue}>
                        <View style={{flex:1,flexDirection:'row'}}>
                          <View style={{flex:1}}>
                          <RadioButton.Item label="Email" communicationValue="email" style={{height:35}}/>
                          </View>

                          <View style={{flex:1}}>
                          <RadioButton.Item label="Phone" communicationValue="phone" style={{height:35,marginTop:0}}/>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View> */}

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
                        placeholder="Message"
                        multiline={true}
                        value = {message}
                        onChangeText={(message) => setMessage(message)}
                        keyboardType='default'
                    />

                    <TouchableOpacity 
                            style={{height:50,flex:1,marginTop:15,backgroundColor:'#fe5c45',borderRadius:25
                            ,justifyContent:'center'}}
                                onPress={() => {

                                  if(name !== ''){
                                    if(email !== ''){
                                      if(message !== ''){

                                        const frmdetails = {
                                          'name': name,
                                          'email': email,
                                          "message": message
                                      }
                                      console.log(frmdetails);
                          
                                      Services(Constants.API_BASE_URL + "/contact_us",frmdetails ,"POST").then((response) => {
                                          console.log("Updateeeee",response);
                                          if(response.status === 1){
                                              Alert.alert("Success",response.msg)
                                              setName('');
                                              setEmail('');
                                              setMessage('');
                                          }else{
                                            Alert.alert("Failed",response.msg)
                                          }
                                      })
                                      }else{
                                        if (Platform.OS === 'android') {
                                          ToastAndroid.showWithGravity("Please Enter Mail", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                      } else {
                                          AlertIOS.alert("Please Enter Mail");
                                      }
                                      }
                                    }else{
                                      if (Platform.OS === 'android') {
                                        ToastAndroid.showWithGravity("Please Enter Mail", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                    } else {
                                        AlertIOS.alert("Please Enter Mail");
                                    }
                                    }
                                  }else{
                                    if (Platform.OS === 'android') {
                                      ToastAndroid.showWithGravity("Please Enter Name", ToastAndroid.SHORT,ToastAndroid.CENTER)
                                  } else {
                                      AlertIOS.alert("Please Enter Name");
                                  }
                                  }

                                }}>
                                  <Text style={{color:'white',fontWeight:'bold',alignSelf:'center',fontSize:16}}>
                                    {"   Submit    "}
                                </Text>
                                </TouchableOpacity>

             </View>
           </ScrollView>
            
        </View>
    )
}
