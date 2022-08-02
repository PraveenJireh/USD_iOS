import { StyleSheet } from 'react-native';
import { Colors, Images } from '@themes';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center"
    },
    bg: { height: "100%", width: "100%", },
    headerTxt: { marginVertical: 15, fontSize: 20, fontWeight: "bold", letterSpacing: 1 },
    inputView: {
        height: 50,
        backgroundColor: '#ffffff',
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        elevation: 5,
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    input: {
        fontSize: 16, margin: 0,
        padding: 0
    },
    button: { marginTop: 40 },
})
export default styles
