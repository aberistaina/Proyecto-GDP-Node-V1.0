import CustomPaletteProvider from "./CustomPaletteProvider";
import CustomReplaceUpdater from "./CustomReplaceUpdaterProvider";
import customTranslate from "./CustomTranslateProvider";
import CustomMarkerProvider from "./CustomMarkerProvider";
import CustomPropertiesProvider from "./CustomPropertiesProvider";
import CustomOverrideProvider from "./CustomOverrideProvider";
import PreventLaneDeleteProvider from "./PreventLaneDeleteProvider";




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
        __init__: ["preventLaneDeleteProvider"],
        preventLaneDeleteProvider: ["type", PreventLaneDeleteProvider],
    },
    {
        translate: ['value', customTranslate]
    }
    
];
