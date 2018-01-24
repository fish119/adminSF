const defaultTheme = {
  "primary": "#00BCD4",
  "secondary": "#00ACC1",
  "accent": "#FF4081",
  "error": "#F44336",
  "warning": "#ffeb3b",
  "info": "#2196F3",
  "success": "#4CAF50"
};
const red = {
  primary: "#f44336",
  secondary: "#e57373",
  accent: "#9c27b0",
  error: "#f44336",
  warning: "#ffeb3b",
  info: "#2196f3",
  success: "#4caf50"
}
const teal = {
  primary: "#009688",
  secondary: "#00796B",
  accent: "#FF6D00",
  error: "#f44336",
  warning: "#ffeb3b",
  info: "#2196f3",
  success: "#4caf50"
}
const darken_blue_grey = {
  primary: "#263238",
  secondary: "#37474F",
  accent: "#009688",
  error: "#f44336",
  warning: "#ffeb3b",
  info: "#2196f3",
  success: "#4caf50"
}
export default {
  install: function (Vue, options) {
    Vue.prototype.changeTheme = function (themeName) {
      switch (themeName) {
        case 'red':
          this.$vuetify.theme = red;
          break;
        case 'teal':
          this.$vuetify.theme = teal;
          break;
        case 'dark':
          this.$vuetify.theme = darken_blue_grey;
          break;
        default:
          this.$vuetify.theme = defaultTheme;
      }
    }
  }
};
