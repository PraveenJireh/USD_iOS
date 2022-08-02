import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
const { width } = Dimensions.get("window")
export default function CarouselProductImages({ data }) {
    const [activeSlide, setActiveSlide] = useState(0)
    function _renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <View style={{}}>
                <Image source={{ uri: item.image_name }} style={styles.image} />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Carousel
                //   ref={c => this._slider1Ref = c}
                data={data}
                renderItem={_renderItemWithParallax}
                sliderWidth={width}
                itemWidth={width / 1.11}
                hasParallaxImages={true}
                //   firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={0.0}
                inactiveSlideOpacity={0.7}
                // inactiveSlideShift={20}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                loop={false}
                loopClonesPerSide={2}
                autoplay={false}
                // autoplayDelay={500}
                // autoplayInterval={3000}
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
        paddingVertical: 8
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        // marginHorizontal: 8
    },
    container: { height: 200, },
    image: { height: 200,borderRadius:10 }
});