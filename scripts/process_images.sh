#!/usr/bin/env bash

ROOT_DIR=$( realpath $( dirname "${BASH_SOURCE[0]}" ) )/..

optimize_images () {
    directory=$1
    size=$2
    format=$3
    quality=$4
    output_directory="${1}-${2}"
    
    rm -rf $output_directory
    cp -r $directory $output_directory
    cd $output_directory
    GLOBIGNORE="*.svg"
    #mogrify -resize ${size}^ -gravity Center -extent ${size} -format ${format} -quality ${quality} *
    mogrify -adaptive-resize ${size}\> -format ${format} -quality ${quality} *
    rm -f *.jpg *.jpeg *.png *.gif
    unset GLOBIGNORE
}

# Optimize AI-generated images
optimize_images ${ROOT_DIR}/images/ai-generated 800x800 webp 90
