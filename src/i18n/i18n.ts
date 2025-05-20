import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import fr from "./fr";

const options = {
  order: ["cookie", "localStorage", "path", "navigator"],
  lookupQuerystring: "lang",
  lookupCookie: "lang",
  lookupLocalStorage: "lang",
  lookupFromPathIndex: 0,
};

i18n.use(initReactI18next).init({
  debug: true,
  supportedLngs: ["en", "fr"],
  lng: "en",
  detection: options,
  fallbackLng: "en",
  resources: { en, fr },
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
