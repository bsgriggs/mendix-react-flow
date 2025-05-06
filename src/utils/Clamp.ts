export default function Clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
}
