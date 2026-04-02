import { ReactNode } from "react";
export type AudioPlayerHandle = {
    getCurrentTime: () => number;
};
type AudioPlayerProps = {
    src: string;
    waveColor?: string;
    progressColor?: string;
    cursorColor?: string;
    buttonsColor?: string;
    barWidth?: number;
    barRadius?: number;
    barGap?: number;
    height?: number;
    className?: string;
    playIcon?: ReactNode;
    pauseIcon?: ReactNode;
    volumeUpIcon?: ReactNode;
    volumeMuteIcon?: ReactNode;
    playbackSpeeds?: number[];
    onPlay?: () => void;
    onPause?: () => void;
    onVolumeChange?: (volume: number) => void;
};
declare const AudioPlayer: import("react").ForwardRefExoticComponent<AudioPlayerProps & import("react").RefAttributes<AudioPlayerHandle>>;
export default AudioPlayer;
//# sourceMappingURL=AudioPlayer.d.ts.map