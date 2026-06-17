import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Text,
  View,
} from "react-native";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { CARD_WIDTH, SPACING } from "../common/MapVariables";
import { tripBackground } from "../types/Trip";

export interface PlaceCardListProps {
  places: PlaceToVisit[];
  onIndexChange: (index: number) => void;
}

// ─── Shared card (React Native View renders as <div> on web) ──
const PlaceCard = ({ item }: { item: PlaceToVisit }) => (
  <View
    style={{
      width: CARD_WIDTH,
      marginRight: SPACING,
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
      pointerEvents: "auto",
    }}
  >
    <Text style={{ fontWeight: "600", fontSize: 15 }}>
      {item?.name ?? "Unknown place"}
    </Text>
    {item.briefDescription && (
      <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
        {item.briefDescription}
      </Text>
    )}
    {item.photos?.[0] && (
      <Image
        source={{ uri: item.photos[0] ?? tripBackground }}
        style={{ height: 96, width: "100%", borderRadius: 8, marginTop: 8 }}
        resizeMode="cover"
      />
    )}
  </View>
);

// ─── Web branch ───────────────────────────────────────────────
const WebPlaceCardList = ({ places, onIndexChange }: PlaceCardListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(0);
  const onIndexChangeRef = useRef(onIndexChange);
  useLayoutEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  });


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let snapTimer: ReturnType<typeof setTimeout>;

    const snapAfterScroll = () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const STEP = CARD_WIDTH + SPACING;
        const rawIndex = el.scrollLeft / STEP;
        const index = Math.floor(rawIndex + 0.5);
        const clamped = Math.max(0, Math.min(index, places.length - 1));
        console.log(index, clamped);
        el.scrollTo({ left: clamped * STEP, behavior: "smooth" });
        if (clamped !== lastIndex.current) {
          lastIndex.current = clamped;
          onIndexChangeRef.current(clamped);
        }
      }, 80);
    };

    // ── Mouse drag ──────────────────────────────────────────
    let isDragging = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragScrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      el.scrollLeft = dragScrollLeft - (e.clientX - dragStartX);
      snapAfterScroll();
    };
    const onMouseUp = () => {
      isDragging = false;
      el.style.cursor = "grab";
    };

    // ── Wheel ────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += e.deltaX !== 0 ? e.deltaX : e.deltaY;
      snapAfterScroll();
    };

    // ── Touch ────────────────────────────────────────────────
    let touchStartX = 0;
    let touchScrollLeft = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = el.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      el.scrollLeft = touchScrollLeft + (touchStartX - e.touches[0].clientX);
      snapAfterScroll();
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseUp); // stop drag if cursor leaves
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      clearTimeout(snapTimer);
    };
  }, [places.length]);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        overflowX: "hidden",
        paddingLeft: SPACING,
        paddingRight: SPACING,
        cursor: "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {places.map((item, i) => (
        <div key={i} style={{ flexShrink: 0, marginRight: SPACING }}>
          <PlaceCard item={item} />
        </div>
      ))}
      <div style={{ flexShrink: 0, width: `calc(100% - ${CARD_WIDTH + SPACING}px)` }} />
    </div>
  );
};

// ─── Native branch (unchanged) ────────────────────────────────
const NativePlaceCardList = ({ places, onIndexChange }: PlaceCardListProps) => {
  const lastIndex = useRef(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING),
    );
    if (index !== lastIndex.current && places[index]) {
      lastIndex.current = index;
      onIndexChange(index);
    }
  };

  return (
    <FlatList
      data={places}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => i.toString()}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: SPACING }}
      onScroll={onScroll}
      renderItem={({ item }) => <PlaceCard item={item} />}
    />
  );
};

// ─── Single export, picks the right branch at runtime ─────────
const PlaceCardList = (props: PlaceCardListProps) =>
  Platform.OS === "web" ? (
    <WebPlaceCardList {...props} />
  ) : (
    <NativePlaceCardList {...props} />
  );

export default PlaceCardList;
