import CustomPaletteProvider from "./CustomPaletteProvider";
import CustomReplaceUpdater from "./CustomReplaceUpdaterProvider";
import customTranslate from "./CustomTranslateProvider";
import CustomMarkerProvider from "./CustomMarkerProvider";
import CustomPropertiesProvider from "./CustomPropertiesProvider";
import CustomOverrideProvider from "./CustomOverrideProvider";




export const customBpmnProviders = [
    CustomPropertiesProvider,
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
        __init__: ['customOverrideProvider'],
        customOverrideProvider: ['type', CustomOverrideProvider]
    },
    {
        translate: ['value', customTranslate]
    }
    
];
