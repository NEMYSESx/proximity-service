export interface Location {
  latitude: number;
  longitude: number;
}

export interface MarkerData extends Location {
  socket_id: string;
}

export interface SideBarProps {
  myLocation?: Location;
  otherLocation?: MarkerData;
}
