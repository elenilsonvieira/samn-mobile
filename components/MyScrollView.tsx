import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated, {interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset} from "react-native-reanimated";

import { ThemedView } from "./ThemedView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: {dark:string; light:string}
}>;

export default function MyScrollView({
    children, headerImage, headerBackgroundColor,
}: Props){
    const colorScheme = useColorScheme() ?? 'light';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffSet = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return{
            transform: [
                {
                    translateY: interpolate(
                        scrollOffSet.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT/ 2, 0, HEADER_HEIGHT * 0.75]
                    )
                },
                {
                    scale: interpolate(scrollOffSet.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1])
                }
            ]
        };
    });
    return (
        <ThemedView style={styles.container}>
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                {children}
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#151718',
    },
    header:{
        height:250,
        overflow:'hidden',
    },
    content:{
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden'
    },
});