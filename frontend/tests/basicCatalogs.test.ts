import assert from "node:assert/strict";
import test from "node:test";
import {
  BASIC_CATALOG_PATH,
  basicCatalogs,
  getAvailableBasicCatalogs,
  getBasicCatalogQueryKey,
  groupBasicCatalogNavigation,
} from "../src/catalog/basicCatalogs.ts";
import type {
  NavigationModule,
  NavigationOption,
} from "../src/navigation/navigation.types.ts";

function option(
  id: number,
  rutaFrontend: string,
  children: NavigationOption[] = [],
): NavigationOption {
  return { id, nombre: `Option ${id}`, rutaFrontend, children };
}

function module(id: number, opciones: NavigationOption[]): NavigationModule {
  return { id, nombre: `Module ${id}`, orden: id, opciones };
}

test("registers all 13 catalogs without duplicate routes", () => {
  assert.equal(basicCatalogs.length, 13);
  assert.equal(new Set(basicCatalogs.map((catalog) => catalog.id)).size, 13);
});

test("preserves existing query keys, including the plural test-type cache key", () => {
  for (const catalog of basicCatalogs) {
    assert.deepEqual(getBasicCatalogQueryKey(catalog.id), [
      catalog.id === "tipo-prueba" ? "tipo-pruebas" : catalog.id,
    ]);
  }
});

test("only exposes permitted catalogs, including nested options", () => {
  const navigation = [
    module(1, [
      option(1, "/administration/estado-civil"),
      option(2, "", [option(3, "/administration/tipo-sesion")]),
      option(4, "/administration/usuarios"),
    ]),
  ];
  assert.deepEqual(
    getAvailableBasicCatalogs(navigation).map((catalog) => catalog.id),
    ["estado-civil", "tipo-sesion"],
  );
  assert.deepEqual(getAvailableBasicCatalogs([]), []);
});

test("all existing catalog permissions remain available", () => {
  const navigation = [
    module(
      1,
      basicCatalogs.map((catalog, index) =>
        option(index, `/administration/${catalog.id}`),
      ),
    ),
  ];
  assert.deepEqual(getAvailableBasicCatalogs(navigation), basicCatalogs);
  assert.equal(groupBasicCatalogNavigation(navigation)[0].opciones.length, 1);
});

test("collapses catalogs across modules into one menu entry without mutating permissions", () => {
  const navigation = [
    module(1, [
      option(1, "/administration/usuarios"),
      option(2, "/administration/estado-civil"),
      option(3, "/administration/tipo-sesion"),
    ]),
    module(2, [
      option(4, "", [
        option(5, "/administration/categoria-diagnostica"),
        option(6, "/sesiones"),
      ]),
    ]),
  ];
  const original = structuredClone(navigation);
  const grouped = groupBasicCatalogNavigation(navigation);

  assert.deepEqual(navigation, original);
  assert.deepEqual(grouped[0].opciones[0], original[0].opciones[0]);
  assert.equal(grouped[0].opciones[1].rutaFrontend, BASIC_CATALOG_PATH);
  assert.equal(grouped[0].opciones[1].nombre, "Catálogos básicos");
  assert.equal(grouped[0].opciones.length, 2);
  assert.deepEqual(grouped[1].opciones[0].children, [
    original[1].opciones[0].children[1],
  ]);
  assert.equal(getAvailableBasicCatalogs(navigation).length, 3);
});

test("does not add a catalog menu entry when the user has no catalog permissions", () => {
  const navigation = [module(1, [option(1, "/pacientes")])];
  assert.deepEqual(groupBasicCatalogNavigation(navigation), navigation);
  assert.deepEqual(groupBasicCatalogNavigation([]), []);
});
