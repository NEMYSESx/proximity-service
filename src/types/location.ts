export interface Location {
  latitude: number;
  longitude: number;
}

export interface MarkerData extends Location {
  socket_id: string;
}

export interface RoutingProps {
  myLocation?: Location;
  otherLocation?: MarkerData;
}
export interface SideBarProps extends RoutingProps {
  handleRoute: () => void;
}
