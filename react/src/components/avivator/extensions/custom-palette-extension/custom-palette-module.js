import {
  apply_transparent_color,
  apply_brightness_contrast_gamma,
} from '../shader-utils';

const fs = `\
uniform vec3 transparentColor;
uniform bool useTransparentColor;
uniform float opacity;

uniform vec3 colors[6];
uniform float brightness[6];
uniform float contrast[6];
uniform float gamma[6];

${apply_transparent_color}

${apply_brightness_contrast_gamma}

void mutate_color(
  inout vec3 rgb,
  float intensity0, 
  float intensity1, 
  float intensity2, 
  float intensity3, 
  float intensity4, 
  float intensity5
) { 
  rgb += max(0.0, min(1.0, intensity0)) * 
    apply_brightness_contrast_gamma(vec3(colors[0]), brightness[0], contrast[0], gamma[0]);
  rgb += max(0.0, min(1.0, intensity1)) * 
    apply_brightness_contrast_gamma(vec3(colors[1]), brightness[1], contrast[1], gamma[1]);
  rgb += max(0.0, min(1.0, intensity2)) * 
    apply_brightness_contrast_gamma(vec3(colors[2]), brightness[2], contrast[2], gamma[2]);
  rgb += max(0.0, min(1.0, intensity3)) * 
    apply_brightness_contrast_gamma(vec3(colors[3]), brightness[3], contrast[3], gamma[3]);
  rgb += max(0.0, min(1.0, intensity4)) * 
    apply_brightness_contrast_gamma(vec3(colors[4]), brightness[4], contrast[4], gamma[4]);
  rgb += max(0.0, min(1.0, intensity5)) * 
    apply_brightness_contrast_gamma(vec3(colors[5]), brightness[5], contrast[5], gamma[5]);
}

vec4 apply_opacity(vec3 rgb) {
  return vec4(apply_transparent_color(rgb, transparentColor, useTransparentColor, opacity));
}
`;

const DECKGL_MUTATE_COLOR = `\
vec3 rgb = rgba.rgb;
mutate_color(rgb, intensity0, intensity1, intensity2, intensity3, intensity4, intensity5);
rgba = apply_opacity(rgb);
`;

const customPalette = {
  name: 'custom-palette-module',
  fs,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': DECKGL_MUTATE_COLOR,
  },
};

export default customPalette;
