import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Dimensions, SafeAreaView, Platform } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Content } from "native-base";
import styles from "./styles";
import { Images, Colors } from '@themes';
import { LinearGradientButton } from "@common";
const CELL_COUNT = 4;
export default function OtpModal({ phone }) {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
     console.log("Mobile Number", phone)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <View style={styles.iconView}>
                        <Image source={Images.icons.back} style={styles.iconStyle} />
                    </View>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>Enter Verification Code</Text>
                    </View>
                </View>
                <Content>

                    <View style={styles.empty} />
                    <View style={{}}>
                        <Text style={styles.text1}>Enter OTP Code</Text>
                        <Text style={styles.text2}>We have send OTP on your number</Text>
                        <View style={styles.otpView}>
                            <CodeField
                                ref={ref}
                                {...props}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <View
                                        // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                        onLayout={getCellOnLayoutHandler(index)}
                                        key={index}
                                        style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                        <Text style={styles.cellText}>
                                            {symbol || (isFocused ? <Cursor /> : null)}
                                        </Text>
                                    </View>
                                )}
                            />
                            <Text style={styles.text3}>Didn't you received any code?</Text>
                            <Text style={styles.text4}>Resend a new code.</Text>
                        </View>
                        <View style={styles.button}>
                            <LinearGradientButton title="VERIFY" onPress={alert(phone)} />
                        </View>
                    </View>

                </Content>
            </View>
        </SafeAreaView>
    )
}
