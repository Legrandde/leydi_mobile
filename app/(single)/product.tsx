import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Product(){

    return(
        <SafeAreaView style={{flex:1, backgroundColor: "white"}}>
            <Image style={{width: "100%", height:400}} source={require('../../assets/images/banner1.jpg')} />
            <View style={{padding:20}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", backgroundColor: "yellow"}}>
                    <Text style={{fontFamily:"inter", fontWeight:"bold", fontSize: 24}}>Tomate organique</Text>
                    <View style={{flexDirection:"row", justifyContent: "center", alignItems: "center"}}>
                        <Feather name="star" size={24} color="orange" />
                        <Text>4.5</Text>
                    </View>
                </View>
                <Text>Shop, Adama Soumare</Text>
                <View>
                    <View>
                        <FontAwesome5 name="cloud-meatball" size={24} color="black" />
                        <Text>Vegetal</Text>
                    </View>
                </View>
                <View>
                    <Text>Detailles</Text>
                    <Text>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione sint officiis praesentium blanditiis ipsam ducimus maxime adipisci placeat necessitatibus iusto laudantium ut architecto tempora cum asperiores nostrum accusantium veniam, iure, odit consequuntur facere distinctio delectus pariatur reprehenderit. Impedit minus amet, ipsa rerum quidem perspiciatis veniam, iure error animi, placeat aliquid.</Text>
                </View>
                <View>
                    <View>
                        <View>
                            <Text>Prix</Text>
                            <View>
                                <Text>4440 GNF</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text>Ajouter au panier</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}