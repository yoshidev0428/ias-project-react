const fs = `\
uniform float brightness;
uniform float contrast;
uniform float gamma;

vec4 brightnessContrastGamma_filterColor(vec4 color) {
  color.rgb += brightness;
  if (contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
  }
  // color.rgb = pow(color.rgb, vec3(gamma));
  return color;
}

vec4 brightnessContrastGamma_filterColor(vec4 color, vec2 texSize, vec2 texCoords) {
  return brightnessContrastGamma_filterColor(color);
}
`;

const uniforms = {
  brightness: {value: 0, min: -1, max: 1},
  contrast: {value: 0, min: -1, max: 1},
  gamma: { value: 0.45, min: 0, max: 1}
};

export const viewerShader = {
  name: 'brightnessContrastGamma',
  uniforms,
  fs,
  passes: [{filter: true}]
};

export default viewerShader;
