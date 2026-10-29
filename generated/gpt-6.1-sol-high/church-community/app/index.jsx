import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const A = {
  portrait: require("../assets/portrait.png"),
  logo: require("../assets/logo.png"),
  quote: require("../assets/quote.png"),
  star: require("../assets/star.png"),
  hero: require("../assets/hero.png"),
  avatars: require("../assets/avatars.png"),
  arrow: require("../assets/arrow.png"),
  preacher: require("../assets/preacher.png"),
  play: require("../assets/play.png"),
};
const C = { dark: "#1D191A", cream: "#F1E5C6" };
const regular = "Manrope_400Regular",
  light = "Manrope_300Light",
  medium = "Manrope_500Medium";

function Type({ children, style, delay = 100, speed = 18, ...props }) {
  const value = React.Children.toArray(children).join("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(
        () =>
          setCount((c) => {
            if (c >= value.length) {
              clearInterval(interval);
              return c;
            }
            return c + 1;
          }),
        speed,
      );
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [value, delay, speed]);
  return (
    <Text {...props} accessibilityLabel={value} style={[s.text, style]}>
      <Text style={{ opacity: 0 }}>{value}</Text>
      <Text
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, width: "100%" }}
      >
        {value.slice(0, count)}
      </Text>
    </Text>
  );
}
function Arrow() {
  return (
    <Image
      source={A.arrow}
      style={{ width: 25, height: 25 }}
      resizeMode="contain"
    />
  );
}
function Header({ onMenu, close = false }) {
  return (
    <View style={s.header}>
      <View style={s.brand}>
        <Image
          source={A.logo}
          style={{ width: 46, height: 46 }}
          resizeMode="contain"
        />
        <Type style={s.brandText}>Christ Family{"\n"}Church</Type>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={close ? "Close menu" : "Open menu"}
        onPress={onMenu}
        style={s.menuButton}
      >
        {close ? (
          <>
            <View
              style={[s.line, s.cross, { transform: [{ rotate: "45deg" }] }]}
            />
            <View
              style={[s.line, s.cross, { transform: [{ rotate: "-45deg" }] }]}
            />
          </>
        ) : (
          <>
            <View style={s.line} />
            <View style={s.line} />
            <View style={[s.line, { width: 17 }]} />
          </>
        )}
      </Pressable>
    </View>
  );
}
function CTA({ onPress, label = "Join us", style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ hovered, pressed }) => [
        s.cta,
        style,
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: hovered ? "#e3d4ae" : C.cream,
        },
      ]}
    >
      <Type style={s.ctaText}>{label}</Type>
      <Arrow />
    </Pressable>
  );
}
function Testimonial({ onMore }) {
  return (
    <>
      <Image source={A.portrait} style={s.portrait} />
      <View style={s.sideText}>
        <Type style={s.sideName}>Anna Miller</Type>
        <Type style={s.sideRole}>Community Member</Type>
      </View>
      <Image source={A.quote} style={s.quoteIcon} resizeMode="contain" />
      <Type delay={250} style={s.quote}>
        We want to be a family where people can connect and benefit from
        friendships in Christ.
      </Type>
      <View style={s.service}>
        <Type delay={200} style={s.serviceTitle}>
          Sunday Worship{"\n"}Service
        </Type>
        <Type style={s.serviceDate}>Dec 7th, 10-11:30am</Type>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Learn more about Sunday Worship Service"
          onPress={onMore}
          style={s.learn}
        >
          <Type style={{ fontSize: 17, color: "#1a1a1a" }}>Learn more</Type>
          <Arrow />
        </Pressable>
        <Image source={A.star} style={s.star} resizeMode="contain" />
      </View>
    </>
  );
}
function Landing({ onJoin }) {
  return (
    <>
      <Image source={A.hero} style={s.hero} />
      <View style={[s.hero, { backgroundColor: "rgba(0,0,0,.15)" }]} />
      <Image source={A.avatars} style={s.avatars} resizeMode="contain" />
      <Type delay={250} style={s.headline}>
        Take a step{"\n"}toward the light
      </Type>
      <Type delay={450} style={s.subtext}>
        Discover faith, hope, and a home for your soul
      </Type>
      <CTA onPress={onJoin} style={{ bottom: 32 }} />
    </>
  );
}
const events = [
  ["14", "Dec", "Luke 1 | A Story From Zechariah", "6:30 - 8:00 pm"],
  ["21", "Dec", "Romans 15 | Living For Christ Alone", "8:30 - 10:00 am"],
  ["28", "Dec", "Romans 9 | The Sovereignty Of God", "5:30 - 7:00 pm"],
  ["4", "Jan", "John 3 | Born Again", ""],
];
function Events({ onPlay }) {
  return (
    <>
      <Image source={A.preacher} style={s.preacher} />
      <View style={[s.preacher, { backgroundColor: "rgba(0,0,0,.3)" }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Play Sunday sermon"
        onPress={onPlay}
        style={s.play}
      >
        <Image
          source={A.play}
          style={{ width: 65, height: 65 }}
          resizeMode="contain"
        />
      </Pressable>
      <View style={s.eventBody} />
      <View style={s.eventBand} />
      <Type style={s.upcoming}>Upcoming</Type>
      {events.map(([day, month, title, time], i) => (
        <View
          key={day}
          style={[
            s.eventRow,
            { top: 451 + i * 112, opacity: i === 3 ? 0.5 : 1 },
          ]}
        >
          <View
            style={[
              s.dateCard,
              { backgroundColor: i === 0 ? "#fff" : C.cream },
            ]}
          >
            <Type style={s.day}>{day}</Type>
            <Type style={s.month}>{month}</Type>
          </View>
          <View style={s.eventCopy}>
            <Type
              delay={250 + i * 100}
              style={[s.eventTitle, { color: i === 0 ? "#fff" : "#1a1a1a" }]}
            >
              {title}
            </Type>
            {!!time && <Type style={s.eventTime}>{time}</Type>}
          </View>
        </View>
      ))}
    </>
  );
}
function Phone({ initial, index, scale }) {
  const [screen, setScreen] = useState(initial),
    [menu, setMenu] = useState(false),
    [detail, setDetail] = useState(null);
  function navigate(link) {
    setMenu(false);
    setDetail(null);
    if (link === "Home") setScreen("home");
    if (link === "About") setScreen("about");
    if (link === "Events" || link === "Sermons") setScreen("events");
    if (link === "Contact") setDetail("join");
  }
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        setDetail(null);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  return (
    <View style={{ width: 379 * scale, height: 816 * scale, flexShrink: 0 }}>
      <Animated.View
        entering={FadeIn.duration(600).delay(index * 120)}
        style={[
          s.phone,
          { transform: [{ scale }], transformOrigin: "top left" },
        ]}
        testID={`phone-${index + 1}`}
      >
        <View style={s.artboard}>
          {screen === "about" ? (
            <Testimonial onMore={() => setDetail("service")} />
          ) : screen === "home" ? (
            <Landing onJoin={() => setDetail("join")} />
          ) : (
            <Events onPlay={() => setDetail("sermon")} />
          )}
          <Header onMenu={() => setMenu(true)} />
          {menu && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={s.overlay}
              accessibilityViewIsModal
            >
              <Header close onMenu={() => setMenu(false)} />
              <View style={s.links}>
                {["Home", "About", "Events", "Sermons", "Contact"].map(
                  (link, i) => (
                    <Pressable
                      key={link}
                      accessibilityRole="button"
                      accessibilityLabel={link}
                      onPress={() => navigate(link)}
                      style={({ hovered }) => ({ opacity: hovered ? 0.6 : 1 })}
                    >
                      <Type delay={i * 50} style={s.menuLink}>
                        {link}
                      </Type>
                    </Pressable>
                  ),
                )}
              </View>
              <CTA
                onPress={() => {
                  setMenu(false);
                  setDetail("join");
                }}
                style={{ bottom: 36 }}
              />
            </Animated.View>
          )}
          {detail && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={s.overlay}
              accessibilityViewIsModal
            >
              <Header close onMenu={() => setDetail(null)} />
              <View style={s.detail}>
                <Type style={s.detailEyebrow}>
                  {detail === "sermon"
                    ? "SUNDAY SERMON"
                    : "YOU’RE WELCOME HERE"}
                </Type>
                <Type style={s.detailTitle}>
                  {detail === "sermon"
                    ? "A Story From Zechariah"
                    : detail === "service"
                      ? "Sunday Worship Service"
                      : "Take your next step"}
                </Type>
                <Type style={s.detailText}>
                  {detail === "sermon"
                    ? "Luke 1 · December 14\n6:30 - 8:00 pm"
                    : detail === "service"
                      ? "December 7th\n10–11:30am\n\nConnect with our church family in worship."
                      : "Join us for Sunday Worship Service.\n\nDecember 7th\n10–11:30am"}
                </Type>
                {detail === "sermon" && (
                  <Type style={[s.detailText, { marginTop: 28, fontSize: 17 }]}>
                    The sermon recording is not available in this preview.
                  </Type>
                )}
              </View>
              <CTA
                label="Back"
                onPress={() => setDetail(null)}
                style={{ bottom: 36 }}
              />
            </Animated.View>
          )}
          <View pointerEvents="none" style={s.island} />
          <View pointerEvents="none" style={s.homeIndicator} />
        </View>
      </Animated.View>
    </View>
  );
}
export default function Showcase() {
  const { width } = useWindowDimensions();
  const mobile = width < 900;
  const scale = mobile ? Math.min(1, (width - 40) / 379) : 1;
  return (
    <ScrollView
      style={{ backgroundColor: "#5A4C41" }}
      contentContainerStyle={[
        s.showcase,
        {
          flexDirection: mobile ? "column" : "row",
          padding: mobile ? 20 : 40,
          gap: mobile ? 32 : 48,
          alignItems: mobile ? "center" : "flex-start",
          minWidth: mobile ? undefined : 1313,
        },
      ]}
      horizontal={!mobile}
      showsHorizontalScrollIndicator={false}
    >
      <Phone initial="about" index={0} scale={scale} />
      <Phone initial="home" index={1} scale={scale} />
      <Phone initial="events" index={2} scale={scale} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  text: { fontFamily: regular, color: "#fff" },
  showcase: { flexGrow: 1, justifyContent: "center", minHeight: "100%" },
  phone: {
    width: 379,
    height: 816,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#2a2a2a",
    backgroundColor: "#000",
    boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
    overflow: "hidden",
  },
  artboard: {
    width: 375,
    height: 812,
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: C.dark,
  },
  island: {
    position: "absolute",
    top: 10,
    left: 124.5,
    width: 126,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    zIndex: 200,
  },
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    left: 120.5,
    width: 134,
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,.3)",
    zIndex: 200,
  },
  header: {
    position: "absolute",
    left: 19,
    right: 19,
    top: 48,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandText: { fontSize: 17, lineHeight: 20, width: 165 },
  menuButton: {
    width: 38,
    height: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
  line: { height: 1.5, width: 27, backgroundColor: C.cream },
  cross: { position: "absolute", right: 0 },
  portrait: {
    position: "absolute",
    top: 120,
    left: 125,
    width: 240,
    height: 300,
  },
  sideText: {
    position: "absolute",
    width: 260,
    height: 43,
    left: -90,
    top: 235,
    transform: [{ rotate: "-90deg" }],
    flexDirection: "column",
    gap: 5,
  },
  sideName: {
    fontFamily: medium,
    fontSize: 14,
    letterSpacing: 1.2,
    color: "#ffffff80",
  },
  sideRole: { fontSize: 14, letterSpacing: 1.2, color: "#ffffff80" },
  quoteIcon: {
    position: "absolute",
    width: 28,
    height: 24,
    left: 19,
    top: 395,
  },
  quote: {
    position: "absolute",
    top: 440,
    left: 19,
    width: 336,
    fontSize: 20,
    lineHeight: 27,
    color: "rgba(255,255,255,.77)",
  },
  service: {
    position: "absolute",
    top: 567,
    left: 0,
    width: 375,
    height: 245,
    backgroundColor: "#fff",
    padding: 19,
  },
  serviceTitle: {
    fontFamily: medium,
    fontSize: 36,
    lineHeight: 41,
    letterSpacing: -0.5,
    color: "#1a1a1a",
  },
  serviceDate: { fontSize: 17, color: "#888", marginTop: 12 },
  learn: {
    position: "absolute",
    left: 19,
    bottom: 36,
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  star: { position: "absolute", width: 48, height: 48, right: 22, bottom: 30 },
  hero: { position: "absolute", top: 0, left: 0, width: 375, height: 472 },
  avatars: { position: "absolute", top: 442, left: 19, width: 149, height: 53 },
  headline: {
    position: "absolute",
    top: 520,
    left: 19,
    width: 340,
    fontFamily: light,
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: -2.5,
    color: C.cream,
  },
  subtext: {
    position: "absolute",
    top: 642,
    left: 19,
    width: 330,
    fontSize: 21,
    lineHeight: 27,
    color: "rgba(255,255,255,.6)",
  },
  cta: {
    position: "absolute",
    left: 19,
    right: 19,
    height: 52,
    backgroundColor: C.cream,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  ctaText: { fontFamily: medium, fontSize: 21, color: C.dark },
  preacher: {
    position: "absolute",
    width: 415,
    height: 345,
    left: -20,
    top: 0,
  },
  play: {
    position: "absolute",
    left: 155,
    top: 175,
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: C.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  eventBody: {
    position: "absolute",
    top: 343,
    left: 0,
    width: 375,
    bottom: 0,
    backgroundColor: "#fff",
  },
  eventBand: {
    position: "absolute",
    top: 343,
    left: 0,
    width: 375,
    height: 220,
    backgroundColor: C.dark,
  },
  upcoming: {
    position: "absolute",
    top: 370,
    left: 19,
    fontSize: 38,
    letterSpacing: -0.8,
    lineHeight: 49,
  },
  eventRow: {
    position: "absolute",
    left: 19,
    right: 19,
    height: 90,
    flexDirection: "row",
    gap: 18,
  },
  dateCard: {
    width: 68,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  day: { fontSize: 34, lineHeight: 43, fontFamily: medium, color: "#1a1a1a" },
  month: { fontSize: 18, lineHeight: 25, color: "#1a1a1a" },
  eventCopy: { flex: 1, paddingTop: 4 },
  eventTitle: { fontSize: 21, lineHeight: 26 },
  eventTime: { fontSize: 17, color: "#999", marginTop: 7 },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: C.dark,
    zIndex: 100,
  },
  links: { position: "absolute", top: 173, left: 29, right: 19, gap: 22 },
  menuLink: {
    fontFamily: light,
    fontSize: 36,
    lineHeight: 45,
    letterSpacing: -0.8,
  },
  detail: { position: "absolute", top: 178, left: 25, right: 25 },
  detailEyebrow: { fontSize: 12, letterSpacing: 2, color: C.cream },
  detailTitle: {
    fontSize: 42,
    lineHeight: 48,
    fontFamily: light,
    color: C.cream,
    marginTop: 25,
  },
  detailText: {
    fontSize: 21,
    lineHeight: 30,
    color: "#ffffffb3",
    marginTop: 28,
  },
});
