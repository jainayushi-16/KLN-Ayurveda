import { useMediaQuery } from "react-responsive";
export function useBreakpoint() {
    const isSm = useMediaQuery({ maxWidth: 639 });
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ maxWidth: 1024 });
    const isMd = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
    const isLg = useMediaQuery({ minWidth: 1024, maxWidth: 1279 });
    const isXl = useMediaQuery({ minWidth: 1280 });
    return { isSm, isMd, isLg, isXl, isMobile, isTablet };
}
