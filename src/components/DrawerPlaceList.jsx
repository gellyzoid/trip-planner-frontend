import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

import PlaceList from "./PlaceList";

function DrawerPlaceList({ data, isOpen, handleClose }) {
  return (
    <Drawer open={isOpen} onClose={handleClose} position="right">
      <DrawerHeader title="Landmarks" />
      <DrawerItems>
        <PlaceList places={data} />
      </DrawerItems>
    </Drawer>
  );
}

export default DrawerPlaceList;
