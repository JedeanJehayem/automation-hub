import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import type Konva from "konva";
import type { MapArea } from "@/lib/eventmap-store";
import { STATUS_COLOR } from "@/lib/eventmap-store";

interface Props {
  areas: MapArea[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, additive: boolean) => void;
  onHover: (id: string | null) => void;
  width: number;
  height: number;
}

export function FloorPlanCanvas({ areas, selectedIds, onToggleSelect, onHover, width, height }: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Reset to fit
  useEffect(() => {
    setScale(Math.min(width / 950, height / 520, 1));
    setPos({ x: 0, y: 0 });
  }, [width, height]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - pos.x) / oldScale,
      y: (pointer.y - pos.y) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.3, Math.min(3, oldScale * (direction > 0 ? 1.1 : 0.9)));
    setScale(newScale);
    setPos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      draggable
      onWheel={handleWheel}
      scaleX={scale}
      scaleY={scale}
      x={pos.x}
      y={pos.y}
      onDragEnd={(e) => setPos({ x: e.target.x(), y: e.target.y() })}
      style={{ background: "#0f1218", borderRadius: 12 }}
    >
      {/* Grid */}
      <Layer listening={false}>
        {Array.from({ length: 40 }).map((_, i) => (
          <Rect key={`gx${i}`} x={i * 40} y={0} width={1} height={1000} fill="#1a1f2b" />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <Rect key={`gy${i}`} x={0} y={i * 40} width={1500} height={1} fill="#1a1f2b" />
        ))}
      </Layer>
      <Layer>
        {areas.map((a) => {
          const selected = selectedIds.has(a.id);
          const color = STATUS_COLOR[a.status];
          return (
            <Group
              key={a.id}
              x={a.x}
              y={a.y}
              onMouseEnter={(e) => {
                onHover(a.id);
                const c = e.target.getStage();
                if (c) c.container().style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                onHover(null);
                const c = e.target.getStage();
                if (c) c.container().style.cursor = "grab";
              }}
              onClick={(e) => onToggleSelect(a.id, e.evt.shiftKey || e.evt.metaKey || e.evt.ctrlKey)}
              onTap={(e) => onToggleSelect(a.id, e.evt.shiftKey)}
            >
              <Rect
                width={a.width}
                height={a.height}
                fill={color}
                opacity={selected ? 1 : 0.78}
                stroke={selected ? "#ffffff" : "#0b0d12"}
                strokeWidth={selected ? 3 : 1.5}
                cornerRadius={6}
                shadowColor="black"
                shadowBlur={selected ? 12 : 0}
                shadowOpacity={0.4}
              />
              <Text
                text={a.code}
                width={a.width}
                align="center"
                y={a.height / 2 - 14}
                fontSize={16}
                fontStyle="bold"
                fill="#0b0d12"
              />
              <Text
                text={`${a.sqm} m²`}
                width={a.width}
                align="center"
                y={a.height / 2 + 4}
                fontSize={11}
                fill="#0b0d12"
                opacity={0.75}
              />
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}