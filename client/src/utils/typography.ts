import Typography from "typography";
// @ts-ignore
import theme from "typography-theme-ocean-beach";

const typography = new Typography(theme);
export const { scale, rhythm, options } = typography;
export default typography;
