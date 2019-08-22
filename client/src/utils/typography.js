import Typography from "typography";
import stAnnesTheme from "typography-theme-st-annes";

stAnnesTheme.baseFontSize = "15.75px";
stAnnesTheme.baseLineHeight = 1.55;
stAnnesTheme.scaleRatio = 2.2;
stAnnesTheme.headerWeight = 700;
stAnnesTheme.headerGrayHue = "warm";
stAnnesTheme.bodyGrayHue = "warm";

const typography = new Typography(stAnnesTheme);

// Export helper functions
export const { scale, rhythm, options } = typography;
export default typography;
