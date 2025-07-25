import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

import PlaceList from "./PlaceList";
import { useTripPlanner } from "../contexts/TripPlannerContext";

function DrawerPlaceList() {
  const { isOpen, setIsOpen, data } = useTripPlanner();
  const handleClose = () => {
    setIsOpen(false);
  };

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
