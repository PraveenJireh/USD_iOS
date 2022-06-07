import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    header: { height: 50 },
    content: { flex: 1, },
    row: {
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        elevation: 0,
        backgroundColor: "white",
        padding: 5,
        marginBottom: 0,
        marginTop:0,
        marginHorizontal: 0,
        borderRadius: 5,

    },
    rowContent: { flexDirection: 'row', justifyContent: "space-between", },
    title: { fontWeight: 'bold' },
    time: { color: "grey", fontSize: 12, },
    pinIcon: { height: 20, width: 20,tintColor:"red" },
    button: { marginTop: 15,marginStart:10,marginEnd:10,backgroundColor:"#fe5c45",borderRadius:25 },
    desc: { color: "dimgrey", fontSize: 12, marginTop: 5 }
});