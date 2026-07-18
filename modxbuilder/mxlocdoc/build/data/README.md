# mxLocDoc build data

These files are adapted from `apps/sendit/back/modxbuilder/sendit/build/data/`.

The old `modxbuilder` includes `transport.*.php` files unconditionally. These
files query objects created in the MODX manager by category or namespace, so the
transport reflects the live stand state during package build.
