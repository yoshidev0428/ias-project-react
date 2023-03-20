export const apply_transparent_color = `\
vec4 apply_transparent_color(vec3 color, vec3 transparentColor, bool useTransparentColor, float opacity){
  return vec4(color, (color == transparentColor && useTransparentColor) ? 0. : opacity);
}
`;

export const apply_brightness_contrast_gamma = `\
vec3 apply_brightness_contrast_gamma(vec3 rgb, float b, float c, float g) {
  rgb += b;
  if (c > 0.0) {
    if (c == 1.) c = 0.9999999;
    rgb = (rgb - 0.5) / (1.0 - c) + 0.5;
  } else {
    rgb = (rgb - 0.5) * (1.0 + c) + 0.5;
  }
  return pow(rgb, vec3(g));
}
`;

export const validate_color_bound = `\
vec3 validate_color_bound(vec3 rgb) {
  if (rgb.x < 0.0) rgb.x = 0.0;
  if (rgb.y < 0.0) rgb.y = 0.0;
  if (rgb.z < 0.0) rgb.z = 0.0;
  if (rgb.x > 1.0) rgb.x = 1.0;
  if (rgb.y > 1.0) rgb.y = 1.0;
  if (rgb.z > 1.0) rgb.z = 1.0;
  return rgb;
}
`;
