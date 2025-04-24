import CustomPaletteProvider from "./CustomPaletteProvider";
import CustomReplaceUpdater from "./CustomReplaceUpdaterProvider";
import customTranslate from "./CustomTranslateProvider";
import CustomMarkerProvider from "./CustomMarkerProvider";
import CustomPropertiesProvider from "./CustomPropertiesProvider";


export const customBpmnProviders = [
    {
        __init__: ["customPaletteProvider"],
        customPaletteProvider: ["type", CustomPaletteProvider],
    },
    {
        __init__: ["customReplaceUpdater"],
        customReplaceUpdater: ["type", CustomReplaceUpdater],
    },
    {
        __init__: ["customMarkerProvider"],
        customMarkerProvider: ["type", CustomMarkerProvider],
    },
    {
        __init__: ['customPropertiesProvider'],
        customPropertiesProvider: ['type', CustomPropertiesProvider]
    },
    {
        translate: ['value', customTranslate]
    }
    
];
