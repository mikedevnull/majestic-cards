import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/card-list.tsx"),
  ...prefix("browse", [
    layout("routes/browse/layout.tsx", [
      route("artists", "routes/browse/artists.tsx"),
      route("artists/:artistId", "routes/browse/albumsByArtist.tsx"),
    ]),
  ]),
  ...prefix("api", [
    route("albumArtwork/:artworkId", "resources/albumArtwork.ts"),
  ]),
] satisfies RouteConfig;
