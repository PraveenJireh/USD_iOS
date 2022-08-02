import { StyleSheet } from 'react-native';
import { Colors, Images } from '@themes';
const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 35, fontWeight: "bold"
    },
    inputView: {
        height: 50,
        backgroundColor: '#ffffff',
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        elevation: 5,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    textInputView: {
        //backgroundColor: '#ffffff',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 1,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingLeft: 0,
        paddingBottom:10
    },
    passwordInputView: {
        //backgroundColor: '#ffffff',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 0,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingLeft: 0,
    },
    txt: {
        textAlign: "center",
        color: Colors.black
    },
    registerTxt: {
        // marginBottom: 20,
        textDecorationLine: "underline",
        textAlign: "center",
        color: Colors.theme
    },
    forgotTxt: {
        color: Colors.black,
        marginTop: 40,
        marginBottom: 0,
        textAlign: 'right',
        justifyContent:'flex-end'
    },
    container: { flex: 1, marginHorizontal: 35, marginTop: 35 },
    logincontainer: { flex: 1, marginHorizontal: 35, marginTop: 35,justifyContent:'center' },
    welcmeTxt: { marginVertical: 5, fontSize: 35, fontWeight: "bold" },
    inputtitle: { marginVertical: 15, fontSize: 16, fontWeight: "bold" },
    content: { marginTop: 10 },
    button: { marginTop: 20,backgroundColor:"#fe5c45",borderRadius:25 },
    borderView: { height: 1, borderBottomWidth: 1, borderColor: "lightgrey", marginVertical: 20 },
    bottomView: { flexDirection: "row", justifyContent: 'center', marginBottom: 20,marginTop:20 },
    input: {
        fontSize: 16, margin: 0,
        padding: 0
    }
})
export default styles