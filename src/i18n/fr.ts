import en from "./en";

const fr: typeof en = {
  translation: {
    common: {
      to: "à",
      close: "Fermer",
      ok: "D'accord",
      cancel: "Annuler",
    },
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
      months: {
        january: { label: "Jan", shortLabel: "Ja", value: "Janvier", numValue: 1 },
        february: { label: "Fév", shortLabel: "Fe", value: "Février", numValue: 2 },
        march: { label: "Mar", shortLabel: "Ma", value: "Mars", numValue: 3 },
        april: { label: "Avr", shortLabel: "Ap", value: "Avril", numValue: 4 },
        may: { label: "Mai", shortLabel: "Ma", value: "Mai", numValue: 5 },
        june: { label: "Jui", shortLabel: "Ju", value: "Juin", numValue: 6 },
        july: { label: "Jul", shortLabel: "Ju", value: "Juillet", numValue: 7 },
        august: { label: "Aoû", shortLabel: "Au", value: "Août", numValue: 8 },
        september: { label: "Sep", shortLabel: "Se", value: "Septembre", numValue: 9 },
        october: { label: "Oct", shortLabel: "Oc", value: "Octobre", numValue: 10 },
        november: { label: "Nov", shortLabel: "No", value: "Novembre", numValue: 11 },
        december: { label: "Déc", shortLabel: "De", value: "Décembre", numValue: 12 },
      },
      nextMonth: "Mois Prochain",
      prevMonth: "Mois Précédent",
      year: "Année",
      month: "Mois",
      day: "Jour",
      hour: "Heure",
      minute: "Minute",
      second: "Seconde",
      invalidDateFormat: "Format de date invalide, veuillez utiliser {{format}}",
      showYears: "Afficher les années",
      chooseDate: "Choisir une date",
      chooseTime: "Choisir l'heure",
      date: "date",
      today: "Aujourd'hui",
    },
  },
};
export default fr;
