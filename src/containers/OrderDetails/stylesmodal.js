import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@themes';

const { height, width } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        borderRadius:10
    },
    mainContainer: { backgroundColor: "white" },
    mainContainer1: { backgroundColor: "white",padding:10 },
    headerView: { height: 64, flexDirection: 'row', alignItems: 'center', },
    iconView: { alignItems: 'center',marginEnd:10 },
    titleView: { flex: 1,justifyContent:'center',alignItems:'center' },
    iconStyle: { height: 40, width: 40, tintColor: '#cccccc' },
    title: { color: "black", fontSize: 18,justifyContent:'center', fontWeight: "bold" },
    empty: { marginTop: height / 2.8 },
    root: { padding: 20, minHeight: 300 },

    codeFieldRoot: {
        marginVertical: 20,
        width: 280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellRoot: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 25
    },
    cellText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: Colors.theme,
        borderWidth: 2,
    },
    text1: { color: "white", fontWeight: "bold", fontSize: 20, textAlign: 'center' },
    text2: { color: "white", fontWeight: "bold", fontSize: 16, marginTop: 5, textAlign: 'center' },
    otpView: { width: '100%', backgroundColor: "white", borderRadius: 10, padding: 20, marginTop: 50 },
    otpStyle: { width: '100%', height: 70, paddingHorizontal: 30 },
    text3: { color: "grey", fontWeight: "normal", fontSize: 16, marginTop: 5, textAlign: 'center' },
    text4: { color: Colors.theme, fontWeight: "normal", fontSize: 16, marginTop: 5, textAlign: 'center' },
    button: { margin: 30, }
});