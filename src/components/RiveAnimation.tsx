/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
  src: string;
  stateMachines?: string;
  autoplay?: boolean;
  className?: string;
  onLoad?: () => void;
  onStateChange?: (event: any) => void;
}

export default function RiveAnimation({
  src,
  stateMachines,
  autoplay = true,
  className = "",
  onLoad,
  onStateChange
}: RiveAnimationProps) {
  const { RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad,
    onStateChange,
  });

  return <RiveComponent className={className} />;
}