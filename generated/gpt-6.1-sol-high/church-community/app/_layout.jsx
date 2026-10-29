import { Slot } from "expo-router";
import {
  useFonts,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
} from "@expo-google-fonts/manrope";
import "./global.css";
export default function Layout() {
  const [loaded, error] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
  });
  if (!loaded && !error) return null;
  return <Slot />;
}
