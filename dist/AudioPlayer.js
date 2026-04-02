import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
const AudioPlayer = forwardRef(({ src, waveColor = "#a3aed0", progressColor = "#3311db", cursorColor = "blue", buttonsColor = "#3311db", barWidth = 2, barRadius = 2, barGap = 1, height = 100, className = "", playIcon = _jsx(FaPlay, { className: "text-lg " }), pauseIcon = _jsx(FaPause, { className: "text-lg " }), volumeUpIcon = _jsx(BsFillVolumeUpFill, { className: "h-7 w-7 " }), volumeMuteIcon = _jsx(BsFillVolumeMuteFill, { className: "h-7 w-7 " }), playbackSpeeds = [1, 1.5, 2], onPlay, onPause, onVolumeChange, }, ref) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    useImperativeHandle(ref, () => ({
        getCurrentTime: () => { var _a, _b; return (_b = (_a = wavesurfer.current) === null || _a === void 0 ? void 0 : _a.getCurrentTime()) !== null && _b !== void 0 ? _b : 0; },
    }));
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [playBackSpeed, setPlayBackSpeed] = useState(playbackSpeeds[0]);
    useEffect(() => {
        if (waveformRef.current) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor,
                progressColor,
                cursorColor,
                barWidth,
                barGap,
                barRadius,
                height,
                normalize: true,
                audioRate: playBackSpeed,
            });
            wavesurfer.current.load(src);
            wavesurfer.current.on("ready", () => {
                var _a;
                setDuration(formatTime(((_a = wavesurfer.current) === null || _a === void 0 ? void 0 : _a.getDuration()) || 0));
            });
            wavesurfer.current.on("audioprocess", () => {
                var _a;
                setCurrentTime(formatTime(((_a = wavesurfer.current) === null || _a === void 0 ? void 0 : _a.getCurrentTime()) || 0));
            });
            wavesurfer.current.on("play", () => {
                setPlaying(true);
            });
            wavesurfer.current.on("pause", () => {
                setPlaying(false);
            });
        }
        return () => {
            var _a;
            (_a = wavesurfer.current) === null || _a === void 0 ? void 0 : _a.destroy();
        };
    }, [
        src,
        waveColor,
        progressColor,
        cursorColor,
        barWidth,
        barRadius,
        barGap,
        height,
    ]);
    useEffect(() => {
        if (wavesurfer.current) {
            wavesurfer.current.setPlaybackRate(playBackSpeed);
        }
    }, [playBackSpeed]);
    const togglePlay = () => {
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
            setPlaying(!playing);
            if (playing) {
                onPause === null || onPause === void 0 ? void 0 : onPause();
            }
            else {
                onPlay === null || onPlay === void 0 ? void 0 : onPlay();
            }
        }
    };
    const handleVolume = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (wavesurfer.current) {
            if (muted) {
                setMuted(false);
            }
            wavesurfer.current.setVolume(newVolume);
            setVolume(newVolume);
            onVolumeChange === null || onVolumeChange === void 0 ? void 0 : onVolumeChange(newVolume);
        }
    };
    const toggleMute = () => {
        if (wavesurfer.current) {
            wavesurfer.current.setVolume(muted ? volume : 0);
            setMuted(!muted);
        }
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };
    const handleDownloadAudio = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "audio.mp3";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.log(error);
        }
    };
    return (_jsxs("div", { className: `flex w-full flex-col items-center rounded-lg p-4 ${className}`, children: [_jsxs("div", { className: "flex w-full justify-between text-sm text-gray-400", children: [_jsx("span", { children: currentTime }), _jsx("span", { children: duration })] }), _jsx("div", { ref: waveformRef, className: "my-2 w-full " }), _jsxs("div", { className: "flex w-full flex-col justify-between gap-3 md:flex-row md:items-center", children: [_jsxs("div", { className: "mt-2 flex items-center justify-between gap-5", children: [_jsx("button", { onClick: togglePlay, className: `flex w-10 items-center justify-center rounded-full p-2 `, style: { color: buttonsColor }, children: playing ? pauseIcon : playIcon }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: toggleMute, style: { color: buttonsColor }, children: muted || volume === 0 ? volumeMuteIcon : volumeUpIcon }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: muted ? 0 : volume, onChange: handleVolume, style: {
                                            accentColor: buttonsColor,
                                            height: "2px",
                                            borderRadius: "10px",
                                        }, className: "w-24 cursor-pointer" })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-5", children: [_jsx("div", { className: "flex gap-1", children: playbackSpeeds.map((speed) => (_jsxs("button", { onClick: () => setPlayBackSpeed(speed), style: {
                                        background: playBackSpeed === speed ? buttonsColor : "",
                                        borderColor: playBackSpeed !== speed ? buttonsColor : "",
                                        color: playBackSpeed !== speed ? buttonsColor : "#fff",
                                    }, className: `w-12 rounded-md  p-2 ${playBackSpeed !== speed && "border"} `, children: [speed, "x"] }, speed))) }), _jsxs("button", { onClick: handleDownloadAudio, style: {
                                    background: buttonsColor,
                                }, className: `flex items-center gap-2 rounded-md border p-2 text-white`, children: [_jsx(FaDownload, { className: "h-4 w-4" }), " Audio"] })] })] })] }));
});
export default AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map