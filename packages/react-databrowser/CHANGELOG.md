# @upstash/react-databrowser

## 0.3.20

### Patch Changes

- 8df8484: add keepAlive:false back

## 0.3.19

### Patch Changes

- f6872f5: fix alignment of cancel button in delete modal

## 0.3.18

### Patch Changes

- 9ffa44d: Refresh data display when the same key or reload button is clicked

## 0.3.17

### Patch Changes

- 64df54a: Disable sorting arrays when pretty printing

## 0.3.16

### Patch Changes

- 6dd82f0: disable keepAlive

## 0.3.15

### Patch Changes

- 58df4bc: fix bug with cursor parsing

## 0.3.14

### Patch Changes

- a3caa2b: Log all fetch errors to console

## 0.3.13

### Patch Changes

- 5d761ff: fix bug with json data not getting prettified
- 76aff24: Bumping upstash/redis to version 1.31.3

## 0.3.12

### Patch Changes

- 3663026: Fix JSON serialization issue

## 0.3.11

### Patch Changes

- 12dfe68: fix small bug with pagination of zset, set, hash and lists
- a8181db: fix bug with json editing not working because of pipeline

## 0.3.10

### Patch Changes

- 078a577: Fix last page sometimes being empty
- bb40047: Fix deserialization bug
- 73aa996: Enable autoPipeline in the redis client

## 0.3.9

### Patch Changes

- e648094: fix pagination not resetting when type filter changes
- 893eecc: Implement a better way for fetching keys and their types using less commands

## 0.3.8

### Patch Changes

- 61283d6: Fix problems with pagination logic, adding and the toaster

## 0.3.7

### Patch Changes

- 67822e6: Add tooltip for long contents

## 0.3.6

### Patch Changes

- 76c50c5: Added tooltip for truncated labels.

## 0.3.5

### Patch Changes

- Added button to copy object fields

## 0.3.4

### Patch Changes

- 2e09e1c: Prevent databrowser to fail when listing redis key

## 0.3.3

### Patch Changes

- c747134: Fix json stringify logic

## 0.3.2

### Patch Changes

- ab3c6a9: Fix key parsing issue when ratelimiter analytics active

## 0.3.1

### Patch Changes

- 079369b: Add timestamp to key fetcher to always keep in sycn with up to date data

## 0.3.0

### Minor Changes

- 1d59d01: Improved search bar by taking entire space for easier use,
  Replace editor with monaco editor for better DX
  Replaced skeleton loader with spinner

## 0.2.10

### Patch Changes

- b077fd7: Fix HSET parsing issue

## 0.2.9

### Patch Changes

- b36a874: Fixed hash set ordering and made data update easier

## 0.2.8

### Patch Changes

- b3a50ab: Fixed search and added ability to edit values for string and json

## 0.2.7

### Patch Changes

- 8b5bd86: Change name of the button

## 0.2.6

### Patch Changes

- ab48ae0: Increase the size of add modal and disable hover of type tags

## 0.2.5

### Patch Changes

- 9e43697: Delete type attr from buttons

## 0.2.4

### Patch Changes

- e1c748c: Move save changes long css to global

## 0.2.3

### Patch Changes

- e136904: Use plain button assign all the classes manually

## 0.2.2

### Patch Changes

- 609ab32: Remove typeof check from transform method used for parsing hashes

## 0.2.1

### Patch Changes

- e3f2e38: Minor fixes for resetting states

## 0.2.0

### Minor Changes

- 4d8d0a6: Style changes to databrowser and disabling of sourcemap and allowing minimize in cli

## 0.1.1

### Patch Changes

- dd0964c: Fix style issues

## 0.1.0

### Minor Changes

- 119e7be: Add ability to view streams in databrowser

## 0.0.7

### Patch Changes

- ff6d5ba: Bumped postcss version to get rid of dependabot warning

## 0.0.6

### Patch Changes

- c51eb3a: Applied formatter and linter

## 0.0.5

### Patch Changes

- 3b2095b: update publishConfig

## 0.0.4

### Patch Changes

- f393b2f: do something

## 0.0.3

### Patch Changes

- Allow passing token and url as a prop addition to env keys

## 0.0.2

### Patch Changes

- first release
