import { useEffect, useRef, useState, FC, ReactNode, ChangeEvent } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";

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

const AudioPlayer: FC<AudioPlayerProps> = ({
  src,
  waveColor = "#a3aed0",
  progressColor = "#3311db",
  cursorColor = "blue",
  buttonsColor = "#3311db",
  barWidth = 2,
  barRadius = 2,
  barGap = 1,
  height = 100,
  className = "",
  playIcon = <FaPlay className="text-lg " />,
  pauseIcon = <FaPause className="text-lg " />,
  volumeUpIcon = <BsFillVolumeUpFill className="h-7 w-7 " />,
  volumeMuteIcon = <BsFillVolumeMuteFill className="h-7 w-7 " />,
  playbackSpeeds = [1, 1.5, 2],
  onPlay,
  onPause,
  onVolumeChange,
}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");
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
        setDuration(formatTime(wavesurfer.current?.getDuration() || 0));
      });

      wavesurfer.current.on("audioprocess", () => {
        setCurrentTime(formatTime(wavesurfer.current?.getCurrentTime() || 0));
      });

      wavesurfer.current.on("play", () => {
        setPlaying(true);
      });

      wavesurfer.current.on("pause", () => {
        setPlaying(false);
      });
    }

    return () => {
      wavesurfer.current?.destroy();
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
        onPause?.();
      } else {
        onPlay?.();
      }
    }
  };

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (wavesurfer.current) {
      if (muted) {
        setMuted(false);
      }
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
      onVolumeChange?.(newVolume);
    }
  };

  const toggleMute = () => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(muted ? volume : 0);
      setMuted(!muted);
    }
  };

  const formatTime = (seconds: number) => {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`flex w-full flex-col items-center rounded-lg p-4 ${className}`}
    >
      <div className="flex w-full justify-between text-sm text-gray-400">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>

      <div ref={waveformRef} className="my-2 w-full " />

      <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="mt-2 flex items-center justify-between gap-5">
          <button
            onClick={togglePlay}
            className={`flex w-10 items-center justify-center rounded-full p-2 `}
            style={{ color: buttonsColor }}
          >
            {playing ? pauseIcon : playIcon}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} style={{ color: buttonsColor }}>
              {muted || volume === 0 ? volumeMuteIcon : volumeUpIcon}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              style={{
                accentColor: buttonsColor,
                height: "2px",
                borderRadius: "10px",
              }}
              className="w-24 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex gap-1">
            {playbackSpeeds.map((speed) => (
              <button
                key={speed}
                onClick={() => setPlayBackSpeed(speed)}
                style={{
                  background: playBackSpeed === speed ? buttonsColor : "",
                  borderColor: playBackSpeed !== speed ? buttonsColor : "",
                  color: playBackSpeed !== speed ? buttonsColor : "#fff",
                }}
                className={`w-12 rounded-md  p-2 ${
                  playBackSpeed !== speed && "border"
                } `}
              >
                {speed}x
              </button>
            ))}
          </div>
          <button
            onClick={handleDownloadAudio}
            style={{
              background: buttonsColor,
            }}
            className={`flex items-center gap-2 rounded-md border p-2 text-white`}
          >
            <FaDownload className="h-4 w-4" /> Audio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
