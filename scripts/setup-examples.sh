#!/usr/bin/env sh

# Perform a build of the library
pnpm build

# Get the current directory
ROOT_DIR=$(pwd)
# Change to the examples directory
cd "$ROOT_DIR"/examples || exit
# Loop through each sub-directory
for dir in */; do
	# Remove the trailing slash from the directory name
	dir=$(basename "$dir")
	# Change to the sub-directory
	cd "$dir" || exit
	# Keep the user informed of progress
	echo ""
	echo "---"
	echo "Installing dependencies for $dir"
	echo "---"
	# Run pnpm install
	pnpm install
	# Change back to the $ROOT_DIR/examples directory
	cd "$ROOT_DIR"/examples || exit
done

# Change back to the root directory
cd "$ROOT_DIR" || exit
