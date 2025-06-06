This file provides guidelines for contributors and how automated checks should be executed when modifying files in this repository.

## Repository Overview

This project is a TypeScript library located under `src/` with precompiled JavaScript output in `dist/`. It relies on Node.js and has no unit tests at the moment. The library can be built with `npm run build`.

## Coding Guidelines

- Use TypeScript syntax that targets Node.js 16 or newer.
- Follow the existing file and folder structure. Source files live in `src/`. Compiled output should remain in `dist/`.
- Keep code style consistent with the surrounding files (2 spaces for indentation, Unix line endings).
- Document exported classes and functions using JSDoc comments.

## Documentation

- Any major changes should include updates to the relevant Markdown documents.
- The English version of the project documentation is located in `README.en.md`.

## Build Checks

- Run `npm install` if dependencies have not been installed.
- Run `npm run build` before committing changes to ensure the TypeScript code compiles successfully. Commit the code only if the build passes.

## Pull Request Description

When creating a pull request, summarize the major changes in a "Summary" section and provide the build command output in a "Testing" section. If any command fails due to environment limitations, include the provided disclaimer.
