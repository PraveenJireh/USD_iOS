import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Images } from '@themes'
export default function HeaderAuth() {
    return (
        <View style={styles.container}>
            {/* <Image source={Images.fullLogo} style={{ height: 818 / 4, width: 776 / 4 }} /> */}
            <Image source={Images.logo} style={styles.logo} />
            {/* <Image source={Images.titleLogo} style={styles.titleLogo} /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: { alignItems: 'center', backgroundColor: "#eef1fc", paddingBottom: 20 },
    logo: { height: 200, width: 200, marginTop: 10 },
    titleLogo: { height: 175 / 3, width: 776 / 3, marginTop: 10 },
});