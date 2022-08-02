import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
export default function LinearGradientButton({ title, onPress }) {
    return (
        <TouchableOpacity onPress={onPress ? onPress : console.log("ok")}>
            <LinearGradient colors={['#fe5c45', "#fe5c45"]}
                // start={{ x: 0.0, y: 0.25 }}
                // end={{ x: 0.5, y: 1.0 }}
                // locations={[0, 0.5, 0.6]} 

                style={styles.linearGradient}>
                <Text style={styles.buttonText}>
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}
var styles = StyleSheet.create({
    linearGradient: {
        // flex: 1,
        // paddingLeft: 15,
        // paddingRight: 15,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        fontWeight: "bold",
        color: 'white',
        backgroundColor: 'transparent',
    },
});