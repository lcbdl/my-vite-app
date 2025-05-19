import en from "./en";

const fr: typeof en = {
  translation: {
    calendar: {
      weekday: {
        sunday: { label: "Dim", shortLabel: "Di", value: "Dimanche" },
        monday: { label: "Lun", shortLabel: "Lu", value: "Lundi" },
        tuesday: { label: "Mar", shortLabel: "Ma", value: "Mardi" },
        wednesday: { label: "Mer", shortLabel: "Me", value: "Mercredi" },
        thursday: { label: "Jeu", shortLabel: "Je", value: "Jeudi" },
        friday: { label: "Ven", shortLabel: "Ve", value: "Vendredi" },
        saturday: { label: "Sam", shortLabel: "Sa", value: "Samedi" },
      },
      year: "Année",
      month: "Mois",
      day: "Jour",
      hour: "Heure",
      minute: "Minute",
      second: "Seconde",
      invalidDateFormat: "Format de date invalide, veuillez utiliser {{format}}",
    },
  },
};
export default fr;
