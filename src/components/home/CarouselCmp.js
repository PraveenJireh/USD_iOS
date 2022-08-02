import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet,TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//const { width } = Dimensions.get("window");
const { width: viewportWidth } = Dimensions.get('window');

import FastImage from 'react-native-fast-image';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';

export default function CarouselCmp({ data }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [fcmTokenValue,setFcmToken] = useState('');
    const navigation = useNavigation();

    const productNavigation = async (item) => {
        const fcmToken = await messaging().getToken();
            if (fcmToken) {
                setFcmToken(fcmToken)
                navigation.navigate("ProductDetails", {
                productId: item.link_id,
                productURL:item.link,
                orderRating:"",
                fcmTokenValue:fcmToken
                });
            }
        // navigation.navigate("ProductDetails", {
        //   productId: item.id,
        //   productURL:item.base_url,
        //   orderRating:"",
        //   fcmTokenValue:fcmTokenValue
        // });
      }

    function _renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <View style={{}}>
                {item.link == "" ? (
                    <FastImage 
                        source={{ uri: item.image }} 
                        style={styles.image}
                        resizeMode="stretch"
                        />
                ):(
                    <TouchableOpacity onPress={productNavigation.bind(this, item)}>
                        <FastImage 
                            source={{ uri: item.image }} 
                            style={styles.image}
                            resizeMode="stretch"
                            />
                    </TouchableOpacity>
                )}
                
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Carousel
                //   ref={c => this._slider1Ref = c}
                data={data}
                renderItem={_renderItemWithParallax}
                sliderWidth={viewportWidth}
                itemWidth={viewportWidth / 1.11}
                hasParallaxImages={true}
                //   firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                // inactiveSlideShift={20}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                loop={true}
                loopClonesPerSide={2}
                autoplay={true}
                autoplayDelay={2000}
                autoplayInterval={3000}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            
        </View>
    )
}
const styles = StyleSheet.create({

    slider: {
        // marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        // paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 0
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        // marginHorizontal: 8
    },
    container: { height: 250, },
    image: { height: 250, width: "100%",borderRadius:0 }
});