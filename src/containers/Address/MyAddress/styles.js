import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#fbfaf9"
    },
    header: { height: 64 },
    content: { flex: 1, },
    row: {
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "lightgrey",
        elevation: 5,
        backgroundColor: "white",
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        borderRadius: 5,

    },
    rowView: { flexDirection: 'row', justifyContent: "space-between", },
    title: { fontWeight: 'bold' },
    iconsView: { flexDirection: 'row', },
    iconBtn: {
        height: 28, width: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 9,
        borderWidth: 0, borderColor: Colors.e4e4e4,
    },
    icon: { height: 20, width: 20 },
    subTxt: { color: "grey", fontSize: 14, },
    address: { color: "dimgrey", fontSize: 12, marginTop: 5 }
});