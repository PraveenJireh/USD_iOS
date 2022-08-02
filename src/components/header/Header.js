import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Images, Colors } from "@themes";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function Header({ title }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.iconView}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Image style={styles.icon} source={Images.icons.back} />
                </TouchableOpacity>
            </View>
            <View style={styles.middleView}>
                <Text style={styles.title} >{title ? title : ""}</Text>
            </View>

            <View style={styles.iconView}>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row", backgroundColor: "#eef1fc" },
    title: { fontWeight: 'bold', color: "black", fontSize: 16 },
    iconView: { flex: 0.1, justifyContent: 'center', alignItems: 'center', },
    middleView: { flex: 0.8, justifyContent: 'center', alignItems: 'center', },
    icon: { height: 35, width: 35, tintColor: Colors.black }
});