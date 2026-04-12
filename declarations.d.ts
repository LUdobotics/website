declare module '*.png' {
    const value: string;
    export default value;
}

interface Window {
    countApiAllTime?: (res: { value: number }) => void;
    countApiToday?: (res: { value: number }) => void;
    countApiHitAllTime?: (res: { value: number }) => void;
    countApiHitToday?: (res: { value: number }) => void;
}
