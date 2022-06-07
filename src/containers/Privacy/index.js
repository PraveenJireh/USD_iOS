import React from 'react'
import { View, Text,BackHandler, FlatList } from 'react-native'
import { Header } from "@components";
import { Constants } from "@themes";
import styles from './styles';
import { WebView } from 'react-native-webview';
export default function Privacy() {
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Privacy Policy" />
            </View>
            <View style={styles.content}>
            <WebView source={{ uri: 'https://usdfab.com/privacy-policy-mobile' }} />
            </View>
        </View>
    )
}
