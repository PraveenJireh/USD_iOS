import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Images, Colors } from "@themes";
import { useNavigation } from '@react-navigation/native';
export default function HeaderProductList() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.leftIconView}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Image style={styles.menuIcon} source={Images.icons.back} />
                </TouchableOpacity>
            </View>
            <View style={styles.middleView}>
                
            </View>

            <View style={styles.rightIconView}>
                <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
                    <Image style={styles.cartIcon} source={Images.icons.cart} />
                </TouchableOpacity>
                {/* <Image style={styles.notificationIcon} source={Images.icons.notification} /> */}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row", backgroundColor: '#eef1fc', paddingHorizontal: 15 },
    leftIconView: { flex: 0.15, justifyContent: 'center', },
    rightIconView: { flex: 0.15, flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end" },
    menuIcon: { height: 35, width: 35, tintColor: Colors.black },
    cartIcon: { height: 25, width: 25, tintColor: Colors.black },
    notificationIcon: { height: 25, width: 25, tintColor: Colors.white, },
    middleView: { flex: 0.7, justifyContent: 'center', alignItems: 'center', },
    logo: { height: 175 / 5, width: 776 / 5, }
});
