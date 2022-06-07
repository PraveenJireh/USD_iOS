import * as React from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, SignIn,SignUp, Notifications,ProductDetails,RecommendedProducts,CustomerService,HotSale,FAQ,LegalPolicy,FilterProducts,OrderDetails,ListScreen,Privacy,Wishlist, MyAddress, AddAddress, Profile, ForgotPassword, MyOrders,ListCategories,Filter,MyCart,Checkout,FeaturedProductsList,BestSellerProductsList,NewArrivalProductsList,SellerLogin,SalesTeamLogin } from '@containers'
import { SideBar } from "@components";
import { UserContext } from '@context/user-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Value } from 'react-native-reanimated';
import { Constants } from "@themes";
import Services from "@Services";
import linking from "../linking";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function RouterStack() {
    return (
        <Stack.Navigator initialRouteName="Home" headerMode={"none"} screenOptions={{ gestureEnabled: false }} >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="ListScreen" component={ListScreen} />
            {/* <Stack.Screen name="ListScreen" component={ListScreen} /> */}
            <Stack.Screen name="MyAddress" component={MyAddress} />
            {/* <Stack.Screen name="ListCategory" component={ListCategory} /> */}
            <Stack.Screen name="AddAddress" component={AddAddress} />
            <Stack.Screen name="Profile" component={Profile} />

            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="MyOrders" component={MyOrders} />
            <Stack.Screen name="ListCategories" component={ListCategories} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="Filter" component={Filter} />
            <Stack.Screen name="MyCart" component={MyCart} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Privacy" component={Privacy} />
            <Stack.Screen name="Wishlist" component={Wishlist} />

            <Stack.Screen name="FeaturedProductsList" component={FeaturedProductsList} />
            <Stack.Screen name="BestSellerProductsList" component={BestSellerProductsList} />
            <Stack.Screen name="NewArrivalProductsList" component={NewArrivalProductsList} />

            <Stack.Screen name="FilterProducts" component={FilterProducts} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />

            <Stack.Screen name="SellerLogin" component={SellerLogin} />
            <Stack.Screen name="SalesTeamLogin" component={SalesTeamLogin} />

            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="LegalPolicy" component={LegalPolicy} />
            <Stack.Screen name="CustomerService" component={CustomerService} />

            <Stack.Screen name="HotSale" component={HotSale} />
            <Stack.Screen name="RecommendedProducts" component={RecommendedProducts} />
        </Stack.Navigator>
    );
}
function DrawerStack() {
    return (
        <Drawer.Navigator
            initialRouteName="RouterStack"
            edgeWidth={0}
            drawerContent={(props) => <SideBar {...props} />}
        >
            <Drawer.Screen name="RouterStack" component={RouterStack}/>
        </Drawer.Navigator>
    );
}

function Navigation() {
    const {user , setUser} = React.useContext(UserContext);

    React.useEffect( () => {
        AsyncStorage.getItem("@USER_ID").then((value) => {
                if(value){
                    fetchProfile(value)
                }
                // else{
                //     alert(value)
                // }
        }).catch((err) => {

        });
    },[]);

    const fetchProfile = (id) =>{

        var body = {
            "user_id":id
        }
        Services(Constants.API_BASE_URL + "/get_user_details", body,"POST").then((response) => {
                if(response.status === 1){
                    setUser(response.data)
                    //console.log(response.data)
                }else{
                    alert(response.msg)
                }
            })
    }

    return (
        <NavigationContainer>
                <DrawerStack />            
        </NavigationContainer>
    );
}

export default Navigation;
