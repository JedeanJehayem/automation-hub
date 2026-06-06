import { createFileRoute } from "@tanstack/react-router";
import { EventMapPage } from "@/components/eventmap/EventMapPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Planta Interativa — TechExpo Brasil" },
      {
        name: "description",
        content:
          "Planta interativa de evento: reserva de áreas, controle de status e atualizações em tempo real.",
      },
    ],
  }),
  component: EventMapPage,
});
