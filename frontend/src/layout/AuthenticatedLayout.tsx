import NavigationProvider from "../navigation/NavigationProvider";

import MainLayout from "./MainLayout";

export default function AuthenticatedLayout() {
  return (
    <NavigationProvider>
      <MainLayout />
    </NavigationProvider>
  );
}
