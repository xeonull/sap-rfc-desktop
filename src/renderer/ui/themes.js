const corpColors = {
  "primary-blue-darken": "#004077", //Основной темно-синий
  "primary-blue": "#0070ba", //Основной синий
  "secondary-blue": "#2fb4e9", //Дополнительный голубой
  "secondary-black": "#000000", //Дополнительный черный
  "secondary-gray": "#706f6f", //Дополнительный серый (для текстов)
  "secondary-gray-lighten": "#b2b2b2", //Дополнительный серебристый (для печати)
  "secondary-white": "#FFFFFF", //Дополнительный белый (фоновый)
};

const corpDarkTheme = {
  dark: true,
  colors: {
    background: "#212328",
    "bg-head": "#2b3039",
    "bg-head-lighten": "#444c5b",
    surface: "#2b3039",
    "on-surface": "#EAF0F6",
    // "on-surface-accent": "#EAF0F6",
    "surface-variant": "#212328", //"#ab2c2c",
    "on-surface-variant": "#767676",
    text: "#EAF0F6",
    primary: corpColors["primary-blue"],
    "primary-lighten": "#2b3039",
    "on-primary": "#EAF0F6",
    secondary: corpColors["secondary-blue"],
    "secondary-gray": corpColors["secondary-gray"],
    "secondary-gray-lighten": corpColors["secondary-gray-lighten"],
    error: "#ab2c2c",
    info: "#FF6600",
    success: "#00FF00",
    warning: "#FFFF00",
  },
};

const corpLightTheme = {
  dark: false,
  colors: {
    background: corpColors["secondary-white"],
    "bg-head": corpColors["primary-blue"],
    "bg-head-lighten": corpColors["secondary-blue"],
    surface: "#FAFAFA",
    "on-surface": corpColors["secondary-black"],
    // "on-surface-accent": corpColors["secondary-white"],
    "surface-variant": corpColors["secondary-black"], //"#c42626",
    "on-surface-variant": "#DEDEDE",
    text: corpColors["secondary-black"],
    primary: corpColors["secondary-blue"],
    "on-primary": "#FAFAFA",
    "primary-lighten": corpColors["primary-blue"],
    secondary: corpColors["primary-blue-darken"],
    "secondary-gray": corpColors["secondary-gray"],
    "secondary-gray-lighten": corpColors["secondary-gray-lighten"],
    error: "#c42626",
  },
};

export { corpLightTheme, corpDarkTheme };
