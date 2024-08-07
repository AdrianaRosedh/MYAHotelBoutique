#!/bin/bash

echo "Running PurgeCSS with debug information..."

content_path="/Users/adrianarosediaz/Desktop/MYAHotelBoutique/app/templates/**/*.html"
css_path="/Users/adrianarosediaz/Desktop/MYAHotelBoutique/app/static/src/css/**/*.css"
output_path="/Users/adrianarosediaz/Desktop/MYAHotelBoutique/purged_css"

echo "Content path: $content_path"
echo "CSS path: $css_path"
echo "Output path: $output_path"

echo "Listing HTML files:"
find /Users/adrianarosediaz/Desktop/MYAHotelBoutique/app/templates -name '*.html'

echo "Listing CSS files:"
find /Users/adrianarosediaz/Desktop/MYAHotelBoutique/app/static/src/css -name '*.css'

echo "Running PurgeCSS..."
npx purgecss --content "$content_path" --css "$css_path" --output "$output_path" --verbose
